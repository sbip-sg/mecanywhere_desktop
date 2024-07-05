#ifndef MECA_SGX_COMMON_TCRYPTOEXT_H_
#define MECA_SGX_COMMON_TCRYPTOEXT_H_

// helper functions to use tcrypto.
#include <string>

#include "openssl/evp.h"
#include "sgx_tcrypto.h"

#define AES_GCM_IV_SIZE 12
#define AES_GCM_TAG_SIZE 16
#define AES_GCM_AAD_SIZE 4

#define MAX_SESSION_KEY_IV_LENGTH 16
#define ENCRYPTED_SESSION_KEY_LENGTH 384
#define OUTPUT_KEY_LENGTH 16

inline size_t get_aes_decrypted_size(size_t size) {
  return size - AES_GCM_IV_SIZE - AES_GCM_TAG_SIZE - AES_GCM_AAD_SIZE;
}

inline size_t get_aes_encrypted_size(size_t size) {
  return size + AES_GCM_IV_SIZE + AES_GCM_TAG_SIZE + AES_GCM_AAD_SIZE;
}

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
                                          uint8_t** output);

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
                                          uint8_t** output);

// from SampleCode/SampleAttestedTLS/common/utility.h

#define RSA_PUBLIC_KEY_SIZE 512
#define RSA_PRIVATE_KEY_SIZE 2048

#define RSA_3072_PUBLIC_KEY_SIZE 650
#define RSA_3072_PRIVATE_KEY_SIZE 3072

#define RSA_TYPE 0
#define EC_TYPE 1  // EC-P384

sgx_status_t generate_key_pair(int type, uint8_t** public_key,
                               size_t* public_key_size, uint8_t** private_key,
                               size_t* private_key_size);

// decrypt data with RSA private key
unsigned char* rsa_decrypt_data(const unsigned char* data, int len,
                                const unsigned char* ek, int ek_len,
                                const unsigned char* iv,
                                const uint8_t* rsa_private_key,
                                int rsa_private_key_len, int* output_len);

#define EC_PUBLIC_KEY_SIZE 215

void load_public_key(const char* pub_key, size_t pub_key_size, EVP_PKEY** pkey);

void load_private_key(const char* pri_key, size_t pri_key_size,
                      EVP_PKEY** pkey);

std::string derive_ecdh_secret(EVP_PKEY* own_key, EVP_PKEY* peer_key);

std::string kdf_derive(const unsigned char* secret, size_t secret_len,
                       const char* info, size_t info_len, size_t key_size);

#endif  // MECA_SGX_COMMON_TCRYPTOEXT_H_
