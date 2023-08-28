const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const MQ_URL = process.env.MQ_URL || 'amqp://localhost:5672';
const TASK_EXECUTOR_URL = process.env.TASK_EXECUTOR_URL || 'http://localhost:2591';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

class Consumer {
  static openQueues = {};

  constructor(queueName) {
    if (Consumer.openQueues[queueName]) {
      return Consumer.openQueues[queueName];
    }
    Consumer.openQueues[queueName] = this;

    // private variables
    let connection = null;
    let channel = null;
    let containerRef = null;

    this.startConsumer = async function startConsumer() {
      connection = await amqp.connect(MQ_URL);
      channel = await connection.createChannel();
      const callbackQueue = await channel.assertQueue(queueName, {
        durable: true,
        expires: 1000 * 60 * 30,
      });
      console.log(' [con] Awaiting RPC requests');

      channel.consume(queueName, async (msg) => {
        const correlationId = msg.properties.correlationId;
        const result = await this.handleMsgContent(msg.content);
        if (correlationId === 'containerRef') {
          containerRef = result;
        } else {
          channel.sendToQueue(
            msg.properties.replyTo,
          Buffer.from(result.toString()),
          {
            correlationId: correlationId,
            persistent: true,
          }
          );
        }

        channel.ack(msg);
      });
    };

    this.close = async function close() {
      await connection.close();
      delete Consumer.openQueues[queueName];
    };

    this.runContainer = async function runContainer(input) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': containerRef, 'input': input })
      }
      const msg = await fetch(TASK_EXECUTOR_URL, requestOptions).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      }).then((res) => {
        return res.msg;
      })
      .catch((e) => {
        return e.toString();
      })
      return msg;
    }

    this.handleMsgContent = async function handleMsgContent(content) {
      const deserializedTask = Task.decode(content).toJSON();

      const typeError = Task.verify(deserializedTask);
      if (typeError) {
        console.log(' [con] Got type error: %s', typeError.toString());
        return typeError.toString();
      } else {
        console.log(` [con] Received: ${JSON.stringify(deserializedTask)}`);

        ipcRenderer.send(
          'job-received',
          deserializedTask.id,
          deserializedTask.content
        );

        let result = "";
        if (deserializedTask.id === 'containerRef') {
          containerRef = deserializedTask.content;
          return containerRef;
        } else {
          result = await this.runContainer(deserializedTask.content);
        }

        ipcRenderer.send(
          'job-results-received',
          deserializedTask.id,
          result
        );
        return result;
      }
    }
  }
}

ipcRenderer.on('start-consumer', async (event, queueName) => {
  const consumer = new Consumer(queueName);
  await consumer.startConsumer();
});
