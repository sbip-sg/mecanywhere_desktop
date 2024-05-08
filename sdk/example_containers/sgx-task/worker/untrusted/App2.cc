// a fully untrusted version of App for debugging
// #define WORKER_ENCLAVE_FILENAME "Worker_Enclave.signed.so"
#define REQUEST_COUNT 4

#include <cstring>
#include <memory>

#include "worker.h"
#include "common/hexutil.h"

// for test
#include <chrono>
#include <iostream>
#include <thread>
#include <vector>
#include <fstream>

#include "openssl/ec.h"
#include "openssl/evp.h"
#include "openssl/pem.h"
#include "openssl/rsa.h"

#define RSA_PUBLIC_KEY_SIZE 512
#define RSA_PRIVATE_KEY_SIZE 2048

#define RSA_3072_PUBLIC_KEY_SIZE 650
#define RSA_3072_PRIVATE_KEY_SIZE 3072

#define RSA_TYPE 0
#define EC_TYPE 1 // EC-P384

#define MAX_SESSION_KEY_IV_LENGTH 16
// #define ENCRYPTED_SESSION_KEY_LENGTH 256
#define ENCRYPTED_SESSION_KEY_LENGTH 384
#define OUTPUT_KEY_LENGTH 16

#define AES_GCM_IV_SIZE 12
#define AES_GCM_TAG_SIZE 16

#define MAX_SESSION_KEY_IV_LENGTH 16


/* A 128 bit key */
unsigned char output_key[16] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
                        0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35};

// /* A 96 bit IV */
// unsigned char iv[12] = {0x99, 0xaa, 0x3e, 0x68, 0xed, 0x81, 0x73, 0xa0,
//                         0xee, 0xd0, 0x66, 0x84};

struct EncryptedRequest {
  std::string encrypted_secret_data;
  std::string encrypted_session_key;
  std::string iv;
}; 

uint8_t* enclave_public_key = nullptr;
size_t enclave_public_key_size = 0;
uint8_t* enclave_private_key = nullptr;
size_t enclave_private_key_size = 0;

uint8_t enc_iv_buf[AES_GCM_IV_SIZE] = {0};


thread_local char output_buf[4000];
thread_local size_t actual_output_size;


int get_pkey_by_rsa(EVP_PKEY *pk)
{
    int res = -1;
    EVP_PKEY_CTX *ctx = NULL;

    ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, NULL);
    if (ctx == NULL)
        return res;
    res = EVP_PKEY_keygen_init(ctx);
    if (res <= 0)
    {
        // PRINT("keygen_init failed (%d)\n", res);
        goto done;
    }

    res = EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, RSA_3072_PRIVATE_KEY_SIZE);
    if (res <= 0)
    {
        // PRINT("set_rsa_kengen_bits failed (%d)\n", res);
        goto done;
    }

    /* Generate key */
    res = EVP_PKEY_keygen(ctx, &pk);
    if (res <= 0)
    {
        // PRINT("keygen failed (%d)\n", res);
        goto done;
    }

done:
    if (ctx)
        EVP_PKEY_CTX_free(ctx);

    return res;

}

int get_pkey_by_ec(EVP_PKEY *pk)
{
    int res = -1;
    EVP_PKEY_CTX *ctx;

    ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_EC, NULL);
    if (ctx == NULL)
        return res;
    res = EVP_PKEY_keygen_init(ctx);
    if (res <= 0)
    {
        // PRINT("EC_generate_key failed (%d)\n", res);
        goto done;
    }

    res = EVP_PKEY_CTX_set_ec_paramgen_curve_nid(ctx, NID_secp384r1);
    if (res <= 0)
    {
        // PRINT("EC_generate_key failed (%d)\n", res);
        goto done;
    }

    /* Generate key */
    res = EVP_PKEY_keygen(ctx, &pk);
    if (res <= 0)
    {
        // PRINT("EC_generate_key failed (%d)\n", res);
        goto done;
    }

done:
    if (ctx)
        EVP_PKEY_CTX_free(ctx);

    return res;
}


