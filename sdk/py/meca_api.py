import asyncio
import json
import socketio
from requests.models import PreparedRequest

sio = socketio.AsyncClient()

async def initiateConnection(containerRef, callbackOnReceive):
  registered_event = asyncio.Event()

  @sio.event
  async def connect():
      print('Connected to the Socket.IO server')

  @sio.event
  async def connect_error():
      print('Failed to connect to server')

  @sio.event
  async def disconnect():
      print('Disconnected from the Socket.IO server')

  @sio.on('job-results-received')
  async def on_job_results_received(id, result):
      print('Received result:', result, 'for job:', id)
      callbackOnReceive(id, result)

  @sio.on('registered')
  async def on_registered(registered):
      print('Registered with server: ', registered)
      if not registered:
         raise Exception('Failed to register with server')
      registered_event.set()

  server_url = 'http://localhost:3000'
  query_req = PreparedRequest()
  query_req.prepare_url(server_url, {'containerRef': containerRef})
  try:
    await sio.connect(query_req.url)
    await registered_event.wait()
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()

async def offload(data, callback):
  offloaded_event = asyncio.Event()

  @sio.on('offloaded')
  async def on_offload(err, result):
    print('Offloaded')
    callback(err, result)
    offloaded_event.set()

  print('Offloading task...')

  input_json = json.dumps(data)
  try:
    await sio.emit('offload', input_json)
    await offloaded_event.wait()
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()

async def disconnect():
  await sio.disconnect()

# usage:
async def main():

    def callback_fn(id, result):
        print('Callbacked:', result, 'for job:', id)

    def offload_callback_fn(err, result):
        if err:
            print('Offload error:', err)
        else:
            print('Callbacked:', result)

    try:
      await initiateConnection('yo', callback_fn)
      await offload('1+1', offload_callback_fn)
      await sio.wait()
    except KeyboardInterrupt:
      await sio.disconnect()

if __name__ == '__main__':
  try:
    asyncio.run(main())
  except KeyboardInterrupt:
    asyncio.run(sio.disconnect())
