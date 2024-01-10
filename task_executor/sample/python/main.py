import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

class Handlers(BaseHTTPRequestHandler):
    def do_GET(self):
        # Handle your GET requests here
        # For example, you can serve HTML content dynamically
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type',"application/json")
            self.end_headers()
            response = {
                "msg": "hello world"
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.handle_404()

    def do_POST(self):
        # if self.path == '/run':
        if self.path == '/':
          self.send_response(200)
          self.send_header('Content-type',"application/json")
          self.end_headers()
          data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
          response = {
            "msg": data
          }
          print("resposne: ", response)
          self.wfile.write(json.dumps(response).encode())
        else:
            self.handle_404()
    def handle_404(self):
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"error": "404 not found"}')


# Set the server address and handler class
server_address = ('', 8080)  # Empty string means bind to all interfaces.
httpd = HTTPServer(server_address, Handlers)

# Start the server
print("Server running on port 8080...")
print("meca-init-done")
os.system("nvidia-smi") # test how many gpus are exposed
httpd.serve_forever()
