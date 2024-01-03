import base64
from flask import Flask
from flask_restful import reqparse
import demo
from openvino.runtime import Core

app = Flask(__name__)


@app.route('/', methods=['POST'])
def entry_point():
    parser = reqparse.RequestParser()
    # pipeline configure
    parser.add_argument("model", type=str, default="bes-dev/stable-diffusion-v1-4-openvino", help="model name")
    # inference device
    parser.add_argument("device", type=str, default="CPU", help=f"inference device [{', '.join(Core().available_devices)}]")
    # randomizer params
    parser.add_argument("seed", type=int, default=None, help="random seed for generating consistent images per prompt")
    # scheduler params
    parser.add_argument("beta_start", type=float, default=0.00085, help="LMSDiscreteScheduler::beta_start")
    parser.add_argument("beta_end", type=float, default=0.012, help="LMSDiscreteScheduler::beta_end")
    parser.add_argument("beta_schedule", type=str, default="scaled_linear", help="LMSDiscreteScheduler::beta_schedule")
    # diffusion params
    parser.add_argument("num_inference_steps", type=int, default=32, help="num inference steps")
    parser.add_argument("guidance_scale", type=float, default=7.5, help="guidance scale")
    parser.add_argument("eta", type=float, default=0.0, help="eta")
    # tokenizer
    parser.add_argument("tokenizer", type=str, default="openai/clip-vit-large-patch14", help="tokenizer")
    # prompt
    parser.add_argument("prompt", type=str, default="Street-art painting of Emilia Clarke in style of Banksy, photorealism", help="prompt")
    # Parameter re-use:
    parser.add_argument("params_from", type=str, required=False, help="Extract parameters from a previously generated image.")
    # img2img params
    parser.add_argument("init_image", type=str, default=None, help="path to initial image")
    parser.add_argument("strength", type=float, default=0.5, help="how strong the initial image should be noised [0.0, 1.0]")
    # inpainting
    parser.add_argument("mask", type=str, default=None, help="mask of the region to inpaint on the initial image")
    # output name
    parser.add_argument("output", type=str, default="output.png", help="output image name")

    args = parser.parse_args()
    print(args)

    demo.main(args)

    with open(args.output, 'rb') as f:
        base64_bytes = base64.b64encode(f.read())

    return base64_bytes

print("meca-init-done")