// actually is generating RSA pair
// hardware independant
sgx_status_t generate_key_pair(
    int type,
    uint8_t** public_key,
    size_t* public_key_size,
    uint8_t** private_key,
    size_t* private_key_size)
{
    sgx_status_t result = SGX_ERROR_UNEXPECTED;
    uint8_t* local_public_key = nullptr;
    uint8_t* local_private_key = nullptr;
    int res = -1;
    EVP_PKEY* pkey = nullptr;
    BIO* bio = nullptr;

    pkey = EVP_PKEY_new();
    if (!pkey)
    {
        // PRINT("EVP_PKEY_new failed\n");
        result = SGX_ERROR_UNEXPECTED;
        goto done;
    }

    if (type != RSA_TYPE && type != EC_TYPE)
    {
        type = RSA_TYPE; // by default, we use RSA_TYPE
    }

    switch(type)
    {
        case RSA_TYPE:
            res = get_pkey_by_rsa(pkey);
            break;
        case EC_TYPE:
            res = get_pkey_by_ec(pkey);
            break;
    }

    if (res <= 0)
    {
        // PRINT("get_pkey failed (%d)\n", res);
        result = SGX_ERROR_UNEXPECTED;
        goto done;
    }

    // Allocate memory
    local_public_key = (uint8_t*)malloc(RSA_3072_PUBLIC_KEY_SIZE);
    if (!local_public_key)
    {
        // PRINT("out-of-memory:calloc(local_public_key failed\n");
        result = SGX_ERROR_OUT_OF_EPC;
        goto done;
    }
    memset(local_public_key, 0x00, RSA_3072_PUBLIC_KEY_SIZE);

    local_private_key = (uint8_t*)malloc(RSA_3072_PRIVATE_KEY_SIZE);
    if (!local_private_key)
    {
        // PRINT("out-of-memory: calloc(local_private_key) failed\n");
        result = SGX_ERROR_OUT_OF_EPC;
        goto done;
    }
    memset(local_private_key, 0x00, RSA_3072_PRIVATE_KEY_SIZE);

    // Write out the public/private key in PEM format for exchange with
    // other enclaves.
    bio = BIO_new(BIO_s_mem());
    if (!bio)
    {
        // PRINT("BIO_new for local_public_key failed\n");
        goto done;
    }

    res = PEM_write_bio_PUBKEY(bio, pkey);
    if (!res)
    {
        // PRINT("PEM_write_bio_PUBKEY failed (%d)\n", res);
        goto done;
    }

    res = BIO_read(bio, local_public_key, RSA_3072_PUBLIC_KEY_SIZE);
    if (!res)
    {
        // PRINT("BIO_read public key failed (%d)\n", res);
        goto done;
    }
    BIO_free(bio);
    bio = nullptr;

    bio = BIO_new(BIO_s_mem());
    if (!bio)
    {
        // PRINT("BIO_new for local_public_key failed\n");
        goto done;
    }

    res = PEM_write_bio_PrivateKey(
        bio, pkey, nullptr, nullptr, 0, nullptr, nullptr);
    if (!res)
    {
        // PRINT("PEM_write_bio_PrivateKey failed (%d)\n", res);
        goto done;
    }

    res = BIO_read(bio, local_private_key, RSA_3072_PRIVATE_KEY_SIZE);
    if (!res)
    {
        // PRINT("BIO_read private key failed (%d)\n", res);
        goto done;
    }

    BIO_free(bio);
    bio = nullptr;

    *public_key = local_public_key;
    *private_key = local_private_key;

    *public_key_size = strlen(reinterpret_cast<const char *>(local_public_key));
    *private_key_size = strlen(reinterpret_cast<const char *>(local_private_key));

    // PRINT("public_key_size %d, private_key_size %d\n", *public_key_size, *private_key_size);
    result = SGX_SUCCESS;

done:
    if (bio)
        BIO_free(bio);
    if (pkey)
        EVP_PKEY_free(pkey); // When this is called, rsa is also freed
    if (result != SGX_SUCCESS)
    {
        if (local_public_key)
            free(local_public_key);
        if (local_private_key)
            free(local_private_key);
    }
    return result;
}

std::string get_key_and_report() {
  uint8_t* public_key_buffer = nullptr;
  size_t public_key_size = 0;
  uint8_t* private_key_buffer = nullptr;
  size_t private_key_size = 0;
  sgx_status_t status = generate_key_pair(RSA_TYPE, &public_key_buffer, &public_key_size, &private_key_buffer, &private_key_size);
  if (status != SGX_SUCCESS) {
    if (private_key_buffer) free(private_key_buffer);
    if (public_key_buffer) free(public_key_buffer);
    return "";
  }
  
  // copy the private key to enclave global variable
  enclave_public_key = public_key_buffer;
  enclave_public_key_size = public_key_size;
  enclave_private_key = private_key_buffer;
  enclave_private_key_size = private_key_size;

  // print the keys to file
  std::ofstream public_key_file;
  public_key_file.open("public_key.pem");
  public_key_file << std::string((char*)public_key_buffer, public_key_size);
  public_key_file.close();

  std::ofstream private_key_file;
  private_key_file.open("private_key.pem");
  private_key_file << std::string((char*)private_key_buffer, private_key_size);
  private_key_file.close();

  return std::string((char*)enclave_public_key, enclave_public_key_size);
}

