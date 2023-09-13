import json

import requests

global_did = None
access_token = None
auth_header = None

async def initiateConnection(did, vc):
  global global_did, access_token, auth_header
  global_did = did
  access_token, access_token_type, refresh_token, refresh_token_type = requests.post(
    'http://localhost:7000/registration/register_client',
    json = { 'did': did, 'vc': vc }
  )
  auth_header = {
    'Authorization': f'{access_token_type} {access_token}'
  }

async def offload(containerRef, data, callback):
  print('Offloading task...', containerRef, data)
  requests.post(
    'http://localhost:7000/offload_to_host',
    json = { 'did': global_did, 'container_reference': containerRef, 'content': data },
    headers = auth_header
  )

async def disconnect():
  print('Disconnecting...')
  requests.post(
    'http://localhost:7000/registration/deregister_client',
    json = { 'did': global_did },
    headers = auth_header
  )
