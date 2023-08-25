import asyncio
import json
import socketio
from requests.models import PreparedRequest

MECA_URL = 'http://localhost:3001'

sio = socketio.AsyncClient(logger=False)

registered_event = asyncio.Event()
task_events = []

@sio.event
async def connect():
    print('Connected to the Socket.IO server')

@sio.event
async def connect_error():
    print('Failed to connect to server')

@sio.event
async def disconnect():
    print('Disconnected from the Socket.IO server')
    await sio.emit('disconnect')

@sio.on('registered')
async def on_registered():
    print('Registered with server.')
    registered_event.set()

async def initiateConnection(callbackOnReceive):
  @sio.on('job_results_received')
  async def on_job_results_received(id, result):
      print('Received in api:', result, 'for job:', id)
      callbackOnReceive(id, result)
      task_events.pop(0).set()

  try:
    await sio.connect(MECA_URL)
    await registered_event.wait()
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()

async def offload(containerRef, data, callback):
  offloaded_event = asyncio.Event()

  @sio.on('offloaded')
  async def on_offload(err, result):
    print('Offloaded')
    callback(err, result)
    offloaded_event.set()

  print('Offloading task...', containerRef, data)

  job = json.dumps({'containerRef': containerRef, 'jobInput': json.dumps(data)})
  try:
    await sio.emit('offload', job)
    await offloaded_event.wait()
    task_events.append(asyncio.Event())
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()

async def disconnect():
  await sio.disconnect()

async def join():
   for task_event in task_events:
     await task_event.wait()

# usage:
# async def main():

#     def callback_fn(id, result):
#         print('Callbacked:', result, 'for job:', id)

#     def offload_callback_fn(err, result):
#         if err:
#             print('Offload error:', err)
#         else:
#             print('Callbacked:', result)

#     try:
#       await initiateConnection('yo', callback_fn)
#       await offload('1+1', offload_callback_fn)
#       await sio.wait()
#     except KeyboardInterrupt:
#       await sio.disconnect()

# if __name__ == '__main__':
#   try:
#     asyncio.run(main())
#   except KeyboardInterrupt:
#     asyncio.run(sio.disconnect())
