from py import meca_api
from dotenv import load_dotenv
import asyncio


task_corr_ids = dict()
results = dict()
NUMBER_OF_TASKS = 2

def callback_on_receive(task_id, status, response, err, corr_id):
    if status == 1:
      results[task_id] = response
      print("Received result for task", task_id, ":", response)
    else:
      print(err, "for task: ", task_id, "corr_id:", corr_id)
    results[task_id] = response

async def main():
  load_dotenv()
  try:
    await meca_api.initiate_connection()
  except Exception as e:
    await meca_api.disconnect()
    return

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
      use_gpu=True,
      gpu_count=1
    )

  await meca_api.join()

  print("All results received:", results)
  print("Result count:", len(results))
  await meca_api.disconnect()

if __name__ == '__main__':
  try:
    asyncio.run(main())
  except KeyboardInterrupt:
    print("Program closed by user.")
    asyncio.run(meca_api.disconnect())
