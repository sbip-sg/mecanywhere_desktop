FROM golang:1.20-bullseye AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

# Download and cache Go modules
RUN go mod tidy

# Build the Go application with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./app

# Use a minimal Alpine image as the base image for the final container
FROM alpine:latest

# Copy the built executable from the builder stage
COPY --from=builder /app/app/app /app/app

# Set the working directory inside the container
WORKDIR /app

# Expose a port if your application listens on a specific port
EXPOSE 8080

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

# Run the Go application when the container starts
CMD ["./app", "-config", "./meca_executor.yaml"]
