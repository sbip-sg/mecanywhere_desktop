SGX_SDK ?= /opt/intel/sgxsdk
SGX_MODE ?= HW
SGX_ARCH ?= x64
SGX_DEBUG ?= 1

PROJECT_ROOT_DIR := $(shell readlink -f ..)

INSTALL ?= install
INSTALL_PREFIX ?= ./install
INSTALL_LIB_DIR = $(INSTALL_PREFIX)/lib
INSTALL_INCLUDE_DIR = $(INSTALL_PREFIX)/include

.PHONY: all install clean mrproper

all:
	$(MAKE) -ef sgx_u.mk all SGX_MODE=$(SGX_MODE) SGX_DEBUG=$(SGX_DEBUG)  
	$(MAKE) -ef sgx_t.mk all SGX_MODE=$(SGX_MODE) SGX_DEBUG=$(SGX_DEBUG) 

install:
	$(INSTALL) -d $(INSTALL_INCLUDE_DIR)
	$(INSTALL) -d $(INSTALL_LIB_DIR)
	$(INSTALL) -C -m 644 untrusted/worker.h $(INSTALL_INCLUDE_DIR)
	$(INSTALL) -C -m 664 *.signed.so $(INSTALL_LIB_DIR)
	$(INSTALL) -C -m 644 *.a $(INSTALL_LIB_DIR)

clean:
	$(MAKE) -ef sgx_u.mk clean
	$(MAKE) -ef sgx_t.mk clean

mrproper: clean
	rm -rf ./install
