#include <cstring>
#include <memory>
#include <mutex>
#include <string>

#include "Enclave_t.h"
#include "common/tcrypto_ext.h"
#include "sgx_trts.h"

#ifndef NDEBUG
#include <cassert>
#endif  // NDEBUG

#include "sgx_ql_lib_common.h"
#include "sgx_quote_3.h"
#include "sgx_utils.h"

// for debug
#include "openssl/ec.h"
#include "openssl/evp.h"
#include "openssl/pem.h"
#include "openssl/rsa.h"

#define OUTPUT_BUF_SZ 4000

namespace {

// global variable of private key hold by the enclave
uint8_t* enclave_public_key = nullptr;
size_t enclave_public_key_size = 0;
uint8_t* enclave_private_key = nullptr;
size_t enclave_private_key_size = 0;

uint8_t enc_iv_buf[AES_GCM_IV_SIZE] = {0};

// --- execution context --- //
// the public key of the enclave
thread_local char output_buf[OUTPUT_BUF_SZ];
thread_local size_t actual_output_size;

// invoked after completing an request no matter success/failure
void ClearRequestContext() { memset(output_buf, 0, OUTPUT_BUF_SZ); }
// invoke upon failure and final tear down.
void ClearExecutionContext() { ClearRequestContext(); }

inline void printf(const char* msg) { ocall_debug_print_string(msg); }

// TODO
std::string decrypt_content(const char* input_data, size_t input_data_size,
                            std::string* output_key) {
  const char* tag = input_data + (input_data_size - 16);
  const char* iv = input_data + (input_data_size - 12 - 16);
  const char* peer_pub_key_str =
      input_data + (input_data_size - 12 - 16 - EC_PUBLIC_KEY_SIZE);

  // printf("peer key: %s\n", std::string{peer_pub_key_str,
  // EC_PUBLIC_KEY_SIZE}.c_str());

  // load peer key
  EVP_PKEY* peer_pub_key = EVP_PKEY_new();
  load_public_key(peer_pub_key_str, EC_PUBLIC_KEY_SIZE, &peer_pub_key);

  // load enclave private key
  EVP_PKEY* own_key = EVP_PKEY_new();
  load_private_key((const char*)enclave_private_key, enclave_private_key_size,
                   &own_key);

  // derive shared secret
  std::string secret = derive_ecdh_secret(own_key, peer_pub_key);
  std::string session_key = kdf_derive((const unsigned char*)secret.c_str(),
                                       secret.size(), "info", 4, 16);

  EVP_PKEY_free(peer_pub_key);
  EVP_PKEY_free(own_key);

  // decrypt the content
  EVP_CIPHER_CTX* ctx;
  if (!(ctx = EVP_CIPHER_CTX_new())) return "";
  if (EVP_DecryptInit_ex(ctx, EVP_aes_128_gcm(), NULL,
                         (const unsigned char*)session_key.c_str(),
                         (const unsigned char*)iv) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return "";
  }

  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, (void*)tag);

  int plaintext_len;
  int len;

  unsigned char decrypted[input_data_size - 44];
  if (EVP_DecryptUpdate(ctx, decrypted, &len, (const unsigned char*)input_data,
                        input_data_size - 16 - 12 - EC_PUBLIC_KEY_SIZE) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    // printf("EVP_DecryptUpdate failed\n");
    return "";
  }
  // printf("decrypted data updated to (%dB)\n", len);
  output_key->assign((char*)decrypted + len - OUTPUT_KEY_LENGTH,
                     OUTPUT_KEY_LENGTH);
  std::string ret{(char*)decrypted, len - OUTPUT_KEY_LENGTH};
  EVP_CIPHER_CTX_free(ctx);
  return ret;

  // assert(input_data_size >= MAX_SESSION_KEY_IV_LENGTH +
  // ENCRYPTED_SESSION_KEY_LENGTH); const char* iv = input_data +
  // (input_data_size - MAX_SESSION_KEY_IV_LENGTH); const char* ek = input_data
  // + (input_data_size - MAX_SESSION_KEY_IV_LENGTH -
  // ENCRYPTED_SESSION_KEY_LENGTH); int encrypted_input_len = input_data_size -
  // (MAX_SESSION_KEY_IV_LENGTH + ENCRYPTED_SESSION_KEY_LENGTH);

  // // perform decryption
  // int decrypted_len;
  // unsigned char* decrypted = rsa_decrypt_data((const unsigned char*)
  // input_data, encrypted_input_len, (const unsigned char*) ek,
  // ENCRYPTED_SESSION_KEY_LENGTH, (const unsigned char*) iv,
  // enclave_private_key, enclave_private_key_size, &decrypted_len);
  // output_key->assign((char*)decrypted + decrypted_len-OUTPUT_KEY_LENGTH,
  // OUTPUT_KEY_LENGTH); std::string ret{(char*)decrypted,
  // decrypted_len-OUTPUT_KEY_LENGTH};

  // if (decrypted) free(decrypted);
  // return ret;
}

std::string exec(const char* input, size_t input_len) {
  return "hello " + std::string(input, input_len);
}