std::string encrypt_request(const std::string& data, const std::string& enclave_public_key) {
  std::string plaintext{data}; 
  plaintext.append((char*)output_key, 16);
  int encrypted_message_len = 0;
  unsigned char* ek = NULL;
  int ek_len = 0;
  unsigned char iv[MAX_SESSION_KEY_IV_LENGTH];
  memset(iv, 0, MAX_SESSION_KEY_IV_LENGTH);
  size_t encrypted_message_max_length = plaintext.size()+EVP_MAX_IV_LENGTH;
  unsigned char encrypted[encrypted_message_max_length];
  memset(encrypted, 0, encrypted_message_max_length);

  BIO* bio = NULL;
  bio = BIO_new_mem_buf(enclave_public_key.data(), enclave_public_key.size());
  RSA* rssPublicKey = NULL;
  PEM_read_bio_RSA_PUBKEY(bio, &rssPublicKey, NULL, NULL);
  EVP_PKEY *pkey = EVP_PKEY_new();
  EVP_PKEY_assign_RSA(pkey, rssPublicKey);
  EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
  EVP_CIPHER_CTX_init(ctx);
  ek = (unsigned char*) malloc(EVP_PKEY_size(pkey));
  EVP_SealInit(ctx, EVP_aes_256_cbc(), &ek, &ek_len, iv, &pkey, 1);
  printf("encrypted session key length: %d\n", ek_len);
  
  printf("secret data to send (%ldB): \n", plaintext.size());
  BIO_dump_fp(stdout, (const char*) plaintext.data(), plaintext.size());
  printf("encrypted symmetric key to send (%dB): \n", ek_len);
  BIO_dump_fp(stdout, (const char*) ek, ek_len);
  printf("symmetric key iv to send (%dB): \n", MAX_SESSION_KEY_IV_LENGTH);
  BIO_dump_fp(stdout, (const char*) iv, MAX_SESSION_KEY_IV_LENGTH);

  int encrypted_block_len = 0;
  EVP_SealUpdate(ctx, encrypted, &encrypted_block_len, (const unsigned char*) plaintext.data(), plaintext.size());
  encrypted_message_len = encrypted_block_len;
  printf("encrypt message length update to %d\n", encrypted_message_len);
  EVP_SealFinal(ctx, encrypted + encrypted_block_len, &encrypted_block_len);
  encrypted_message_len += encrypted_block_len;
  printf("encrypt message length update to %d\n", encrypted_message_len);
  EVP_CIPHER_CTX_free(ctx);
  BIO_free(bio);
  EVP_PKEY_free(pkey);

  std::string ret = std::string((char*)encrypted, encrypted_message_len);
  ret.append((char*)ek, ek_len);
  ret.append((char*)iv, MAX_SESSION_KEY_IV_LENGTH);

  if (ek) free(ek);

  printf("the whole message to send (%ldB): \n", ret.size());
  BIO_dump_fp(stdout, ret.data(), ret.size());

  // save the encrypted message to file
  std::ofstream encrypted_message_file;
  encrypted_message_file.open("encrypted_message.txt");
  encrypted_message_file << ret;
  encrypted_message_file.close();

  return ret;
}

