PROJECT_ROOT_DIR ?= $(shell readlink -f ..)
WORKER_INSTALL_PATH ?= $(PROJECT_ROOT_DIR)/worker/install
INSTALL_PREFIX ?= $(shell readlink -f install)

DEPS_INSTALL_DIR = $(PROJECT_ROOT_DIR)/deps/install
LIBUV_DIR = $(DEPS_INSTALL_DIR)/libuv
LLHTTP_DIR = $(DEPS_INSTALL_DIR)/llhttp

CONCURRENT_RT_LINK_FLAGS := -L$(LIBUV_DIR)/lib -l:libuv_a.a -lpthread -ldl
CONCURRENT_RT_CXX_FLAGS := -I$(LIBUV_DIR)/include
CONCURRENT_RT_CXX_FLAGS += -DUSE_LLHTTP -I$(LLHTTP_DIR)/include
CONCURRENT_RT_LINK_FLAGS += -L$(LLHTTP_DIR)/lib -l:libllhttp.a

deps:
	@echo "run make deps under repo root to build deps"

# build with the Makefile under concurrent_runtime

SGX_SDK ?= /opt/intel/sgxsdk
SGXSSL_DIR ?= /opt/intel/sgxssl
SGX_MODE ?= HW
SGX_ARCH ?= x64
SGX_DEBUG ?= 1

WORKER_INSTALL_PATH ?= $(PROJECT_ROOT_DIR)/worker/install

### Intel(R) SGX SDK Settings ###
ifeq ($(shell getconf LONG_BIT), 32)
	SGX_ARCH := x86
else ifeq ($(findstring -m32, $(CXXFLAGS)), -m32)
	SGX_ARCH := x86
endif

ifeq ($(SGX_ARCH), x86)
	SGX_COMMON_CFLAGS := -m32
	SGX_LIBRARY_PATH := $(SGX_SDK)/lib
	SGX_ENCLAVE_SIGNER := $(SGX_SDK)/bin/x86/sgx_sign
	SGX_EDGER8R := $(SGX_SDK)/bin/x86/sgx_edger8r
else
	SGX_COMMON_CFLAGS := -m64
	SGX_LIBRARY_PATH := $(SGX_SDK)/lib64
	SGX_ENCLAVE_SIGNER := $(SGX_SDK)/bin/x64/sgx_sign
	SGX_EDGER8R := $(SGX_SDK)/bin/x64/sgx_edger8r
endif

ifeq ($(SGX_DEBUG), 1)
ifeq ($(SGX_PRERELEASE), 1)
$(error Cannot set SGX_DEBUG and SGX_PRERELEASE at the same time!!)
endif
endif

ifeq ($(SGX_DEBUG), 1)
        SGX_COMMON_CFLAGS += -O0 -g -DSGX_DEBUG
else
        SGX_COMMON_CFLAGS += -O2
endif

ifneq ($(SGX_MODE), HW)
	Urts_Library_Name := sgx_urts_sim
else
	Urts_Library_Name := sgx_urts
endif

APP_DCAP_LIBS := -lsgx_dcap_ql -lsgx_dcap_quoteverify
### Intel(R) SGX SDK Settings ###

COMMON_CXX_FLAGS := $(CONCURRENT_RT_CXX_FLAGS) -I$(PROJECT_ROOT_DIR)

.PHONY: all clean install

all: sample-server

Sources := main.cc
Sources += worker_service.cc
# setup compile flags
COMMON_CXX_FLAGS += -DUSE_WORKER_SERVICE 
COMMON_CXX_FLAGS += $(SGX_COMMON_CFLAGS) -fPIC -Wno-attributes
# Three configuration modes - Debug, prerelease, release
#   Debug - Macro DEBUG enabled.
#   Prerelease - Macro NDEBUG and EDEBUG enabled.
#   Release - Macro NDEBUG enabled.
ifeq ($(SGX_DEBUG), 1)
				COMMON_CXX_FLAGS += -DDEBUG -UNDEBUG -UEDEBUG
else ifeq ($(SGX_PRERELEASE), 1)
				COMMON_CXX_FLAGS += -DNDEBUG -DEDEBUG -UDEBUG
else
				COMMON_CXX_FLAGS += -DNDEBUG -UEDEBUG -UDEBUG
endif # SGX_DEBUG
	COMMON_CXX_FLAGS += -I$(SGX_SDK)/include -I$(WORKER_INSTALL_PATH)/include
# setup linker flags
	COMMON_LINK_FLAGS += -L$(WORKER_INSTALL_PATH)/lib -l:libworker.a

	COMMON_LINK_FLAGS += $(CONCURRENT_RT_LINK_FLAGS)

COMMON_LINK_FLAGS += -L$(SGX_LIBRARY_PATH)	-l$(Urts_Library_Name) $(APP_DCAP_LIBS) \
-lpthread -lz -lm -lcrypto
ifneq ($(SGX_MODE), HW)
	COMMON_LINK_FLAGS += -lsgx_uae_service_sim
else
	COMMON_LINK_FLAGS += -lsgx_uae_service
endif

COMMON_LINK_FLAGS += -L$(SGXSSL_DIR)/lib64 -lsgx_usgxssl

Common_CXX_Flags += -Wall -Wextra -Winit-self -Wpointer-arith -Wreturn-type \
                    -Waddress -Wsequence-point -Wformat-security \
                    -Wmissing-include-dirs -Wfloat-equal -Wundef -Wshadow \
                    -Wcast-align -Wcast-qual -Wconversion -Wredundant-decls

Source_objects = $(Sources:.cc=.o)

%.o: %.cc
	$(CXX) $(COMMON_CXX_FLAGS) -c $< -o $@

ifneq ($(USE_WORKER_SERVICE), 1)
json.o: $(PROJECT_ROOT_DIR)/common/json.cc
	$(CXX) $(COMMON_CXX_FLAGS) -c $< -o $@

Source_objects += json.o

endif # build default server

sample-server: $(Source_objects)
	$(CXX) $^ -o $@ $(COMMON_LINK_FLAGS)

install:
	install -d $(INSTALL_PREFIX)/bin
	install -C -m 755 sample-server $(INSTALL_PREFIX)/bin/server
	install -d $(INSTALL_PREFIX)/lib
	install -C -m 664 $(WORKER_INSTALL_PATH)/lib/Worker_Enclave.signed.so $(INSTALL_PREFIX)/lib

clean:
	rm -f *.o
	rm -f sample-server

mrproper: clean
	rm -rf install
