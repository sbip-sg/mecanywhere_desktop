#ifndef MECA_SGX_CONCURRENTRT_U_OW_WORKERSERVICE_H_
#define MECA_SGX_CONCURRENTRT_U_OW_WORKERSERVICE_H_

#include <cstdlib>
#include <mutex>
#include <string>

#include "service.h"
#include "worker.h"

class WorkerService : public Service {
 public:
  // the logic of worker and where it fetch and store data are configured
  //  in the worker_config.h
  WorkerService(const std::string& enclave_path)
      : worker_(std::move(enclave_path)) {
    printf("Worker service config:\n enclave file name: %s\n",
           enclave_path.c_str());
  }
  ~WorkerService() = default;

  response_code_t Init(const std::string& request,
                       std::string* response) override;

  // ra will also attemp to init if it has not done so.
  response_code_t Ra(std::string* response) override;

  // run will also attemp to init if it has not done so.
  response_code_t Run(const std::string& request,
                      std::string* response) override;

 private:
  std::once_flag initalized_;
  Worker worker_;
};

#endif  // MECA_SGX_CONCURRENTRT_U_OW_WORKERSERVICE_H_
