# Example task containers

This folder contains example task containers showing how to build your own task container. Each folder contains a Dockerfile and an entrypoint file that handles the request, which is all that is needed for building the task container.

## Building a task container

You only need 2 files.

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

### 3. Using the container

Build the image and push it to a image repository that the host has access to (which may be public).

Call the meca api with the image name.
