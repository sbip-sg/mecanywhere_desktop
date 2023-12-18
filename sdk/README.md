# SDK for developers using MECAnywhere

## Python

This SDK only provides offloading asynchronously and receiving results via callback. To do synchronous offloading, you may use the `join` function immediately after an offload.

#### async def initiate_connection([timeout]) -> None
    Starts a socket connection to the local MECA desktop app.

    - timeout: int (optional)

#### async def offload_task(task_id, container_ref, data, callback, resource, runtime) -> str
    Sends a task input to the local MECA desktop app that helps to run the task on a remote MECA host.
    The task is the containerized application you have uploaded to the container repository that returns some result given the input data.

      - task_id: str - identifier for the task to correlate with the callback results
      - container_ref: str - image name of the task for the data to be processed
      - data: str
      - callback: Callable[[str], None] - function to be called when the results are received
      - resource: dict (optional) - resource requirements for the task
      - runtime: str (optional) - runtime environment for the task

#### async def disconnect() -> None
    Closes the socket connection to the local MECA desktop app.
#### async def join(task_timeout, join_timeout) -> None
    Waits for all tasks to finish.

      - task_timeout: int - timeout for each task
      - join_timeout: int - timeout for all tasks

### Test

Start desktop app, docker daemon, executor and build dockerized task with
```
docker build -t test-offload -f containerized_example/Dockerfile.example containerized_example
```
Start virtual env, install requirements and run test-offload.py.

```
pip install torch==2.0.1+cpu --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

### Examples

[test_basic_offload.py](test_basic_offload.py)

[test-offload.py](test-offload.py)

## JavaScript

Not updated
