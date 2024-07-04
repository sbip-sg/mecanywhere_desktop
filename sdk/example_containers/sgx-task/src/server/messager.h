#ifndef MECA_SGX_MESSENGER_H_
#define MECA_SGX_MESSENGER_H_

#include <string>

#include "common/json.h"

class Messenger {
 public:
  ~Messenger() = default;

  // extract users request json from the serverless platform request
  inline std::string ExtractUserJson(
      const std::string& platform_message) const {
    auto input = json::JSON::Load(platform_message);
    return input["value"].ToString();
  }

  // package worker result to serverless platform compatible response format
  // for error, it needs a json with a single field called "error"
  inline std::string PackageResponse(bool error,
                                     const std::string& response) const {
    json::JSON ret;
    if (error) {
      ret["error"] = std::move(response);
    } else {
      auto json_response = json::JSON::Load(response);
      if (!json_response.IsNull()) {
        ret["msg"] = json_response;
      } else {
        ret["msg"] = std::move(response);
      }
    }
    return ret.dump();
  }
};

#endif  // MECA_SGX_MESSENGER_H_
