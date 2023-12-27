# Use an official Python runtime as the base image
FROM python:3.12-bullseye

# Set the working directory inside the container
WORKDIR /app

# Copy the server code into the container
COPY main.py .

# Expose the port that the server listens on (change it if necessary)
EXPOSE 8080

# Run the server when the container is started
CMD ["python", "-u", "main.py"]
