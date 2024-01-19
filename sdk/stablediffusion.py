from py import meca_api
import asyncio
import base64
import sys
import os


def callback_on_receive(task_id, status, response, err, corr_id):
    if status == 1:
      try:
        os.mkdir('build')
      except OSError as error:
        print(error)
      try:
        with open("build/output.png", "wb") as f:
          f.write(base64.b64decode(response))
        print("Received result for task", task_id, "at build/output.png")
      except:
        print("Received result for task", task_id, ":", response)
    else:
      print(err, "for task: ", task_id, "corr_id:", corr_id)

async def main():
  args = ' '.join(sys.argv[1:])

  if args == '':
    print("Usage: python3 stablediffusion.py <args>")
    return

  try:
    await meca_api.initiate_connection()
  except Exception as e:
    await meca_api.disconnect()
    return

  await meca_api.offload_task(
    str(101),
    'sdtest:latest',
    args,
    callback=callback_on_receive,
    resource={'cpu': 8, 'memory': 8192},
  )

  await meca_api.join(500, 500)
  await meca_api.disconnect()

if __name__ == '__main__':
  try:
    asyncio.run(main())
  except KeyboardInterrupt:
    print("Program closed by user.")
    asyncio.run(meca_api.disconnect())
