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

## example input and output

These are the input packaged and response received with the `client_test`.

The example input:

```json
{
 "value" : "e2668b74921293303890963bc088b4478d827ea42d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d485977454159484b6f5a497a6a3043415159464b344545414349445967414535314376636e4a496f6f455866563834614941676a6d75596a3647334252464d0a5a577770434f65514c324349745a4751713075435a794e4e747972414563767970615a47674f4f7156772f534e533166737062474d5a4e6f2b656b37584536450a433644537a503043617332494e4769312f6757577351616773414835504566360a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0a000000000000000000000000bd7c85ff9a050361b53372a4bdb1bd7e"
}
```

The hex value are encrypted with the users key value of `sbip` with the output encryption key encrypted by the shared session key established after remote attestation.

The example output:

```json
{
 "msg" : "c4631eafeb6044a9fa0300000000000000000000000072988629eb5cad55f89ad8315553727e"
}
```

The hex value is `hello-sbip` encrypted with the output encryption key.
