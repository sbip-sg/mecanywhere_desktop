#include "worker.h"

#include "sgx_urts.h"

#include <cassert>
#include <cstring>

#include <string>

#include "Enclave_u.h"

#include "common/hexutil.h"

#include "sgx_dcap_ql_wrapper.h"

// for test
#include <chrono>
#include <mutex>
#include <iostream>

namespace {
std::mutex debug_log_mutex;
int PUBKEY_SIZE = 625;
} // anonymous namespace

std::string Worker::GetKeyAndReport(std::string* retKey) {
  quote3_error_t qe_error = SGX_QL_SUCCESS;
  sgx_target_info_t qe_target_info = {0,};
  sgx_report_t app_report = {0,};
  // prepare target info
  qe_error = sgx_qe_get_target_info(&qe_target_info);
  if (qe_error != SGX_QL_SUCCESS) {
    printf("sgx_qe_get_target_info failed with %d\n", qe_error);
    return "";
  }
  // create report and key
  sgx_status_t retval;
  uint8_t* pubkey = (uint8_t*) malloc(PUBKEY_SIZE);

  sgx_status_t status = enc_get_key_and_report(eid_, &retval, &qe_target_info, &app_report, pubkey, PUBKEY_SIZE);

  if ((status != SGX_SUCCESS) || (retval != SGX_SUCCESS)) {
    printf("ecall_get_key_and_report failed with %d - %d\n", status, retval);
    return "";
  }

  uint32_t quote_size = 0;
  qe_error = sgx_qe_get_quote_size(&quote_size);
  if (qe_error != SGX_QL_SUCCESS) {
    printf("sgx_qe_get_quote_size failed with %d\n", qe_error);
    return "";
  }

  uint8_t* quote_buf = (uint8_t*) malloc(quote_size);
  if (quote_buf == NULL) {
    printf("malloc failed for quote buffer %d\n", quote_size);
    return "";
  }
  memset(quote_buf, 0, quote_size);

  qe_error = sgx_qe_get_quote(&app_report, quote_size, quote_buf);
  if (qe_error != SGX_QL_SUCCESS) {
    printf("sgx_qe_get_quote failed with %d\n", qe_error);
    free(quote_buf);
    return "";
  }

  // prepare the return
  retKey->assign((char*)pubkey, PUBKEY_SIZE);
  if (pubkey) free(pubkey);
  return hex_encode(quote_buf, quote_size);
}

bool Worker::Initialize() {

  std::cout << "init started at: " 
    << std::chrono::system_clock::now().time_since_epoch() 
    / std::chrono::microseconds(1) << "\n";

  sgx_launch_token_t t;
  int updated = 0;
  memset(t, 0, sizeof(sgx_launch_token_t));
  auto sgxStatus = sgx_create_enclave(enclave_file_name_.c_str(),
    SGX_DEBUG_FLAG, &t, &updated, &eid_, NULL);
  if (sgxStatus != SGX_SUCCESS) {
    printf("Failed to create Enclave : error %d - %#x.\n", sgxStatus,
      sgxStatus);
    return false;
  } else printf("Enclave launched.\n"); 

  std::cout << "init finished at: " 
    << std::chrono::system_clock::now().time_since_epoch() 
    / std::chrono::microseconds(1) << "\n";

  initialize_ = true;
  return true;
}

int Worker::Execute(const std::string& request, std::string* output) {
  if (!initialize_) return -1;
  sgx_status_t retval;
  size_t output_size;

  std::cout << "exec started at: " 
    << std::chrono::system_clock::now().time_since_epoch() 
    / std::chrono::microseconds(1) << "\n";
  enc_run(eid_, &retval,
    request.data(), request.size(), &output_size);
  if (retval != SGX_SUCCESS) {
    printf("Failed to run task execution : error %d - %#x.\n",
      retval, retval);
    *output = "failed on task execution " + std::to_string(retval);
    return -1;
  } 


  uint8_t* output_buf = (uint8_t*) malloc(output_size);
  if (output_buf == NULL) {
    printf("malloc failed for output buffer %ld\n", output_size);
    return -1;
  } 

  enc_get_output(eid_, &retval, output_buf, output_size);
  if (retval != SGX_SUCCESS) {
    printf("Failed to get encrypted result : error %d - %#x.\n",
      retval, retval);
    *output = "failed on encrypted result " + std::to_string(retval);
    return -1;
  } 
  *output = std::string((char*) output_buf, output_size);
  free(output_buf);

  {
    std::lock_guard<std::mutex> lg(debug_log_mutex);
    std::cout << "result done at: " 
      << std::chrono::system_clock::now().time_since_epoch() 
      / std::chrono::microseconds(1) << "\n";
  }

  return 0;
}

void Worker::Close() {
  if (closed_) return;
  closed_ = true;
  initialize_ = false;
  sgx_status_t ret = enc_clear_exec_context(eid_);
  printf("returned status from close %d\n", ret);
  assert(ret == SGX_SUCCESS);
  ret = sgx_destroy_enclave(eid_);
  assert(ret == SGX_SUCCESS);
}

bool Worker::Handle(uint64_t handle_id, const std::string& request,
  std::string* output_encoded) {

  auto msg_prefix = "[id-" + std::to_string(handle_id) + "]";

#ifndef NDEBUG
  {
    std::lock_guard<std::mutex> lg(debug_log_mutex);
    std::cout << msg_prefix << " request handle start at: " 
      << std::chrono::system_clock::now().time_since_epoch() 
      / std::chrono::microseconds(1) << "\n";
  }
#endif // NDEBUG

  std::string output;
  auto ret = Execute(request, &output);

#ifndef NDEBUG
  {
    std::lock_guard<std::mutex> lg(debug_log_mutex);

    std::cout << msg_prefix << "done at: " 
    << std::chrono::system_clock::now().time_since_epoch() 
    / std::chrono::microseconds(1) << "\n";
  }
#endif // NDEBUG

  const char* hex_result = hexstring(output.data(), output.size());
  if (ret == 0) {
    output_encoded->append(hex_result, strlen(hex_result));
  } else *output_encoded = output;

  return ret;
}
