import json
from typing import Callable

import requests

global_did = None
access_token = None
auth_header = None

DISCOVERY_URL = 'http://localhost:7000'
# DISCOVERY_URL = 'http://sbip-g2.d2.comp.nus.edu.sg:11000/fn-discovery'

# TODO: change to signed vc
async def initiateConnection(did: str, vc: str) -> None:
  print("did", did)
  print("vc", vc)
  global global_did, access_token, auth_header
  global_did = did
  vc_obj = json.loads(vc)
  try:
    r = requests.post(
      f'{DISCOVERY_URL}/registration/register_client',
      json = { 'did': did, 'credential': vc_obj }
    )
    r.raise_for_status()
  except Exception as e:
    raise SystemExit(e)
  access_token, access_token_type, refresh_token, refresh_token_type = r.json().values()
  print("access_token", access_token)
  auth_header = {
    'Authorization': f'{access_token_type} {access_token}'
  }

async def offload_task_and_get_result(
    task_id: str,
    containerRef: str,
    data: str,
    callback: Callable[[str], None],
    resource: dict = None,
    runtime: str = None
  ) -> str:
  print('Offloading task...', containerRef, data)
  payload = {
    'did': global_did,
    'task_id': task_id,
    'container_reference': containerRef,
    'content': data
  }
  if resource:
    payload['resource'] = resource
  if runtime:
    payload['runtime'] = runtime
  try:
    r = requests.post(
      f'{DISCOVERY_URL}/offloading/offload_task_and_get_result',
      json = payload,
      headers = auth_header
    )
    r.raise_for_status()
  except Exception as e:
    raise SystemExit(e)
  status, response, error, task_id = r.json().values()
  print("Received in test:", task_id, status, response, error)
  callback(task_id, status, response, error)

async def offload_task(
    task_id: str,
    containerRef: str,
    data: str,
    callback: Callable[[str], None],
    resource: dict = None,
    runtime: str = None
  ) -> str:
  print('Offloading task...', containerRef, data)
  payload = {
    'did': global_did,
    'task_id': task_id,
    'container_reference': containerRef,
    'content': data
  }
  if resource:
    payload['resource'] = resource
  if runtime:
    payload['runtime'] = runtime
  try:
    r = requests.post(
      f'{DISCOVERY_URL}/offloading/offload_task',
      json = payload,
      headers = auth_header
    )
    r.raise_for_status()
  except Exception as e:
    raise SystemExit(e)
  jsonR = r.json()
  status = jsonR['status']
  response = jsonR['response']
  error = jsonR['error']
  task_id = jsonR['task_id']
  print("Offload response:", task_id, status, response, error)
  callback(task_id, status, response, error)

async def poll_result(corr_id: str):
  print('Polling result...', corr_id)
  try:
    r = requests.post(
      f'{DISCOVERY_URL}/offloading/poll_result',
      json = { 'did': global_did, 'correlation_id': corr_id },
      headers = auth_header
    )
    r.raise_for_status()
  except Exception as e:
    raise SystemExit(e)
  return r.json()

async def disconnect():
  print('Disconnecting...')
  return requests.post(
    f'{DISCOVERY_URL}/registration/deregister_client',
    json = { 'did': global_did },
    headers = auth_header
  )
