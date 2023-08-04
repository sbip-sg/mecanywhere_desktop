# Task executor

The MECA agent module on a host to execute offloaded computations.

## Integration

It receives the task definition including the task id and the input in a json.

```json
{
  "id": "task-name",
  "input": "input accepted by the task codes"
}
```

## build

Build the docker image with: `docker build -t meca-executor -f docker/Dockerfile .`

## launch

create the virtual network on which meca will be launched and allocate a subnet for use

```sh
docker network create --subnet 172.18.0.0./16 meca
```

launch the executor

```sh
docker run --name meca_executor_test -v /var/run/docker.sock:/var/run/docker.sock --net=meca --ip=172.18.0.255 meca-executor:latest
```

## test

send a curl request to invoke the sample task

```sh
curl http://172.18.0.255:2591 -X POST -H "Content-Type: application/json" -d '{"id": "yourDockerAccount/sampleserver:latest", "input": "{\"name\": \"sbip\"}"}'
```