// TODO
sgx_status_t encrypt_output(const std::string& output_plain,
                            const std::string& output_key,
                            std::string* encrypt_output) {
  EVP_CIPHER_CTX* ctx;
  if (!(ctx = EVP_CIPHER_CTX_new())) return SGX_ERROR_UNEXPECTED;

  if (EVP_EncryptInit_ex(ctx, EVP_aes_128_gcm(), NULL,
                         (const unsigned char*)output_key.data(),
                         enc_iv_buf) != 1) {
    // if(EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return SGX_ERROR_UNEXPECTED;
  }

  unsigned char ciphertext[output_plain.size()];

  int ciphertext_len;
  int len;
  if (EVP_EncryptUpdate(ctx, ciphertext, &len,
                        (const unsigned char*)output_plain.data(),
                        output_plain.size()) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return SGX_ERROR_UNEXPECTED;
  }
  ciphertext_len = len;

  if (EVP_EncryptFinal_ex(ctx, ciphertext + len, &len) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return SGX_ERROR_UNEXPECTED;
  }
  ciphertext_len += len;

  unsigned char tag[AES_GCM_TAG_SIZE] = {
      0,
  };
  // tag needed for gcm, not for cbc
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, 16, tag);
  EVP_CIPHER_CTX_free(ctx);
  encrypt_output->assign((char*)ciphertext, ciphertext_len);
  encrypt_output->append((char*)enc_iv_buf, AES_GCM_IV_SIZE);
  encrypt_output->append((char*)tag, AES_GCM_TAG_SIZE);

  // ocall_debug_print_hex((const uint8_t*)encrypt_output->data(),
  // encrypt_output->size());
  return SGX_SUCCESS;
}
}  // anonymous namespace

sgx_status_t enc_get_key_and_report(const sgx_target_info_t* qe_target_info,
                                    sgx_report_t* app_report, uint8_t* key,
                                    size_t key_size) {
  // prepare in enclave key
  uint8_t* public_key_buffer = nullptr;
  size_t public_key_size = 0;
  uint8_t* private_key_buffer = nullptr;
  size_t private_key_size = 0;
  // sgx_status_t status = generate_key_pair(RSA_TYPE, &public_key_buffer,
  // &public_key_size, &private_key_buffer, &private_key_size);
  sgx_status_t status =
      generate_key_pair(EC_TYPE, &public_key_buffer, &public_key_size,
                        &private_key_buffer, &private_key_size);
  if (status != SGX_SUCCESS) {
    if (private_key_buffer) free(private_key_buffer);
    if (public_key_buffer) free(public_key_buffer);
    return status;
  }

  // ocall_debug_print(public_key_buffer, public_key_size);
  // ocall_debug_print(private_key_buffer, private_key_size);

  // copy the private key to enclave global variable
  enclave_public_key = public_key_buffer;
  enclave_public_key_size = public_key_size;
  enclave_private_key = private_key_buffer;
  enclave_private_key_size = private_key_size;

  // obtain the hash to include in report
  sgx_sha_state_handle_t sha_handle = nullptr;
  status = sgx_sha256_init(&sha_handle);
  if (status != SGX_SUCCESS) {
    return status;
  }

  status = sgx_sha256_update(enclave_public_key, (uint32_t)public_key_size,
                             sha_handle);
  if (status != SGX_SUCCESS) {
    return status;
  }

  sgx_sha256_hash_t hash = {0};
  status = sgx_sha256_get_hash(sha_handle, &hash);
  if (status != SGX_SUCCESS) {
    return status;
  }

  sgx_report_data_t report_data = {0};
  memcpy(report_data.d, hash, sizeof(hash));

  sgx_sha256_close(sha_handle);

  status = sgx_create_report(qe_target_info, &report_data, app_report);
  if (key_size == enclave_public_key_size) {
    memcpy(key, enclave_public_key, enclave_public_key_size);
    // ocall_debug_print_hex(enclave_private_key, enclave_public_key_size);
  } else {
    std::string msg = "key buffer is not large enough: need" +
                      std::to_string(enclave_public_key_size) +
                      "bytes, but only" + std::to_string(key_size) +
                      "bytes provided.";
    ocall_debug_print_string(msg.c_str());
    return SGX_ERROR_INVALID_PARAMETER;
  }

  return status;
}

sgx_status_t enc_run(const char* input_data, size_t input_data_size,
                     size_t* output_size) {
  // allocate buffer to host decrypted contents
  std::string output_key;
  // user input decryption
  auto decrypt_input =
      decrypt_content(input_data, input_data_size, &output_key);

  sgx_status_t ret = SGX_SUCCESS;

  // All ready, execute the task on input

  std::string output_plain = exec(decrypt_input.data(), decrypt_input.size());

  // encrypt the output
  std::string output;
  sgx_status_t status = encrypt_output(output_plain, output_key, &output);
  if (status == SGX_SUCCESS) memcpy(output_buf, output.data(), output.size());

  // set output size for untrusted memory allocation
  actual_output_size = (ret == SGX_SUCCESS) ? output.size() : 0;
  *output_size = actual_output_size;

#ifndef NDEBUG
  // ocall_debug_print_hex(output_buf, output_size);
#endif  // NDEBUG

  // free resources
  return ret;
}

sgx_status_t enc_get_output(uint8_t* ret, size_t size) {
  // check if enough space in untrusted memory
  if ((sgx_is_outside_enclave(ret, size) != 1) && (size < actual_output_size))
    return SGX_ERROR_UNEXPECTED;

  memcpy(ret, output_buf, actual_output_size);
  // clear execution context
  ClearRequestContext();
  return SGX_SUCCESS;
}

void enc_clear_exec_context() { ClearExecutionContext(); }