std::string decrypt_response(const std::string& data) {
    uint8_t tag[16];
    memcpy(tag, data.data()+data.size()-16, 16);
    uint8_t iv[12];
    memcpy(iv, data.data()+data.size()-28, 12);
    size_t encrypt_len = data.size()-28;
    EVP_CIPHER_CTX *ctx;
    /* Create and initialise the context */
    if(!(ctx = EVP_CIPHER_CTX_new())) return "";

    if(EVP_DecryptInit_ex(ctx, EVP_aes_128_gcm(), NULL, output_key, iv)!=1) {
      EVP_CIPHER_CTX_free(ctx);
      return "";
    }

    // BIO_dump_fp(stdout, (const char*) data.data(), data.size()-32);
    printf("encrypted data (%ldB): \n", encrypt_len);
    BIO_dump_fp(stdout, (const char*) data.data(), encrypt_len);
    printf("tag: \n");
    BIO_dump_fp(stdout, (const char*) tag, 16);

    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, tag);

    uint8_t plaintext[encrypt_len];
    int plaintext_len;
    int len;
    if(EVP_DecryptUpdate(ctx, plaintext, &len, (const unsigned char*)data.data(), encrypt_len)!=1) {
      EVP_CIPHER_CTX_free(ctx);
      return "";
    }
    plaintext_len = len;
    // printf("so far plaintext len: %d\n", plaintext_len);

    if (EVP_DecryptFinal_ex(ctx, plaintext + len, &len) !=1) {
      EVP_CIPHER_CTX_free(ctx);
      return "";
    }
    plaintext_len += len;
    // printf("plaintext (%dB):\n", plaintext_len);
    // std::string ret;
    // ret.assign((char*)plaintext, plaintext_len);
    // printf("%s\n", ret.c_str());

    EVP_CIPHER_CTX_free(ctx);
    return std::string((char*)plaintext, plaintext_len);
}

unsigned char* rsa_decrypt_data(const unsigned char* data, int len, const unsigned char* ek, int ek_len, const unsigned char* iv, const uint8_t* rsa_private_key, int rsa_private_key_len, int* output_len) {
  printf("iv for decrypt (%dB): \n", MAX_SESSION_KEY_IV_LENGTH);
  BIO_dump_fp(stdout, (const char*) iv, MAX_SESSION_KEY_IV_LENGTH);
  printf("ek for decrypt (%dB): \n", ENCRYPTED_SESSION_KEY_LENGTH);
  BIO_dump_fp(stdout, (const char*) ek, ENCRYPTED_SESSION_KEY_LENGTH);
  printf("data to decrypt (%dB): \n", len);
  BIO_dump_fp(stdout, (const char*) data, len);
  printf("decrypt rsa key (%dB): \n", rsa_private_key_len);
  BIO_dump_fp(stdout, (const char*) rsa_private_key, rsa_private_key_len);


  BIO* bio = nullptr;
  bio = BIO_new_mem_buf(rsa_private_key, rsa_private_key_len);
  RSA* loaded_private_key = NULL;
  PEM_read_bio_RSAPrivateKey(bio, &loaded_private_key, NULL, NULL);
  EVP_PKEY* pkey = EVP_PKEY_new();
  EVP_PKEY_assign_RSA(pkey, loaded_private_key);
  EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
  EVP_CIPHER_CTX_init(ctx);

  unsigned char* decrypted = (unsigned char*)malloc(len + EVP_MAX_IV_LENGTH);
  EVP_OpenInit(ctx, EVP_aes_256_cbc(), ek, ek_len, iv, pkey);
  int decrypted_len = 0;
  int decyprtedBlockLen = 0;
  EVP_OpenUpdate(ctx, decrypted, &decyprtedBlockLen, data, len);
  decrypted_len = decyprtedBlockLen;
  EVP_OpenFinal(ctx, decrypted + decrypted_len, &decyprtedBlockLen);
  decrypted_len += decyprtedBlockLen;
  *output_len = decrypted_len;
  // free ctx
  EVP_CIPHER_CTX_free(ctx);
  BIO_free(bio);
  EVP_PKEY_free(pkey);
  return decrypted;
}


std::string decrypt_content(const char* input_data, size_t input_data_size, std::string* output_key) {
    const char* iv = input_data + (input_data_size - MAX_SESSION_KEY_IV_LENGTH);
    const char* ek = input_data + (input_data_size - MAX_SESSION_KEY_IV_LENGTH - ENCRYPTED_SESSION_KEY_LENGTH);
    int encrypted_input_len = input_data_size - (MAX_SESSION_KEY_IV_LENGTH + ENCRYPTED_SESSION_KEY_LENGTH);
    // perform decryption
    int decrypted_len;
    unsigned char* decrypted = rsa_decrypt_data((unsigned char*) input_data, encrypted_input_len, (unsigned char*) ek, ENCRYPTED_SESSION_KEY_LENGTH, (unsigned char*) iv, enclave_private_key, enclave_private_key_size, &decrypted_len);
    printf("decrypted (%dB):\n", decrypted_len);
    // BIO_dump_fp(stdout, (const char*) decrypted, decrypted_len);
    output_key->assign((char*)decrypted + decrypted_len-OUTPUT_KEY_LENGTH,  OUTPUT_KEY_LENGTH);
    std::string ret{(char*)decrypted, decrypted_len-OUTPUT_KEY_LENGTH};

    if (decrypted) free(decrypted);
    return ret;
}

