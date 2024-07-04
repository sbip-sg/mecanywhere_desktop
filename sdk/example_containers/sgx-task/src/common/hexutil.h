#ifndef MECA_SGX_COMMON_IOPATCHT_H_
#define MECA_SGX_COMMON_IOPATCHT_H_

#include <cstdio>
#include <string>

void print_hexstring(FILE *fp, const void *src, size_t len);

const char *hexstring(const void *src, size_t len);

std::string hex_encode(const void *vsrc, size_t len);
std::string hex_decode(const char *vsrc, size_t len);

#endif  // MECA_SGX_COMMON_IOPATCHT_H_
