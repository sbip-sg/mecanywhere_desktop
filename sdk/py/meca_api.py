import json
import asyncio
import socketio
from typing import Callable

sio = socketio.AsyncClient()

registered_event = asyncio.Event()
task_events = []

@sio.event
async def connect():
    print('Connected to the Socket.IO server')

@sio.event
async def connect_error(info):
    print('Failed to connect to server:', info)

@sio.event
async def disconnect():
    print('Disconnected from the Socket.IO server')
    await sio.emit('disconnect')

@sio.on('registered')
async def on_registered(registered):
    print('Registered with server: ', registered)
    if not registered:
        print('Failed to register with server')
        return
    registered_event.set()

async def initiate_connection(timeout=10):
  server_url = 'http://localhost:3001'
  try:
    await sio.connect(server_url)
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()
    raise e
  try:
    await asyncio.wait_for(registered_event.wait(), timeout=timeout)
  except asyncio.TimeoutError:
    print('Connection timed out')
    await sio.disconnect()
    raise Exception('Connection timed out')

async def offload_task(
    task_id: str,
    container_ref: str,
    data: str,
    callback: Callable[[str], None],
    resource: dict = None,
    runtime: str = None
  ) -> str:
  print('Offloading task...', container_ref, data)
  payload = {
    'task_id': task_id,
    'container_reference': container_ref,
    'content': data
  }
  if resource:
    payload['resource'] = resource
  if runtime:
    payload['runtime'] = runtime

  ###
  @sio.on('job_results_received')
  async def on_job_results_received(status, response, error, task_id, transaction_id):
      print('Received result:', response, 'for job:', task_id)
      if status == 0:
        print('Error:', error)
      callback(task_id, status, response, error, transaction_id)
      task_events.pop(0).set()
  ###

  offloaded_event = asyncio.Event()
  @sio.on('offloaded')
  async def on_offload(err, result):
    if err:
      print('Offload failed', err)
    else:
      print('Offloaded', result)
    offloaded_event.set()

  input_json = json.dumps(payload)
  try:
    await sio.emit('offload', input_json)
    await offloaded_event.wait()
    task_events.append(asyncio.Event())
  except Exception as e:
    print("Exception: ", e)
    await sio.disconnect()

async def disconnect():
  if sio.connected:
    await sio.disconnect()

async def _wait_for_all_tasks(task_timeout=5):
  task_events_copy = task_events.copy()
  for task_event in task_events_copy:
    try:
      await asyncio.wait_for(task_event.wait(), timeout=task_timeout)
    except asyncio.TimeoutError:
      print('A task timed out')

async def join(task_timeout=5, join_timeout=10):
  try:
    await asyncio.wait_for(_wait_for_all_tasks(task_timeout), timeout=join_timeout)
  except asyncio.TimeoutError:
    print('Join timed out')
