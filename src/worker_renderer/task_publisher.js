const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const MQ_URL = process.env.MQ_URL || 'amqp://localhost:5672';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

class Publisher {
  constructor() {
    // private variables
    let connection = null;
    let channel = null;
    let callbackQueue = null;
    let correlationId;

    this.startPublisher = async function startPublisher() {
      connection = await amqp.connect(MQ_URL);
      channel = await connection.createChannel();
      callbackQueue = await channel.assertQueue('', {
        // exclusive: true,
        durable: true,
        expires: 1000 * 60 * 30,
      });
      console.log(' [pub] Awaiting RPC requests');

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
        }
      );
    };

    ipcRenderer.on('publish-job', async (event, id, containerRef, content) => {
      const taskObject = {
        id,
        containerRef,
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

    this.publishTask = async function publishTask(id, taskObject) {
      if (!callbackQueue) {
        await this.startPublisher();
        // throw new Error('Queue is not initialized');
      }
      const serializedTask = Task.encode(Task.create(taskObject)).finish();
      correlationId = id;

      console.log(' [pub] Requesting: ', taskObject);
      // offload
      // channel.sendToQueue(consumerQueueName, Buffer.from(serializedTask), {
      //   correlationId,
      //   replyTo: callbackQueue.queue,
      //   persistent: true,
      // });
    };

    this.close = async function close() {
      await connection.close();
      ipcRenderer.removeAllListeners('publish-job');
    };
  }
}

let publisher;

ipcRenderer.on('start-publisher', async (event) => {
  publisher = new Publisher();
  await publisher.startPublisher();
});

ipcRenderer.on('stop-publisher', async (event) => {
  await publisher.close();
});

// const publisher = new Publisher('rpc_queue');
// await publisher.startPublisher();

// publish task on click
// document.getElementById('pub').addEventListener('click', () => {
//   const id = Math.random().toString();
//   const content = '1 + 1';
//   const taskObject = {
//     id,
//     content,
//   };

//   publisher.publishTask(id, taskObject);
// });
