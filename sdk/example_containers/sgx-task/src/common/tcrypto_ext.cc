#include "tcrypto_ext.h"

#include <cstring>
#include <string>

// for key pair generation
#include "openssl/ec.h"
#include "openssl/evp.h"
#include "openssl/kdf.h"
#include "openssl/pem.h"
#include "openssl/rsa.h"

namespace {
// for now we use fixed IV and aad for prototype
// for production, different value should be used for encryption (need to
// support update and thread synchronization on them)
uint8_t enc_iv_buf[AES_GCM_IV_SIZE] = {0};
uint8_t enc_aad_buf[AES_GCM_AAD_SIZE] = {0};
}  // anonymous namespace

/**
 * @brief
 *
 * @param src
 * @param size
 * @param decryption_key
 * @param output caller is responsible to free the resources
 * @return sgx_status_t
 */
sgx_status_t decrypt_content_with_key_aes(const uint8_t* src, size_t size,
                                          const uint8_t* decryption_key,
                                          uint8_t** output) {
  size_t cipher_text_size = get_aes_decrypted_size(size);

  // temporary small variables
  uint8_t iv_buf[AES_GCM_IV_SIZE] = {0};
  uint8_t tag_buf[AES_GCM_TAG_SIZE] = {0};
  uint8_t aad_buf[AES_GCM_AAD_SIZE] = {0};

  // buffer for decrypted result. ownership transfer at the end to output.
  uint8_t* result = (uint8_t*)malloc(cipher_text_size + 1);
  sgx_status_t ret = (result == NULL) ? SGX_ERROR_OUT_OF_MEMORY : SGX_SUCCESS;

  if (ret == SGX_SUCCESS) {
    // copy contents
    const uint8_t* p = src;
    p += cipher_text_size;
    memcpy(iv_buf, p, AES_GCM_IV_SIZE);
    p += AES_GCM_IV_SIZE;
    memcpy(tag_buf, p, AES_GCM_TAG_SIZE);
    p += AES_GCM_TAG_SIZE;
    memcpy(aad_buf, p, AES_GCM_AAD_SIZE);

    // decrypt
    ret = sgx_rijndael128GCM_decrypt(
        (const sgx_aes_gcm_128bit_key_t*)decryption_key, src,
        (uint32_t)cipher_text_size, result, iv_buf, AES_GCM_IV_SIZE, aad_buf,
        AES_GCM_AAD_SIZE, (const sgx_aes_gcm_128bit_tag_t*)tag_buf);
    result[cipher_text_size] = '\0';
  }

  // assign the result to output if success; free the resource otherwise.
  if (ret != SGX_SUCCESS) {
    free(result);
    return ret;
  }
  *output = result;

  return ret;
}

/**
 * @brief
 *
 * @param src
 * @param size
 * @param encryption_key
 * @param output caller is responsible to free the resources.
 * @return sgx_status_t
 */
sgx_status_t encrypt_content_with_key_aes(const uint8_t* src, size_t size,
                                          const uint8_t* encryption_key,
                                          uint8_t** output) {
  size_t whole_cipher_text_size = get_aes_encrypted_size(size);

  // allocate temporary buffers for decryption operation. freed at the end.
  uint8_t* whole_cipher_text = (uint8_t*)malloc(whole_cipher_text_size);
  if (whole_cipher_text == NULL) return SGX_ERROR_OUT_OF_MEMORY;

  // temporary variables
  uint8_t tag_buf[AES_GCM_TAG_SIZE] = {0};

  // encrypt
  sgx_status_t ret = sgx_rijndael128GCM_encrypt(
      (const sgx_aes_gcm_128bit_key_t*)encryption_key, src, (uint32_t)size,
      whole_cipher_text, enc_iv_buf, AES_GCM_IV_SIZE, enc_aad_buf,
      AES_GCM_AAD_SIZE, (sgx_aes_gcm_128bit_tag_t*)tag_buf);

  // free the resource when failure.
  if (ret != SGX_SUCCESS) {
    free(whole_cipher_text);
    return ret;
  }

  // assemble the message
  uint8_t* pos = whole_cipher_text + size;
  memcpy(pos, enc_iv_buf, AES_GCM_IV_SIZE);
  pos += AES_GCM_IV_SIZE;
  memcpy(pos, tag_buf, AES_GCM_TAG_SIZE);
  pos += AES_GCM_TAG_SIZE;
  memcpy(pos, enc_aad_buf, AES_GCM_AAD_SIZE);

  // assign the result to output if success;
  *output = whole_cipher_text;

  return ret;
}

// from SampleCode/SampleAttestedTLS/common/utility.cc

