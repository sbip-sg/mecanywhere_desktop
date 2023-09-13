import pika
import models.schema_pb2 as schema


class Consumer:
    _class_instance = None

    def __init__(self, url, queue_name):
        self.url = url
        self.queue_name = queue_name
        self.connection = None
        self.channel = None

    def __new__(cls, config):
        if cls._class_instance is None:
            cls._class_instance = super(Consumer, cls).__new__(cls)
        return cls._class_instance

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if self.channel is not None:
            print("Stopping consuming")
            self.channel.basic_cancel()
            self.channel.stop_consuming()
            print("Stopped consuming")
        if self.connection is not None:
            print("Closing connection")
            self.connection.close()
            print("Connection closed")

    def start_relayer(self):
        self.connection = pika.BlockingConnection(
            pika.URLParameters(self.url)
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(
            queue=self.queue_name,
            durable=True,
            arguments={"x-expires": 1000 * 60 * 30},
        )
        self.channel.basic_consume(
            queue=self.queue_name,
            on_message_callback=self.callback,
            auto_ack=True,
        )
        print("Result relayer started consuming")
        self.channel.start_consuming()

    def callback(self, ch, method, properties, body):
