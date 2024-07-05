#include <curl/curl.h>
#include <openssl/evp.h>
#include <openssl/kdf.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>

#include <cstring>
#include <iostream>
#include <string>

#include "common/hexutil.h"
#include "common/json.h"

#define MAX_SESSION_KEY_IV_LENGTH 16

unsigned char default_output_key[16] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35,
                                        0x36, 0x37, 0x38, 0x39, 0x30, 0x31,
                                        0x32, 0x33, 0x34, 0x35};

#define EC_PUBLIC_KEY_SIZE 215

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

std::string get_public_key_as_string(EVP_PKEY* pkey) {
  BIO* bio = BIO_new(BIO_s_mem());
  PEM_write_bio_PUBKEY(bio, pkey);
  // Allocate memory
  uint8_t* local_public_key = (uint8_t*)malloc(EC_PUBLIC_KEY_SIZE + 1);
  if (!local_public_key) {
    BIO_free(bio);
    return "";
  }
  memset(local_public_key, 0x00, EC_PUBLIC_KEY_SIZE + 1);
  if (!BIO_read(bio, local_public_key, EC_PUBLIC_KEY_SIZE + 1)) {
    BIO_free(bio);
    return "";
  }

  BIO_free(bio);
  auto ret =
      std::string((char*)local_public_key, strlen((char*)local_public_key));
  free(local_public_key);
  return ret;
}

void load_public_key(const char* pub_key, size_t pub_key_size,
                     EVP_PKEY** pkey) {
  BIO* bio = BIO_new_mem_buf(pub_key, pub_key_size);
  EC_KEY* ecPublicKey = NULL;
  PEM_read_bio_EC_PUBKEY(bio, &ecPublicKey, NULL, NULL);
  EVP_PKEY_assign_EC_KEY(*pkey, ecPublicKey);
  printf("public key size: %d\n", EVP_PKEY_size(*pkey));
  BIO_free(bio);
}

void load_private_key(const char* pri_key, size_t pri_key_size,
                      EVP_PKEY** pkey) {
  BIO* bio = BIO_new_mem_buf(pri_key, pri_key_size);
  EC_KEY* ecPrivateKey = NULL;
  PEM_read_bio_ECPrivateKey(bio, &ecPrivateKey, NULL, NULL);
  EVP_PKEY_assign_EC_KEY(*pkey, ecPrivateKey);
  printf("private key size: %d\n", EVP_PKEY_size(*pkey));
  BIO_free(bio);
}

