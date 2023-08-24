# Task Executor

## Resource control

Task executor is configured with the user-specified resource usage for MECA dispatched task. It contains a resource monitor that monitors the available resources on the host.

## Task

A task request sent over from MECA contains the id that defines the computation (In docker context, the image id), the resources it intends to use, the input of the request.

The task executor can manage multiple tasks with different resource usage intents at a given time. Therefore, internally the task executor manages the tasks with an id constructed from both the id and resource in a MECA request.

By default, if the request does not specify the resource usage intent, it is assumed to work with the default resource usage: 1 CPU core and 128MB RAM. The specified CPU should be a float with one decimal and the ram RAM is an integer.

## Cleaning

A task is maintained as a running server on the host machine. It is periodically cleaned by the task executor if they are inactive for a configured threshold of time (default 1min).

## Configuration

When launching the meca executor container, one can mount a config file to determine the resources limit managed by meca. A sample config file is [here](../task_executor/conf/meca_docker.yaml).

Mount the config file at `/app/meca_executor.yaml`

```sh
docker run -it --name meca_executor_test -v /var/run/docker.sock:/var/run/docker.sock -v <your-config-file>:/app/meca_executor.yaml --net=meca --ip=172.18.0.255 meca-executor:latest
```
