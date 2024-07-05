#define WORKER_ENCLAVE_FILENAME "Worker_Enclave.signed.so"
#define REQUEST_COUNT 4

#include <cstring>
#include <memory>

#include "common/hexutil.h"
#include "worker.h"

// for test
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>

#include <chrono>
#include <iostream>
#include <thread>
#include <vector>

#define MAX_SESSION_KEY_IV_LENGTH 16

/* A 128 bit key */
unsigned char output_key[16] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
                                0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35};

// /* A 96 bit IV */
// unsigned char iv[12] = {0x99, 0xaa, 0x3e, 0x68, 0xed, 0x81, 0x73, 0xa0,
//                         0xee, 0xd0, 0x66, 0x84};

// expect the input should be in the form of |encrytped secret data|encrypted
// session key(384B)|IV(16B)| the secret data should consists of |input|output
// key(16B)|
std::string encrypt_request(const std::string& data,
                            const std::string& enclave_public_key) {
  std::string plaintext{data};
  plaintext.append((char*)output_key, 16);
  int encrypted_message_len = 0;
  unsigned char* ek = NULL;
  int ek_len = 0;
  unsigned char iv[MAX_SESSION_KEY_IV_LENGTH];
  memset(iv, 0, MAX_SESSION_KEY_IV_LENGTH);
  size_t encrypted_message_max_length = plaintext.size() + EVP_MAX_IV_LENGTH;
  unsigned char encrypted[encrypted_message_max_length];
  memset(encrypted, 0, encrypted_message_max_length);

  BIO* bio = NULL;
  bio = BIO_new_mem_buf(enclave_public_key.data(), enclave_public_key.size());
  RSA* rsaPublicKey = NULL;
  PEM_read_bio_RSA_PUBKEY(bio, &rsaPublicKey, NULL, NULL);
  EVP_PKEY* pkey = EVP_PKEY_new();
  EVP_PKEY_assign_RSA(pkey, rsaPublicKey);
  EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
  EVP_CIPHER_CTX_init(ctx);
  ek = (unsigned char*)malloc(EVP_PKEY_size(pkey));
  EVP_SealInit(ctx, EVP_aes_256_cbc(), &ek, &ek_len, iv, &pkey, 1);
  printf("encrypted session key length: %d\n", ek_len);

  // BIO_dump_fp(stdout, (const char*) plaintext.data(), plaintext.size());
  // BIO_dump_fp(stdout, (const char*) ek, ek_len);

  int encrypted_block_len = 0;
  EVP_SealUpdate(ctx, encrypted, &encrypted_block_len,
                 (const unsigned char*)plaintext.data(), plaintext.size());
  encrypted_message_len = encrypted_block_len;
  EVP_SealFinal(ctx, encrypted + encrypted_block_len, &encrypted_block_len);
  encrypted_message_len += encrypted_block_len;
  EVP_CIPHER_CTX_free(ctx);
  BIO_free(bio);
  EVP_PKEY_free(pkey);

  std::string ret = std::string((char*)encrypted, encrypted_message_len);
  ret.append((char*)ek, ek_len);
  ret.append((char*)iv, MAX_SESSION_KEY_IV_LENGTH);

  if (ek) free(ek);

  return ret;
}

std::string decrypt_response(const std::string& data) {
  uint8_t tag[16];
  memcpy(tag, data.data() + data.size() - 16, 16);
  uint8_t iv[12];
  memcpy(iv, data.data() + data.size() - 28, 12);
  size_t encrypt_len = data.size() - 28;
  EVP_CIPHER_CTX* ctx;
  /* Create and initialise the context */
  if (!(ctx = EVP_CIPHER_CTX_new())) return "";

  if (EVP_DecryptInit_ex(ctx, EVP_aes_128_gcm(), NULL, output_key, iv) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return "";
  }

  // // BIO_dump_fp(stdout, (const char*) data.data(), data.size()-32);
  // printf("encrypted data (%dB): \n", encrypt_len);
  // BIO_dump_fp(stdout, (const char*) data.data(), encrypt_len);
  // printf("tag: \n");
  // BIO_dump_fp(stdout, (const char*) tag, 16);

  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, tag);

  uint8_t plaintext[encrypt_len];
  int plaintext_len;
  int len;
  if (EVP_DecryptUpdate(ctx, plaintext, &len, (const unsigned char*)data.data(),
                        encrypt_len) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return "";
  }
  plaintext_len = len;
  // printf("so far plaintext len: %d\n", plaintext_len);

  if (EVP_DecryptFinal_ex(ctx, plaintext + len, &len) != 1) {
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

int main(int argc, char* argv[]) {
  std::cout << "Program starts at: "
            << std::chrono::system_clock::now().time_since_epoch() /
                   std::chrono::microseconds(1)
            << "\n";

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
  for (int j = 0; j < 2; j++) {
    printf("Starting a worker\n");
    Worker worker(WORKER_ENCLAVE_FILENAME);
    auto ret = worker.Initialize();
    if (!ret) {
      printf("failed to initialize worker\n");
      return 1;
    }
    printf("Worker initialized\n");
    std::cout << "worker init done at: "
              << std::chrono::system_clock::now().time_since_epoch() /
                     std::chrono::microseconds(1)
              << "\n";

    std::string key;
    std::string report = worker.GetKeyAndReport(&key);
    std::cout << "report: " << report << "\n";
    std::cout << "key: " << key << "\n";

    printf("check input: %s, %ld\n", sample_request.c_str(),
           sample_request.size());
    // prepare the sample request
    std::string prepared_sample = encrypt_request(sample_request, key);

    // parallel
    std::vector<std::thread> handlers;
    std::array<std::string, REQUEST_COUNT> outputs;
    for (uint64_t i = 0; i < REQUEST_COUNT; i++) {
      handlers.emplace_back(&Worker::Handle, &worker, i, prepared_sample,
                            &outputs[i]);
    }
    for (auto& h : handlers) {
      h.join();
    }

    std::cout << "processing " << REQUEST_COUNT << " requests done at: "
              << std::chrono::system_clock::now().time_since_epoch() /
                     std::chrono::microseconds(1)
              << "\n";

    // print response
    int id = 0;
    for (auto& output : outputs) {
      std::string outdata = hex_decode(output.data(), output.size());
      outdata = decrypt_response(outdata);
      printf("{\"msg\": \"id-%d, %s\"}\n", id++, outdata.c_str());
    }

    // test subsequent
    {
      std::string out;
      worker.Handle(0, prepared_sample, &out);
      std::string outdata = hex_decode(out.data(), out.size());
      outdata = decrypt_response(outdata);
      printf("decoded: %s", outdata.c_str());
      printf("{\"msg\": \"id-%d, %s\"}\n", 0, outdata.c_str());
    }

    // test subsequent (check reuse)
    {
      std::string out;
      worker.Handle(0, prepared_sample, &out);
      std::string outdata = hex_decode(out.data(), out.size());
      outdata = decrypt_response(outdata);
      printf("decoded: %s", outdata.c_str());
      printf("{\"msg\": \"id-%d, %s\"}\n", 0, outdata.c_str());
    }

    // tear down
    printf("worker closing.\n");
    worker.Close();
  }
  return 0;
}
