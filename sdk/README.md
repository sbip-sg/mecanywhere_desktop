# SDK for developers using MECAnywhere

## Python

- async def initiateConnection(containerRef, callbackOnReceive) -> None
  - containerRef: string - reference to container that will be offloaded
  - callbackOnReceive: function - callback function that will be called when results are back
- async def offload(data, callback) -> None
  - data: string - data to be offloaded
  - callback: function - callback function that will be called when the data is successfully offloaded
- async def disconnect() -> None
  - disconnect from the desktop app
- async def join() -> None
  - wait for all the results to be received

### Test

Start virtual env, install requirements and run test-offload.py.

```
pip install torch==2.0.1+cpu --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```
## JavaScript

Not updated
