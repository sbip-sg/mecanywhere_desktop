#ifndef MECA_SGX_WORKER_U_WORKER_H_
#define MECA_SGX_WORKER_U_WORKER_H_

#include <string>

#include "sgx_urts.h"

class Worker {
 public:
  Worker(const std::string& enclave_file_name)
      : initialize_(false),
        closed_(false),
        enclave_file_name_(std::move(enclave_file_name)),
        eid_(0) {}

  ~Worker() { Close(); }

  // delete copy and move constructors and assigment operators
  Worker(const Worker&) = delete;
  Worker& operator=(const Worker&) = delete;
  Worker(Worker&&) = delete;
  Worker& operator=(Worker&&) = delete;

  bool Initialize();

  std::string GetKeyAndReport(std::string* key);

  bool Handle(uint64_t handle_id, const std::string& sample_request,
              std::string* output);

  /**
   * @brief execute the inference request in the worker managed enclave.
   *
   * @param request : user request
   * @return int : 0 for success; -1 for failure
   */
  int Execute(const std::string& request, std::string* output);

  void Close();

 private:
  bool initialize_;
  bool closed_;
  const std::string enclave_file_name_;
  sgx_enclave_id_t eid_;
};

#endif  // MECA_SGX_WORKER_U_WORKER_H_
