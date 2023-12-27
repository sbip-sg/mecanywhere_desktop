FROM python:3.9.0
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install openvino-dev[onnx,pytorch]==2022.3.0
RUN pip install -r requirements.txt
RUN pip install flask
RUN apt-get update && apt-get install -y python3-opencv
RUN pip install opencv-python
COPY . .
EXPOSE 8080
CMD ["python", "-m", "flask", "--app", "app.py", "run", "--host=0.0.0.0", "--port=8080"]