void encrypt_output(const std::string& output_plain, const std::string& output_key, std::string* encrypt_output) {
  EVP_CIPHER_CTX *ctx;
  if(!(ctx = EVP_CIPHER_CTX_new())) return;

  if(EVP_EncryptInit_ex(ctx, EVP_aes_128_gcm(), NULL, (const unsigned char*)output_key.data(), enc_iv_buf) != 1) {
  // if(EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return;
  }

  unsigned char ciphertext[output_plain.size()];

  int ciphertext_len;
  int len;
  if(EVP_EncryptUpdate(ctx, ciphertext, &len, (const unsigned char*) output_plain.data(), output_plain.size())!=1) {
    EVP_CIPHER_CTX_free(ctx);
    return;
  }
  ciphertext_len = len;

  if(EVP_EncryptFinal_ex(ctx, ciphertext + len, &len)!=1) {
    EVP_CIPHER_CTX_free(ctx);
    return;
  }
  ciphertext_len += len;

  unsigned char tag[AES_GCM_TAG_SIZE] = {0,};
  // tag needed for gcm, not for cbc
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, 16, tag);
  EVP_CIPHER_CTX_free(ctx);
  encrypt_output->assign((char*)ciphertext, ciphertext_len);
  encrypt_output->append((char*)enc_iv_buf, AES_GCM_IV_SIZE);
  encrypt_output->append((char*)tag, AES_GCM_TAG_SIZE);
}

void run(const char* input_data, size_t input_data_size, size_t* output_size) {
  std::string output_key;
  auto decrypt_input = decrypt_content(input_data, input_data_size, &output_key);
  std::string output_plain = "hello" + decrypt_input;
  std::string output;
  encrypt_output(output_plain, output_key, &output);
  memcpy(output_buf, output.data(), output.size());
  actual_output_size = output.size();
  *output_size = actual_output_size;
}

void get_output(uint8_t* ret, size_t size) {
  memcpy(ret, output_buf, actual_output_size);
}

void execute(const std::string& request, std::string* output) {
  size_t output_size;
  run(request.data(), request.size(), &output_size);
  uint8_t* output_buf = (uint8_t*) malloc(output_size);
  get_output(output_buf, output_size);
  *output = std::string((char*) output_buf, output_size);
  free(output_buf);
}

void worker_handle(const std::string& request, std::string* output_encoded) {
  std::string output;
  execute(request, &output);
  const char* hex_result = hexstring(output.data(), output.size());
  output_encoded->assign(hex_result, strlen(hex_result));
}


int main(int argc, char* argv[]) {
  std::cout << "Program starts at: " 
    << std::chrono::system_clock::now().time_since_epoch() 
    / std::chrono::microseconds(1) << "\n";

  std::string sample_request_path;
  std::string sample_request;

  if (argc == 2) {
    sample_request = argv[1];
    printf("sample request: %s\n", sample_request.c_str());
  } else {
    fprintf(stderr, "Usage: sample_request\n");
    exit(1);
  }

// test enclave recreate
// for (int j = 0; j < 2; j++) {
  std::string key = get_key_and_report();

  // prepare the sample request as described below
  // expect the input should be in the form of |encrytped secret data|encrypted session key(256B)|IV(16)|
  // the secret data should consists of |input|output key(16B)|
  printf("check input: %s, %ld\n", sample_request.c_str(), sample_request.size());
  printf("check rsa pubkey size: %ld\n", sample_request.size());
  std::string prepared_sample = encrypt_request(sample_request, key); 

  // test subsequent
  std::string out;
  // worker.Handle(0, prepared_sample, &out);
  worker_handle(prepared_sample, &out);
  std::string outdata = hex_decode(out.data(), out.size());
  outdata = decrypt_response(outdata);
  printf("decoded: %s", outdata.c_str());
  printf("{\"msg\": \"id-%d, %s\"}\n", 0, outdata.c_str());

  if (enclave_public_key) {
    free(enclave_public_key);
    enclave_public_key = nullptr;
  } 
  if (enclave_private_key) {
    free(enclave_private_key);
    enclave_private_key = nullptr;
  } 
// }
  return 0;
}
