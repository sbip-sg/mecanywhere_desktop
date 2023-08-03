# sample docker for testing

A sample server container to test with task executor

To build the sample app, under `sample/` run `docker build -t sampleserver .`

To develop other apps that can be managed by the task executor, their docker server should listen to 8080 and implement the POST handler for root `/`. And after server initialization, it should emit the string, `meca-init-done`,to stdout, such that task executor will inspect the docker log to use this record determining the server is ready for serving requests.
