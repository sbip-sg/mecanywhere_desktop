FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install torch==2.0.1+cpu --index-url https://download.pytorch.org/whl/cpu
RUN pip install -r requirements.txt

COPY app.py app.py

EXPOSE 8080

CMD ["python", "-m", "flask", "--app", "app.py", "run", "--host=0.0.0.0", "--port=8080"]