int get_pkey_by_rsa(EVP_PKEY* pk) {
  int res = -1;
  EVP_PKEY_CTX* ctx = NULL;

  ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, NULL);
  if (ctx == NULL) return res;
  res = EVP_PKEY_keygen_init(ctx);
  if (res <= 0) {
    // PRINT("keygen_init failed (%d)\n", res);
    goto done;
  }

  res = EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, RSA_3072_PRIVATE_KEY_SIZE);
  if (res <= 0) {
    // PRINT("set_rsa_kengen_bits failed (%d)\n", res);
    goto done;
  }

  /* Generate key */
  res = EVP_PKEY_keygen(ctx, &pk);
  if (res <= 0) {
    // PRINT("keygen failed (%d)\n", res);
    goto done;
  }

done:
  if (ctx) EVP_PKEY_CTX_free(ctx);

  return res;
}

int get_pkey_by_ec(EVP_PKEY* pk) {
  int res = -1;
  EVP_PKEY_CTX* ctx;

  ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_EC, NULL);
  if (ctx == NULL) return res;
  res = EVP_PKEY_keygen_init(ctx);
  if (res <= 0) {
    // PRINT("EC_generate_key failed (%d)\n", res);
    goto done;
  }

  res = EVP_PKEY_CTX_set_ec_paramgen_curve_nid(ctx, NID_secp384r1);
  if (res <= 0) {
    // PRINT("EC_generate_key failed (%d)\n", res);
    goto done;
  }

  /* Generate key */
  res = EVP_PKEY_keygen(ctx, &pk);
  if (res <= 0) {
    // PRINT("EC_generate_key failed (%d)\n", res);
    goto done;
  }

done:
  if (ctx) EVP_PKEY_CTX_free(ctx);

  return res;
}

// actually is generating RSA pair
// hardare independant
sgx_status_t generate_key_pair(int type, uint8_t** public_key,
                               size_t* public_key_size, uint8_t** private_key,
                               size_t* private_key_size) {
  sgx_status_t result = SGX_ERROR_UNEXPECTED;
  uint8_t* local_public_key = nullptr;
  uint8_t* local_private_key = nullptr;
  int res = -1;
  EVP_PKEY* pkey = nullptr;
  BIO* bio = nullptr;

  pkey = EVP_PKEY_new();
  if (!pkey) {
    // PRINT("EVP_PKEY_new failed\n");
    result = SGX_ERROR_UNEXPECTED;
    goto done;
  }

  if (type != RSA_TYPE && type != EC_TYPE) {
    type = RSA_TYPE;  // by default, we use RSA_TYPE
  }

  switch (type) {
    case RSA_TYPE:
      res = get_pkey_by_rsa(pkey);
      break;
    case EC_TYPE:
      res = get_pkey_by_ec(pkey);
      break;
  }

  if (res <= 0) {
    // PRINT("get_pkey failed (%d)\n", res);
    result = SGX_ERROR_UNEXPECTED;
    goto done;
  }

  // Allocate memory
  local_public_key = (uint8_t*)malloc(RSA_3072_PUBLIC_KEY_SIZE);
  if (!local_public_key) {
    // PRINT("out-of-memory:calloc(local_public_key failed\n");
    result = SGX_ERROR_OUT_OF_EPC;
    goto done;
  }
  memset(local_public_key, 0x00, RSA_3072_PUBLIC_KEY_SIZE);

  local_private_key = (uint8_t*)malloc(RSA_3072_PRIVATE_KEY_SIZE);
  if (!local_private_key) {
    // PRINT("out-of-memory: calloc(local_private_key) failed\n");
    result = SGX_ERROR_OUT_OF_EPC;
    goto done;
  }
  memset(local_private_key, 0x00, RSA_3072_PRIVATE_KEY_SIZE);

  // Write out the public/private key in PEM format for exchange with
  // other enclaves.
  bio = BIO_new(BIO_s_mem());
  if (!bio) {
    // PRINT("BIO_new for local_public_key failed\n");
    goto done;
  }

  res = PEM_write_bio_PUBKEY(bio, pkey);
  if (!res) {
    // PRINT("PEM_write_bio_PUBKEY failed (%d)\n", res);
    goto done;
  }

  res = BIO_read(bio, local_public_key, RSA_3072_PUBLIC_KEY_SIZE);
  if (!res) {
    // PRINT("BIO_read public key failed (%d)\n", res);
    goto done;
  }
  BIO_free(bio);
  bio = nullptr;

  bio = BIO_new(BIO_s_mem());
  if (!bio) {
    // PRINT("BIO_new for local_public_key failed\n");
    goto done;
  }

  res = PEM_write_bio_PrivateKey(bio, pkey, nullptr, nullptr, 0, nullptr,
                                 nullptr);
  if (!res) {
    // PRINT("PEM_write_bio_PrivateKey failed (%d)\n", res);
    goto done;
  }

  res = BIO_read(bio, local_private_key, RSA_3072_PRIVATE_KEY_SIZE);
  if (!res) {
    // PRINT("BIO_read private key failed (%d)\n", res);
    goto done;
  }

  BIO_free(bio);
  bio = nullptr;

  *public_key = local_public_key;
  *private_key = local_private_key;

  *public_key_size = strlen(reinterpret_cast<const char*>(local_public_key));
  *private_key_size = strlen(reinterpret_cast<const char*>(local_private_key));

  // PRINT("public_key_size %d, private_key_size %d\n", *public_key_size,
  // *private_key_size);
  result = SGX_SUCCESS;

done:
  if (bio) BIO_free(bio);
  if (pkey) EVP_PKEY_free(pkey);  // When this is called, rsa is also freed
  if (result != SGX_SUCCESS) {
    if (local_public_key) free(local_public_key);
    if (local_private_key) free(local_private_key);
  }
  return result;
}

