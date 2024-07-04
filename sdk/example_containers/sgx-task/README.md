# sgx-task-worker

SGX task worker sample: It creates a server that conforms to the meca requirement and respond to users input `name` with `hello name`.

## setup

Environment setup

Follow the DCAP setup guides to register the worker machine to Intel Platform Certification Service and cache its attestation collateral at the meca designated Platform Certification Caching Service server.

The sgx-task server shall be able to prepare an attestation report during RA.

## build

To build the sample app, under `sgx-task/` run

```sh
docker build -t sgx-task .
```

To test the server

```sh
docker run -it -p 2333:8080  --device /dev/sgx_enclave:/dev/sgx/enclave -v /var/run/aesmd:/var/run/aesmd sgx-task
```

issue a request (now requires the client to perform encryption decryption)

<!-- ```sh
curl -X POST 172.18.0.255:8080/run -H 'Content-Type:application/json' -d @sample_input.json
``` -->

```sh
cd src/client_test
make clean && make all
./client_ec_test
```
