import tkinter as tk
from PIL import Image, ImageTk
from async_tkinter_loop import async_handler, async_mainloop
from py import meca_api
import base64
import sys
import os

connected = False

async def connect():
    global connected
    try:
        label.config(text="Connecting ...")
        await meca_api.initiate_connection()
        connected = True
    except Exception as e:
        await meca_api.disconnect()
        sys.exit(1)

def callback_on_receive(task_id, status, response, err, corr_id):
    if status == 1:
      try:
        os.mkdir('build')
      except OSError as error:
        print(error)
      try:
        with open("build/output.png", "wb") as f:
          f.write(base64.b64decode(response))
        label.config(text="Received result for task " + task_id + " at output.png")

        pil_image = Image.open('build/output.png')
        image = ImageTk.PhotoImage(pil_image)
        label.image = image
        label.config(image=image, text="")
        button.config(state=tk.NORMAL)
      except Exception as e:
        label.config(text="Received result for task " + task_id + " : " + response + " : " + str(e))
    else:
      label.config(text=err + " for task: " + task_id + " corr_id: " + corr_id)

async def load_image():
    global connected
    if not connected:
      await connect()

    args = input_field.get()

    button.config(state=tk.DISABLED)
    label.config(text="Offoading task ...", image="")

    await meca_api.offload_task(
      str(101),
      'sdtest:latest',
      '{' + args + '}',
      callback=callback_on_receive,
      resource={'cpu': 8, 'memory': 8192},
    )

    label.config(text="Computing via MECAnywhere ...", image="")

    await meca_api.join(500, 500)

root = tk.Tk("Image generator")
root.geometry("800x640")

input_field = tk.Entry(root, width=100)
input_field.insert(0, "\"prompt\": \"cute cat 4k, high-res, masterpiece, best quality, soft lighting, dynamic angle\", \"num_inference_steps\": 8")
input_field.pack()
input_field.focus()

button = tk.Button(root, text="Load image", command=async_handler(load_image))
button.pack()

label = tk.Label(root)
label.pack(expand=1, fill=tk.BOTH)

async_mainloop(root)
