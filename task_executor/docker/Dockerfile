FROM golang:1.20-bullseye AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

RUN echo "deb http://ftp.de.debian.org/debian bullseye main contrib" | tee -a /etc/apt/sources.list \
&& echo "deb http://ftp.de.debian.org/debian bullseye main non-free" | tee -a /etc/apt/sources.list \
&& cat /etc/apt/sources.list

RUN apt update && apt install libnvidia-ml-dev -y

# Download and cache Go modules
RUN go mod tidy

# Build the Go application with static linking
RUN CGO_ENABLED=1 GOOS=linux go build -o app ./app

# Expose a port if your application listens on a specific port
EXPOSE 8080

RUN apt install tini

# Run the Go application when the container starts
CMD ["./app/app", "-config", "./mecanywhere_executor.yaml"]
