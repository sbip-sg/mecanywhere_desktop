PROJECT_ROOT_DIR ?= $(shell readlink -f ..)

App_C_Cpp_Flags := -O0 -g -fPIC -Wno-attributes -I.
App_C_Cpp_Flags += -I$(PROJECT_ROOT_DIR)

.PHONY: all clean

all: client_ec_test

hexutil.o: $(PROJECT_ROOT_DIR)/common/hexutil.cc
	g++ $(App_C_Cpp_Flags) -c $< -o $@
	@echo "CXX  <=  $<"

json.o: $(PROJECT_ROOT_DIR)/common/json.cc
	g++ $(App_C_Cpp_Flags) -c $< -o $@
	@echo "CXX  <=  $<"

%.o: %.cc
	g++ $(App_C_Cpp_Flags) -c $< -o $@ 
	@echo "CXX  <=  $<"

App_Cpp_Objects := hexutil.o json.o

client_ec_test: main_ec.o $(App_Cpp_Objects)
	g++ $^ -o $@ -lcrypto -lssl -lcurl 
	@echo "Link  =>  $@"

clean:
	rm -f client_ec_test *.o
