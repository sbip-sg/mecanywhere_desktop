# SDK for developers using MECAnywhere

- "Developers" in this document refers to developers who want to offload their tasks to MECAnywhere.

The task execution flow is as such 
<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FpPA7irgoz9B39ux2AVI7Lr%2FMECAnywhere-Task-Execution%3Ftype%3Dwhiteboard%26node-id%3D0%253A1%26t%3DIMTH5p2ftl2CkgKo-1" allowfullscreen></iframe>

Therefore, developers only have 2 things to do:
1. Use the SDK in their application to connect to MECAnywhere desktop app.
2. Build a containerized task and upload it to IPFS via our CLI.

## Python SDK

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

### Test (with KNN example)

> You may skip step 1 if you uploaded your image to a public container repository or have it built in your local device.

1. Go to example_containers and build dockerized task with

```
docker build -t <tag> example_containers/knn
```

2. Start MECAnywhere desktop app.
3. Go to knn.py and change the container_ref to the tag you just built.
Start virtual env, install requirements and run knn.py. 

```
pip install torch==2.0.1+cpu --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
python knn.py
```

### Examples

This folder contains examples of how to use the SDK to offload tasks. The example_containers folder contains example tasks that can be called and run by the host.

- [basic_offload.py](basic_offload.py) uses the [sampleserver](../task_executor/sample/) container.

- [knn.py](knn.py) uses the [knn](example_containers/knn) container.

## JavaScript

Not in use
