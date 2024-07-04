#ifndef MECA_SGX_CONCURRENTRT_U_OW_SERVICE_H_
#define MECA_SGX_CONCURRENTRT_U_OW_SERVICE_H_

#include <string>

typedef enum {
  OK,           // 200
  FORBIDDEN,    // 403
  NOT_FOUND,    // 404
  SERVER_ERROR  // 500
} response_code_t;

typedef enum { INIT, RUN, RA, UNDEFINED } runtime_task_t;

// backend service interface for concurrent runtime.
class Service {
 public:
  virtual ~Service() = default;

  // init is guaranteed to execute once
  virtual response_code_t Init(const std::string& request,
                               std::string* response) = 0;

  virtual response_code_t Ra(std::string* response) = 0;

  // run is a asynchronous scheduled task. needs to be thread-safe
  virtual response_code_t Run(const std::string& request,
                              std::string* response) = 0;
};

#endif  // MECA_SGX_CONCURRENTRT_U_OW_SERVICE_H_
