import time
from py import meca_api
import json
from dotenv import load_dotenv
import os
import asyncio


task_corr_ids = dict()
results = dict()
NUMBER_OF_TASKS = 1

def callback_on_receive(id, status, response, err):
    if status == 0:
      raise Exception(err)
    task_corr_ids[response] = id
    print("Received in callback:", id, status, response, err)

async def main():
  load_dotenv()
  await meca_api.initiateConnection(os.getenv('DID'), os.getenv('VC'))

  for i in range(NUMBER_OF_TASKS):
    await meca_api.offload_task(
      str(i),
      'sampleserver:latest',
      "{\"name\": \"meca dev " + str(i) + "\"}",
      callback=callback_on_receive,
      resource={
        "cpu": 1,
        "memory": 256
      },
    )

  tried = 0
  while tried <= 1 and len(results) < NUMBER_OF_TASKS:
    for corr_id, task_id in task_corr_ids.items():
      time.sleep(2)
      api_response = await meca_api.poll_result(corr_id)
      status = api_response['status']
      response = api_response['response']
      error = api_response['error']
      if status == 1:
        results[task_id] = response
        print("Received result for task", task_id, ":", response)
      else:
        print(error, "for task: ", task_id, "corr_id:", corr_id)
        tried += 1
        break

  print("All results received:", results)
  print("Result count:", len(results))
  await meca_api.disconnect()

if __name__ == '__main__':
  try:
    asyncio.run(main())
  except KeyboardInterrupt:
    print("Program closed by user.")
    asyncio.run(meca_api.disconnect())
