import Channels from '../common/channels.js';

const log = require('electron-log/renderer');
const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');
const { struct } = require('pb-util');
const { postTaskExecution } = require('./executor_api');

const MQ_URL = process.env.MQ_URL || 'amqp://localhost:5672';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

const TaskResult = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('TaskResult');

const parseTaskFromProto = (content) => {
  const task = Task.decode(content);
  const typeError = Task.verify(task);

  if (typeError) {
    console.log(' [con] Got type error: %s', typeError.toString());
    let id = '';
    if ('id' in task) id = task.id;
    return { id, content: typeError.toString() };
  }
  console.log(` [con] Received: ${JSON.stringify(task)}`);
  log.info(` [con] Received: ${JSON.stringify(task)}`);

  return task;
};

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
        const { correlationId } = msg.properties;
        const resultObject = await this.handleMsgContent(msg.content);
        const serializedResult = TaskResult.encode(
          TaskResult.fromObject(resultObject)
        ).finish();

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(serializedResult),
          {
            correlationId,
            persistent: true,
          }
        );

        channel.ack(msg);
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

    this.handleMsgContent = async function handleMsgContent(content) {
      const transactionStartDatetime = Math.floor(new Date().getTime() / 1000);

      const task = parseTaskFromProto(content);
      ipcRenderer.send(
        Channels.JOB_RECEIVED,
        task.id,
        task.containerRef,
        task.content
        // task.resource,
        // task.runtime
      );

      let result = '';
      result = await postTaskExecution(
        task.containerRef,
        task.content,
        task.resource,
        task.runtime
      );

      if (task.resource == null) {
        task.resource = { "cpu": 1, "memory": 128 };
      }
      console.log(` [con] Resource consumed: ${task.resource}`);
      log.info(` [con] Resource consumed: ${task.resource}`);

      const transactionEndDatetime = Math.floor(new Date().getTime() / 1000);
      const duration = transactionEndDatetime - transactionStartDatetime;
      const reply = {
        id: task.id,
        content: result,
        resource: task.resource,
        transactionStartDatetime,
        transactionEndDatetime,
        duration,
      };

      console.log(` [con] Result: ${JSON.stringify(reply)}`);
      log.info(` [con] Result: ${JSON.stringify(reply)}`);

      return reply;
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
