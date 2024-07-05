# Example task containers

This folder contains example task containers showing how to build your own task container. Each folder must contain all of the files listed in the structure below.

## Structure

The structure of the task container is as follows:

```
- template
  - Dockerfile
  - src
  - description.txt
  - name.txt
  - example_input.bin
  - example_output.bin
  - config.json

```

## Building a task container

### 1. App that handles requests

The app will receive a post request at `localhost:8080\` and return the result. The input format is any json object and the output format is a string. After the app starts up, print `"meca-init-done"`.

For example, we create a flask app:
  
```python
  from flask import Flask, request
  import json

  app = Flask(__name__)

  @app.route('/', methods=['POST'])
  def hello_world():
      data = request.json
      return data['input']

  print("meca-init-done")
```

### 2. Dockerfile

Expose port 8080 to the app of the request handler.

Following the flask app created above, the Dockerfile may look like this:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY flask_app.py flask_app.py

EXPOSE 8080

CMD ["python", "-m", "flask", "--app", "flask_app.py", "run", "--host=0.0.0.0", "--port=8080"]
```

### 3. config.json fields

The `config.json` file contains the configuration of the task with the following default fields:

DEFAULTS:

```json
{
  "resource": {
    "cpu": 1,
    "mem": 128,
    "use_gpu": false, 
    "gpu_count": 0
  }
}
```

field | description
--- | ---
`resource.cpu` | The number of CPUs to allocate to the task. This field will limit the users that can run the task to those with the same or more CPUs available.
`resource.mem` | The amount of memory to allocate to the task in MB. This field will limit the users that can run the task to those with the same or more memory available.
`resource.use_gpu` | Whether the task requires a GPU to run.
`resource.gpu_count` | The number of GPUs to allocate to the task, if `use_gpu` is true.

### 4. Using and uploading the container

Build the image and push it to IPFS via the MECA CLI as a task developer. You will be compensated with the task fee that you list for each task executed by a MECA client.

Test your task folder structure by running the test function in the MECA CLI.
