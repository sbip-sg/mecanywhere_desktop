import Channels from '../common/channels.js';

const log = require('electron-log/renderer');
const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const task_processor = require('./task_processor');

const MQ_URL = process.env.MQ_URL || 'amqp://localhost:5672';

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

    this.startConsumer = async function startConsumer() {
      connection = await amqp.connect(MQ_URL);
      console.log(' [con] Connected to ', MQ_URL);
      log.info(' [con] Connected to ', MQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(queueName, {
        durable: true,
        autoDelete: true,
      });
      console.log(' [con] Awaiting RPC requests');
      log.info(' [con] Awaiting RPC requests');

      channel.consume(queueName, async (msg) => {
        channel.ack(msg);
        const { correlationId } = msg.properties;
        const serializedResult = await task_processor.handleMsgContent(
          msg.content
        );

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(serializedResult),
          {
            correlationId,
            persistent: true,
          }
        );
      });
    };

    this.close = function close() {
      if (channel != null) {
        channel.close();
        channel = null;
      }
      if (connection != null) {
        connection.close();
        connection = null;
      }
      console.log(' [con] Connection closed');
      log.info(' [con] Connection closed');

      delete Consumer.openQueues[queueName];
    };
  }
}

ipcRenderer.on(Channels.START_CONSUMER, async (event, queueName) => {
  const consumer = new Consumer(queueName);
  await consumer.startConsumer();
});

ipcRenderer.on(Channels.STOP_CONSUMER, async (event, queueName) => {
  const consumer = Consumer.openQueues[queueName];
  if (consumer) {
    await consumer.close();
  }
});
