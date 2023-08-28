# Task executor

The MECA agent module on a host to execute offloaded computations.

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

Build the docker image with: `docker build -t meca-executor -f docker/Dockerfile .`

## launch

create the virtual network on which meca will be launched and allocate a subnet for use

```sh
docker network create --subnet 172.18.0.0/16 meca
```

launch the executor

```sh
docker run --name meca_executor_test -v /var/run/docker.sock:/var/run/docker.sock --net=meca --ip=172.18.0.255 meca-executor:latest
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
docker network create --subnet 173.18.0.0/16 meca
docker run --name meca_executor_test -v /var/run/docker.sock:/var/run/docker.sock --net=meca --ip=173.18.0.255 -p 2591:2591 meca-executor:latest
curl http://localhost:2591 -X POST -H "Content-Type: application/json" -d '{"id": "yourDockerAccount/sampleserver:latest", "input": "{\"name\": \"sbip\"}"}'
```

Retrieve stats

```sh
curl http://172.18.0.255:259/stats -X POST
```

Provide resource limit for the task

```sh
curl http://172.18.0.255:259 -X POST -H "Content-Type: application/json" -d '{"id": "hugy718/goserver:v2", "resource": {"cpu":2, "mem":256}, "input": "{\"name\": \"sbip\"}"}'
```