// added decryption with encrypted symmetric key and encrypted secret data
// the decrypted data will contains the output encryption key at its tail.
unsigned char* rsa_decrypt_data(const unsigned char* data, int len,
                                const unsigned char* ek, int ek_len,
                                const unsigned char* iv,
                                const uint8_t* rsa_private_key,
                                int rsa_private_key_len, int* output_len) {
  BIO* bio = nullptr;
  bio = BIO_new_mem_buf(rsa_private_key, rsa_private_key_len);
  RSA* loaded_private_key = NULL;
  PEM_read_bio_RSAPrivateKey(bio, &loaded_private_key, NULL, NULL);
  EVP_PKEY* pkey = EVP_PKEY_new();
  EVP_PKEY_assign_RSA(pkey, loaded_private_key);
  EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
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

void load_public_key(const char* pub_key, size_t pub_key_size,
                     EVP_PKEY** pkey) {
  BIO* bio = BIO_new_mem_buf(pub_key, pub_key_size);
  EC_KEY* ecPublicKey = NULL;
  PEM_read_bio_EC_PUBKEY(bio, &ecPublicKey, NULL, NULL);
  EVP_PKEY_assign_EC_KEY(*pkey, ecPublicKey);
  BIO_free(bio);
}

void load_private_key(const char* pri_key, size_t pri_key_size,
                      EVP_PKEY** pkey) {
  BIO* bio = BIO_new_mem_buf(pri_key, pri_key_size);
  EC_KEY* ecPrivateKey = NULL;
  PEM_read_bio_ECPrivateKey(bio, &ecPrivateKey, NULL, NULL);
  EVP_PKEY_assign_EC_KEY(*pkey, ecPrivateKey);
  BIO_free(bio);
}

std::string derive_ecdh_secret(EVP_PKEY* own_key, EVP_PKEY* peer_key) {
  EVP_PKEY_CTX* ctx = EVP_PKEY_CTX_new(own_key, NULL);
  if (!ctx) {
    return "";
  }
  if (EVP_PKEY_derive_init(ctx) != 1) {
    return "";
  }

  if (EVP_PKEY_derive_set_peer(ctx, peer_key) != 1) {
    return "";
  }

  size_t secret_len;
  if (1 != EVP_PKEY_derive(ctx, NULL, &secret_len)) {
    return "";
  }
  
  unsigned char* secret = (unsigned char*)malloc(secret_len);
  if (!secret) {
    return "";
  }

  if (EVP_PKEY_derive(ctx, secret, &secret_len) != 1) {
    return "";
  }
  auto ret = std::string((char*)secret, secret_len);
  EVP_PKEY_CTX_free(ctx);
  free(secret);
  return ret;
}

std::string kdf_derive(const unsigned char* secret, size_t secret_len,
                       const char* info, size_t info_len, size_t key_size) {
  char* key = (char*)malloc(key_size);
  if (!key) {
    return "";
  }
  memset(key, 0, key_size);
  EVP_PKEY_CTX* ctx;
  if (NULL == (ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_HKDF, NULL))) {
    return "";
  }
  if (1 != EVP_PKEY_derive_init(ctx)) {
    return "";
  }
  if (1 != EVP_PKEY_CTX_set_hkdf_md(ctx, EVP_sha256())) {
    return "";
  }
  if (1 != EVP_PKEY_CTX_set1_hkdf_key(ctx, secret, secret_len)) {
    return "";
  }
  if (1 != EVP_PKEY_CTX_set1_hkdf_salt(ctx, NULL, 0)) {
    return "";
  }
  if (1 != EVP_PKEY_CTX_add1_hkdf_info(ctx, info, info_len)) {
    return "";
  }
  if (1 != EVP_PKEY_derive(ctx, (unsigned char*)key, &key_size)) {
    return "";
  }
  EVP_PKEY_CTX_free(ctx);
  std::string ret{key, key_size};
  free(key);
  return ret;
}
