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

    prompt = prompt_field.get()
    steps = steps_field.get()

    button.config(state=tk.DISABLED)
    label.config(text="Offoading task ...", image="")

    await meca_api.offload_task(
      str(101),
      'sdtest:latest',
      '{\"prompt\": \"' + prompt + '\", \"num_inference_steps\": ' + steps + '}',
      callback=callback_on_receive,
      resource={'cpu': 8, 'memory': 8192},
    )

    label.config(text="Computing via MECAnywhere ...", image="")

    await meca_api.join(500, 500)

root = tk.Tk()
root.title("Image generator")
root.geometry("800x640")

prompt = tk.Label(root, text="prompt")
prompt.pack()

prompt_field = tk.Entry(root, width=100)
prompt_field.insert(0, "cute cat 4k, high-res, masterpiece, best quality, soft lighting, dynamic angle")
prompt_field.pack(padx=10, pady=10)
prompt_field.focus()

steps = tk.Label(root, text="inference steps")
steps.pack()

steps_field = tk.Entry(root, width=100)
steps_field.insert(0, "8")
steps_field.pack(padx=10, pady=10)
steps_field.focus()

button = tk.Button(root, text="Load image", command=async_handler(load_image))
button.config(bd=1, bg="#66cdaa", relief="ridge", fg="white", padx=10, pady=10)
button.pack()

label = tk.Label(root)
label.pack(expand=1, fill=tk.BOTH)

async_mainloop(root)
