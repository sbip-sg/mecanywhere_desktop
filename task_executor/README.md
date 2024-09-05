# Task executor

The MECAnywhere agent module on a host to execute offloaded computations.

## Integration

It receives the task definition including the image id, resource limit and the input in a json. The resource limit is expressed in CPU core count and MB of RAM.

```json
{
  "id": "task-name",
  "resource": {"cpu":1, "mem":128}
  "input": "input accepted by the task codes"
}
```

## build

Build the docker image with: `docker build -t mecanywhere-executor -f docker/Dockerfile .`

## launch

create the virtual network on which mecanywhere will be launched and allocate a subnet for use

```sh
docker network create --subnet 172.18.0.0/16 mecanywhere
```

launch the executor

```sh
docker run --name mecanywhere_executor_test -v /var/run/docker.sock:/var/run/docker.sock --net=mecanywhere --ip=172.18.0.255 mecanywhere-executor:latest
```

## test

send a curl request to invoke the sample task

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "yourDockerAccount/sampleserver:latest", "input": "{\"name\": \"sbip\"}"}'
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "yourDockerAccount/sampleserver:latest", "resource": {"cpu":1, "mem":128}, "input": "{\"name\": \"sbip\"}"}' -v
```

for non-linux machines

change the subnet mask to any other available one

```sh
docker network create --subnet 173.18.0.0/16 mecanywhere
docker run --name mecaanywhere_executor_test -v /var/run/docker.sock:/var/run/docker.sock --net=mecanywhere --ip=173.18.0.255 -p 2591:2591 mecanywhere-executor:latest
curl http://localhost:2591 -X POST -H "Content-Type: application/json" -d '{"id": "yourDockerAccount/sampleserver:latest", "input": "{\"name\": \"sbip\"}"}'
```

for host with GPU, shall pass `--gpus=all` to the mecanywhere-executor. (or pass selected gpus for mecanywhere to use, for example, `--gpus='"device=1,2,3"'`)

```sh
docker run --name mecaanywhere_executor_test --gpus=all  -v /var/run/docker.sock:/var/run/docker.sock  -v <gpu-enabled-config-file>:/app/mecanywhere_executor.yaml  --net=mecanywhere --ip=172.18.0.255 -p 2591:2591 mecanywhere-executor:latest
```

Retrieve stats

```sh
curl http://172.18.0.255:2591/stats
```

Provide resource limit for the task

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "hugy718/goserver:v2", "resource": {"cpu":2, "mem":256}, "input": "{\"name\": \"sbip\"}"}'
```

Pick the microVM runtime if the host has it.

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "hugy718/sample:v1","runtime": "microVM", "resource": {"cpu":1, "mem":128}, "input": "{\"name\": \"sbip\"}"}'
```

Specify GPU

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "mecanywhere-python-task:1227", "resource": {"cpu":1, "mem":256, "use_gpu": true, "gpu_count": 3}, "input": "{\"name\": \"sbip\"}"}'
```

use sgx

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "sgx-task:latest", "resource": {"cpu":2, "mem":256}, "input": "{\"value\": \"sbip\"}", "use_sgx": true}'
```

Perform RA then send encrypted request

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "mock-sgx-task:latest", "resource": {"cpu":2, "mem":256}, "input": "SGXRAREQUEST", "use_sgx": true}'
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "mock-sgx-task:latest", "resource": {"cpu":2, "mem":256}, "input": "{\"value\": \"<the-encrypted-task-input>\"}", "use_sgx": true}'
```

Can use the mecanywhere sample repo sgx task direct client to interact with a running mock server task to get a valid encryted input sample for testing.
