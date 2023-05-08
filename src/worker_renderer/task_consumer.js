const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const MQ_URL = 'amqp://localhost';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

function compute(taskContent) {
  try {
    // Security risk
    return eval(taskContent);
  } catch (e) {
    return e.toString();
  }
}

class Consumer {
  static openQueues = {};

  constructor(queueName) {
    if (Consumer.openQueues[queueName]) {
      throw new Error(`Consumer for queue ${queueName} already exists`);
    }
    Consumer.openQueues[queueName] = this;

    // private variables
    let connection = null;
    let channel = null;

    this.startConsumer = async function startConsumer() {
      connection = await amqp.connect(MQ_URL);
      channel = await connection.createChannel();
      channel.assertQueue(queueName, {
        durable: true,
      });
      channel.prefetch(1);

      console.log(' [con] Awaiting RPC requests');
      channel.consume(queueName, (msg) => {
        let result;
        const deserializedTask = Task.decode(msg.content).toJSON();

        const typeError = Task.verify(deserializedTask);
        if (typeError) {
          console.log(' [con] Got type error: %s', typeError.toString());
          result = typeError.toString();
        } else {
          console.log(` [con] Received: ${JSON.stringify(deserializedTask)}`);

          ipcRenderer.send(
            'job-received',
            deserializedTask.id,
            deserializedTask.content
          );
          result = compute(deserializedTask.content);
          ipcRenderer.send(
            'job-results-received',
            deserializedTask.id,
            result.toString()
          );
        }

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(result.toString()),
          {
            correlationId: msg.properties.correlationId,
            persistent: true,
          }
        );

        channel.ack(msg);
      });
    };

    this.close = async function close() {
      await connection.close();
      delete Consumer.openQueues[queueName];
    };
  }
}

ipcRenderer.on('start-consumer', async (event, queueName) => {
  const consumer = new Consumer(queueName);
  await consumer.startConsumer();
});
