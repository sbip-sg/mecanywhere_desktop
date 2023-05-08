const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const MQ_URL = 'amqp://localhost';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

class Publisher {
  static openQueues = {};

  constructor(consumerQueueName) {
    if (Publisher.openQueues[consumerQueueName]) {
      throw new Error(`Consumer queue ${consumerQueueName} already exists`);
    }
    Publisher.openQueues[consumerQueueName] = this;

    // private variables
    let connection = null;
    let channel = null;
    let callbackQueue = null;
    let correlationId;

    this.startPublisher = async function startPublisher() {
      connection = await amqp.connect(MQ_URL);
      channel = await connection.createChannel();
      callbackQueue = await channel.assertQueue('', {
        exclusive: true,
        durable: true,
      });

      channel.consume(
        callbackQueue.queue,
        (msg) => {
          if (msg) {
            console.log(' [pub] Got result: %s', msg.content.toString());

            ipcRenderer.send(
              'job-results-received',
              msg.properties.correlationId,
              msg.content.toString()
            );
          }
        },
        {
          noAck: true,
        }
      );

      ipcRenderer.on('publish-job', async (event, id, content) => {
        const taskObject = {
          id,
          content,
        };

        const typeError = Task.verify(taskObject);
        if (typeError) {
          console.log(' [pub] Got type error: %s', typeError.toString());
          event.sender.send('job-results-received', id, typeError.toString());
          return;
        }

        this.publishTask(id, taskObject);
      });
    };

    this.publishTask = async function publishTask(id, taskObject) {
      const serializedTask = Task.encode(Task.create(taskObject)).finish();
      correlationId = id;

      console.log(' [pub] Requesting: ', serializedTask);
      channel.sendToQueue(consumerQueueName, Buffer.from(serializedTask), {
        correlationId,
        replyTo: callbackQueue.queue,
        persistent: true,
      });
    };

    this.close = async function close() {
      await connection.close();
      delete Publisher.openQueues[consumerQueueName];
    };
  }
}

let publisher;

ipcRenderer.on('start-publisher', async (event, consumerQueueName) => {
  publisher = new Publisher(consumerQueueName);
  await publisher.startPublisher();
});

// const publisher = new Publisher('rpc_queue');
// await publisher.startPublisher();

// publish task on click
document.getElementById('pub').addEventListener('click', () => {
  const id = Math.random().toString();
  const content = '1 + 1';
  const taskObject = {
    id,
    content,
  };

  publisher.publishTask(id, taskObject);
});