std::string derive_ecdh_secret(EVP_PKEY* own_key, EVP_PKEY* peer_key) {
  EVP_PKEY_CTX* ctx = EVP_PKEY_CTX_new(own_key, NULL);
  if (!ctx) {
    printf("EVP_PKEY_CTX_new failed\n");
    return "";
  }
  if (EVP_PKEY_derive_init(ctx) != 1) {
    printf("EVP_PKEY_derive_init failed\n");
    return "";
  }

  if (EVP_PKEY_derive_set_peer(ctx, peer_key) != 1) {
    printf("EVP_PKEY_derive_set_peer failed\n");
    return "";
  }

  size_t secret_len;
  if (1 != EVP_PKEY_derive(ctx, NULL, &secret_len)) {
    return "";
  }

  unsigned char* secret = (unsigned char*)malloc(secret_len);
  if (!secret) {
    printf("malloc secret failed\n");
    return "";
  }

  if (EVP_PKEY_derive(ctx, secret, &secret_len) != 1) {
    printf("EVP_PKEY_derive failed\n");
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

std::string encrypt_request(const std::string& data,
                            const std::string& enclave_public_key,
                            const std::string& output_key) {
  std::string plaintext{data};
  plaintext.append(output_key.c_str(), 16);
  int encrypted_message_len = 0;
  unsigned char* ek = NULL;
  int ek_len = 0;
  unsigned char iv[MAX_SESSION_KEY_IV_LENGTH];
  memset(iv, 0, MAX_SESSION_KEY_IV_LENGTH);
  size_t encrypted_message_max_length = plaintext.size() + EVP_MAX_IV_LENGTH;
  unsigned char encrypted[encrypted_message_max_length];
  memset(encrypted, 0, encrypted_message_max_length);
  EVP_PKEY* pkey = EVP_PKEY_new();
  load_public_key(enclave_public_key.data(), enclave_public_key.size(), &pkey);

  EVP_PKEY* tmp_ec_key_pair = EVP_PKEY_new();
  get_pkey_by_ec(tmp_ec_key_pair);

  // derive shared seccret
  auto secret = derive_ecdh_secret(tmp_ec_key_pair, pkey);
  auto session_key = kdf_derive((const unsigned char*)secret.c_str(),
                                secret.size(), "info", 4, 16);

  // encrypt data with the derived secret
  EVP_CIPHER_CTX* ctx2 = EVP_CIPHER_CTX_new();
  if (EVP_EncryptInit_ex(ctx2, EVP_aes_128_gcm(), NULL,
                         (const unsigned char*)session_key.c_str(), iv) != 1) {
    printf("EVP_EncryptInit_ex failed\n");
    EVP_CIPHER_CTX_free(ctx2);
    return "";
  }
  int ciphertext_len = 0;
  int len;
  if (EVP_EncryptUpdate(ctx2, encrypted, &len,
                        (const unsigned char*)plaintext.data(),
                        plaintext.size()) != 1) {
    printf("EVP_EncryptUpdate failed\n");
    EVP_CIPHER_CTX_free(ctx2);
    return "";
  }
  ciphertext_len = len;
  printf("encrypted data updated to (%dB)\n", ciphertext_len);

  if (EVP_EncryptFinal_ex(ctx2, encrypted + len, &len) != 1) {
    printf("EVP_EncryptFinal_ex failed\n");
    EVP_CIPHER_CTX_free(ctx2);
    return "";
  }
  ciphertext_len += len;
  printf("encrypted data updated to (%dB)\n", ciphertext_len);

  unsigned char tag[16] = {
      0,
  };
  EVP_CIPHER_CTX_ctrl(ctx2, EVP_CTRL_GCM_GET_TAG, 16, tag);
  printf("tag: \n");
  BIO_dump_fp(stdout, (const char*)tag, 16);

  EVP_CIPHER_CTX_free(ctx2);

  auto tmp_ec_key_pair_str = get_public_key_as_string(tmp_ec_key_pair);
  printf("tmp ec key pair (len: %ld) : %s\n", tmp_ec_key_pair_str.size(),
         tmp_ec_key_pair_str.c_str());

  EVP_PKEY_free(pkey);
  EVP_PKEY_free(tmp_ec_key_pair);

  return std::string((char*)encrypted, ciphertext_len) + tmp_ec_key_pair_str +
         std::string((char*)iv, 12) + std::string((char*)tag, 16);
}

std::string decrypt_response(const std::string& data,
                             const std::string& output_key) {
  uint8_t tag[16];
  memcpy(tag, data.data() + data.size() - 16, 16);
  uint8_t iv[12];
  memcpy(iv, data.data() + data.size() - 28, 12);
  size_t encrypt_len = data.size() - 28;
  EVP_CIPHER_CTX* ctx;
  /* Create and initialise the context */
  if (!(ctx = EVP_CIPHER_CTX_new())) return "";

  if (EVP_DecryptInit_ex(
          ctx, EVP_aes_128_gcm(), NULL,
          reinterpret_cast<const unsigned char*>(output_key.c_str()),
          iv) != 1) {
    EVP_CIPHER_CTX_free(ctx);
    return "";
  }

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

  EVP_CIPHER_CTX_free(ctx);
  return std::string((char*)plaintext, plaintext_len);
}

class HttpClient {
 public:
  HttpClient() {
    // Initialize curl
    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
  }

  ~HttpClient() {
    std::cout << "HttpClient destructor called\n";
    // Cleanup curl
    curl_easy_cleanup(curl);
    curl_global_cleanup();
  }

  std::string get(const std::string& url) {
    if (curl) {
      // Set the URL to send the GET request to
      curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

      // Store response in a string
      std::string response;
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
      curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

      // Perform the GET request
      CURLcode res = curl_easy_perform(curl);
      if (res != CURLE_OK) {
        std::cerr << "Failed to perform GET request: "
                  << curl_easy_strerror(res) << "\n";
      }

      return response;
    }

    return "";
  }

  std::string post(const std::string& url, const std::string& data) {
    if (curl) {
      // Set the URL to send the GET request to
      curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

      // set the post data
      curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());

      // Store response in a string
      std::string response;
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
      curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

      // Perform the GET request
      CURLcode res = curl_easy_perform(curl);
      if (res != CURLE_OK) {
        std::cerr << "Failed to perform GET request: "
                  << curl_easy_strerror(res) << "\n";
      }

      return response;
    }

    return "";
  }

 private:
  static size_t writeCallback(char* data, size_t size, size_t nmemb,
                              std::string* buffer) {
    // Append the data to the buffer
    buffer->append(data, size * nmemb);
    return size * nmemb;
  }

  CURL* curl;
};

class SGXTaskClient : public HttpClient {
 public:
  SGXTaskClient(const std::string& addr) : HttpClient(), addr_(addr) {}

  ~SGXTaskClient() = default;

  void ra() {
    // get report
    std::string url = addr_ + "/ra";
    std::string response = get(url);
    if (response.size() == 0) {
      std::cerr << "Failed to get report from server\n";
      return;
    }

    std::cout << "RA Response: " << response << "\n";

    // decode the response:
    auto data = json::JSON::Load(response);
    auto msg = json::JSON::Load(data["msg"].ToString());
    this->report_ = msg["report"].ToString();
    this->enclave_key_ = msg["key"].ToString();
  }

  std::string exec(const std::string& input, const std::string& output_key) {
    if (this->enclave_key_.size() == 0 || this->enclave_key_ == "null") {
      std::cerr << "Enclave key not initialized\n";
      return "";
    }

    // encrypt the input
    std::string encrypted_input =
        encrypt_request(input, enclave_key_, output_key);

    std::cout << "prepared sample size: " << encrypted_input.size() << "\n";

    // send the request
    std::string url = addr_ + "/run";
    json::JSON json_request;

    json_request["value"] =
        hex_encode(encrypted_input.data(), encrypted_input.size());

    // std::string response = post(url, "{\"value\": \"" + encrypted_input+
    // "\"}");
    auto request_data = json_request.dump();
    std::cout << "request data: " << request_data << "\n";
    std::string response = post(url, request_data);
    if (response.size() == 0) {
      std::cerr << "Failed to get response from server\n";
      return "";
    }

    std::cout << "exec Response: " << response << "\n";

    auto data = json::JSON::Load(response);
    auto msg = data["msg"].ToString();
    // decrypt the response
    std::string decrypted_response =
        decrypt_response(hex_decode(msg.c_str(), msg.size()), output_key);
    return decrypted_response;
  }

 private:
  std::string addr_;
  // initialized after ra
  std::string report_;
  std::string enclave_key_;
};

int main() {
  // {
  //   std::string url = "127.0.0.1:8080";
  //   HttpClient client;

  //   // get
  //   std::string response = client.get(url);
  //   std::cout << "Response: " << response << "\n";

  //   // put
  //   response = client.post(url, "{\"name\": \"sbip\"}");
  //   std::cout << "Response: " << response << "\n";
  // }

  {
    SGXTaskClient client{"127.0.0.1:2333"};
    // SGXTaskClient client{"172.18.0.255:8080"};
    client.ra();
    auto response =
        client.exec("sbip", std::string((char*)default_output_key, 16));
    std::cout << "Response: " << response << "\n";
  }

  return 0;
}
