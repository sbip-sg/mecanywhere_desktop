FROM python:3.9.0
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install openvino-dev[onnx,pytorch]==2022.3.0
RUN pip install -r requirements.txt
RUN pip install flask
RUN pip install flask-restful
RUN apt-get update && apt-get install -y python3-opencv
RUN pip install opencv-python
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN apt-get install -y git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/bes-dev/stable-diffusion-v1-4-openvino
COPY . .
EXPOSE 8080
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]

