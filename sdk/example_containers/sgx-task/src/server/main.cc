#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <thread>

#include "llhttp.h"
#include "messager.h"
#include "service.h"
#include "uv.h"
#include "worker_service.h"
typedef llhttp_t parser_t;
typedef llhttp_settings_t parser_settings_t;
#define PARSER_SETTINGS_INIT(m) llhttp_settings_init(m)

namespace {

constexpr char meca_ready[] = "meca-init-done";

Service* svc = nullptr;

Messenger msgr;

struct HttpRequest {
  uint64_t content_len;
  std::string url;
  std::string body;
};

uv_tcp_t server;
uv_loop_t* loop;

struct client_t {
  uv_tcp_t handle;
  parser_t parser;
  uv_write_t write_req;
  std::string response_scratch;  // buffer for the resbuf
  uv_buf_t resbuf{nullptr, 0};
  bool is_http_req = false;
  bool next_header_value_is_content_len = false;
  HttpRequest req;
  runtime_task_t task_type;
  uv_work_t work;  // at a time there is only one work scheduled.
};

parser_settings_t settings;

bool check_error(int ret) {
  if (!ret) return false;
  fprintf(stderr, "libuv error: %s\n", uv_strerror(ret));
  return true;
}

void on_close(uv_handle_t* handle) {
  printf("on close\n");
  client_t* client = (client_t*)handle->data;
  client->resbuf.base = nullptr;
  client->resbuf.len = 0;
  delete client;
  client = nullptr;
}

void after_write(uv_write_t* req, int status) {
  check_error(status);
  uv_close((uv_handle_t*)req->handle, on_close);
}

// concurrent runtime functions
std::string build_response(response_code_t code, const std::string& msg) {
  auto build = [](const std::string&& code_msg,
                  const std::string&& msg) -> std::string {
    return "HTTP/1.1 " + code_msg + "\r\n" +
           "Content-Type: application/json\r\n" +
           "Content-Length: " + std::to_string(msg.size()) + "\r\n" + "\r\n" +
           std::move(msg);
  };

  // auto json_msg = "{\"msg\": \"" + std::move(msg) + "\"}";
  switch (code) {
    case OK:
      return build("200 OK", msgr.PackageResponse(false, msg));
    case FORBIDDEN:
      return build("403 Forbidden", msgr.PackageResponse(true, msg));
    case NOT_FOUND:
      return build("404 Not Found", msgr.PackageResponse(true, msg));
    default:
      return build("500 Internal Server Error",
                   msgr.PackageResponse(true, msg));
  }
}

inline void flush_meca_ready() {
  printf("%s\n", meca_ready);
  fflush(stdout);
}

void on_work(uv_work_t* req) {
  client_t* client = (client_t*)req->data;
  response_code_t code;
  std::string msg;
#ifndef NDEBUG
  // printf("\nRequest body before processing:\n%s\n",
  // client->req.body.c_str());
#endif  // NDEBUG
  switch (client->task_type) {
    case RA:
      code = svc->Ra(&msg);
      break;
    case RUN:
      code = svc->Run(msgr.ExtractUserJson(client->req.body), &msg);
      break;
    case INIT:
      code = svc->Init(client->req.body, &msg);
      break;
    default:
      code = NOT_FOUND;
      msg = "unsupported path: " + client->req.url + "\n";
      break;
  }
  client->response_scratch = build_response(code, std::move(msg));
  client->resbuf =
      uv_buf_init(const_cast<char*>(client->response_scratch.c_str()),
                  client->response_scratch.size());
  // printf("response to sent %.*s\n", (int) client->response_scratch.size(),
  //   client->response_scratch.c_str());
}

void after_work(uv_work_t* req, int status) {
  if (check_error(status)) return;
  client_t* client = (client_t*)req->data;
  uv_write(&client->write_req, (uv_stream_t*)&client->handle, &client->resbuf,
           1, after_write);
}
// concurrent runtime functions

int on_message_begin(parser_t* _) {
  (void)_;
#ifndef NDEBUG
  printf("\n***MESSAGE BEGIN***\n\n");
#endif  // NDEBUG
  return 0;
}

int on_headers_complete(parser_t* _) {
  (void)_;
#ifndef NDEBUG
  printf("\n***HEADERS COMPLETE***\n\n");
#endif  // NDEBUG
  return 0;
}

int on_message_complete(parser_t* parser) {
#ifndef NDEBUG
  printf("\n***MESSAGE COMPLETE***\n\n");
#endif  // NDEBUG
  client_t* client = (client_t*)parser->data;
  if (client->req.url == "/run") {
    client->task_type = RUN;
  } else if (client->req.url == "/ra") {
    client->task_type = RA;
  } else if (client->req.url == "/init") {
    client->task_type = INIT;
  } else {
    client->task_type = UNDEFINED;
  }
  uv_queue_work(client->handle.loop, &client->work, on_work, after_work);
  return 0;
}

int on_url(parser_t* parser, const char* at, size_t length) {
#ifndef NDEBUG
  // printf("Url (%d): %.*s\n", (int)length, (int)length, at);
#endif  // NDEBUG
  client_t* client = (client_t*)parser->data;
  client->req.url = std::string(at, length);
  return 0;
}

int on_header_field(parser_t* parser, const char* at, size_t length) {
#ifndef NDEBUG
  // printf("Header field: %.*s\n", (int)length, at);
#endif  // NDEBUG
  if (strncmp(at, "Content-Type", std::max(length, strlen("Content-Type")))) {
    client_t* client = (client_t*)parser->data;
    client->next_header_value_is_content_len = true;
  }
  return 0;
}

int on_header_value(parser_t* parser, const char* at, size_t /*length*/) {
#ifndef NDEBUG
  // printf("Header value: %.*s\n", (int)length, at);
#endif  // NDEBUG
  client_t* client = (client_t*)parser->data;
  if (client->next_header_value_is_content_len) {
    client->req.content_len = strtoull(at, NULL, 10);
    client->req.body.reserve(client->req.content_len);
    client->next_header_value_is_content_len = false;
  }
  return 0;
}

int on_body(parser_t* parser, const char* at, size_t length) {
  // (void)_;
  client_t* client = (client_t*)parser->data;
  client->req.body.append(at, length);
#ifndef NDEBUG
  // printf("Body: %.*s\n", (int)length, at);
#endif  // NDEBUG
  return 0;
}

// all the callbacks implementation are from http-parser/contrib/parsertrace.c
//  to print something demonstrating the processing of each phase.
// on_message_complete is rewritten to send back response.
void setup_http_parser_settings() {
  PARSER_SETTINGS_INIT(&settings);
  settings.on_message_begin = on_message_begin;
  settings.on_url = on_url;
  settings.on_header_field = on_header_field;
  settings.on_header_value = on_header_value;
  settings.on_headers_complete = on_headers_complete;
  settings.on_body = on_body;
  settings.on_message_complete = on_message_complete;
}

void on_alloc(uv_handle_t* /*handle*/, size_t suggested_size, uv_buf_t* buf) {
#ifndef NDEBUG
  // printf("on alloc\n");
#endif  // NDEBUG
  *buf = uv_buf_init((char*)malloc(suggested_size), suggested_size);
}

void on_read(uv_stream_t* stream, ssize_t nread, const uv_buf_t* buf) {
#ifndef NDEBUG
  // printf("on read\n");
#endif  // NDEBUG
  /*do something*/
  if (nread >= 0) {
#ifndef NDEBUG
    // printf("Read:\n%.*s\n", (int) nread, buf->base);
#endif  // NDEBUG
    /*parse http*/
    client_t* client = (client_t*)uv_handle_get_data((uv_handle_t*)stream);
    parser_t* parser = &client->parser;

    if (!client->is_http_req) {
      auto ret = llhttp_execute(parser, buf->base, nread);
      if (ret != HPE_OK) {
        fprintf(stderr, "Parse error: %s %s\n", llhttp_errno_name(ret),
                parser->reason);
        printf("Not a http request, no response sent\n");
      }
    } else {
      // continuous reading the request. append to the body.
      client->req.body.append(buf->base, nread);
    }

  } else {
    // error
    if (nread != UV_EOF) {
      printf("Read error: %ld\n", nread);
    }
    uv_close((uv_handle_t*)stream, on_close);
    uv_stop(loop);
    printf("server schedules to shutdown\n");
  }

  free(buf->base);
}

void on_connection(uv_stream_t* server_handle, int status) {
  assert(server_handle == (uv_stream_t*)&server);
  printf("\non_connection\n");

  if (check_error(status)) return;

  // allocate http parser and a handle for each connection
  client_t* client = new client_t;

  // init
  llhttp_init(&client->parser, HTTP_BOTH, &settings);

  auto ret = uv_tcp_init(server_handle->loop, &client->handle);
  // let the data pointer of handle to point to the client struct,
  //  so we can access http parser.
  uv_handle_set_data((uv_handle_t*)&client->handle, client);
  // let the data pointer of parser to point to the client struct,
  //  so we can access handle.
  client->parser.data = client;
  uv_req_set_data((uv_req_t*)&client->work, client);

  check_error(ret);
  ret = uv_accept(server_handle, (uv_stream_t*)&client->handle);
  if (check_error(ret)) {
    uv_close((uv_handle_t*)&client->handle, on_close);
  } else {
    ret = uv_read_start((uv_stream_t*)&client->handle, on_alloc, on_read);
    check_error(ret);
  }
}
}  // anonymous namespace

int main(int argc, char* argv[]) {
  // pick service selection

  if (argc != 2) {
    fprintf(stderr, "Usage: worker_enclave\n");
    exit(1);
  }
  auto enclave_path = argv[1];
  WorkerService s{enclave_path};
  svc = &s;

  // setup http parser settings
  setup_http_parser_settings();

  // we only need a single loop, so use the default loop.
  // uv_loop_t* loop = (uv_loop_t*) malloc(sizeof(uv_loop_t));
  // uv_loop_init(loop);
  loop = uv_default_loop();

  // start a server
  uv_tcp_init(loop, &server);

  struct sockaddr_in address;
  uv_ip4_addr("0.0.0.0", 8080, &address);
  // uv_ip4_addr("0.0.0.0", 2531, &address);

  int ret = uv_tcp_bind(&server, (const struct sockaddr*)&address, 0);
  check_error(ret);

  printf("sample server launched\n");

  ret = uv_listen((uv_stream_t*)&server, 128, on_connection);
  check_error(ret);

  flush_meca_ready();

  uv_run(loop, UV_RUN_DEFAULT);
  uv_loop_close(loop);

  // using default loop.
  // free(loop);
  return 0;
}
