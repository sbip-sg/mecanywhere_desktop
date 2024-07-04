#include "hexutil.h"
#include <cstdint>
#include <cstdlib>
#include <memory>

namespace {
const char _hextable[]= "0123456789abcdef";

struct hex_buffer_deleter {
  void operator()(void* p) const { free(p); }
};


thread_local std::unique_ptr<char, hex_buffer_deleter> _hex_buffer {nullptr};
thread_local size_t _hex_buffer_size= 0;
} // anonymous namespace

void print_hexstring(FILE *fp, const void *vsrc, size_t len) {
	const unsigned char *sp= (const unsigned char *) vsrc;
	size_t i;
	for(i= 0; i< len; ++i) {
		fprintf(fp, "%02x", sp[i]);
	}
	fprintf(fp, "\n");
}

const char *hexstring(const void *vsrc, size_t len) {
	size_t i, bsz;
	const char *src= (const char *) vsrc;
	char *bp;

	bsz= len*2+1;	/* Make room for NULL byte */
	if ( bsz >= _hex_buffer_size ) {
		/* Allocate in 1K increments. Make room for the NULL byte. */
		size_t newsz= 1024*(bsz/1024) + ((bsz%1024) ? 1024 : 0);
		_hex_buffer_size= newsz;
    auto _hex_buffer_ptr = (char*) realloc(_hex_buffer.get(), newsz);
		if ( _hex_buffer_ptr == NULL ) {
			return "(out of memory)";
		}
    _hex_buffer.release();
    _hex_buffer.reset(_hex_buffer_ptr);
	}

	for(i= 0, bp= _hex_buffer.get(); i< len; ++i) {
		*bp= _hextable[(uint8_t)src[i]>>4];
		++bp;
		*bp= _hextable[(uint8_t)src[i]&0xf];
		++bp;
	}
	_hex_buffer.get()[len*2]= 0;
	
	return (const char *) _hex_buffer.get();
}

// need testing
std::string hex_encode(const void* vsrc, size_t len) {
	const char* src = (const char*) vsrc;
	char ret[len * 2 + 1];
	char* bp = ret;
	for (size_t i = 0; i < len; ++i) {
		*bp = _hextable[(uint8_t) src[i] >> 4];
		++bp;
		*bp = _hextable[(uint8_t) src[i] & 0xf];
		++bp;
	}
	ret[len * 2] = 0;
	return std::string(ret, len * 2);
}

// need testing
std::string hex_decode(const char* vsrc, size_t len) {
	const char* src = (const char*) vsrc;
	char ret[len / 2];
	char* bp = ret;
	for (size_t i = 0; i < len; i += 2) {
		*bp = (uint8_t) ((src[i] >= 'a' ? src[i] - 'a' + 10 : src[i] - '0') << 4);
		*bp |= (uint8_t) (src[i + 1] >= 'a' ? src[i + 1] - 'a' + 10 : src[i + 1] - '0');
		++bp;
	}
	return std::string(ret, len / 2);
}