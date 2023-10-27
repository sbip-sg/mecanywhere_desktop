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
  if (task.resource != null) {
    task.resource = struct.decode(task.resource);
  }
  const typeError = Task.verify(task);

  if (typeError) {
    console.log(' [con] Got type error: %s', typeError.toString());
    let id = '';
    if ('id' in task) id = task.id;
    return { id, content: typeError.toString() };
  }
  console.log(` [con] Received: ${JSON.stringify(task)}`);

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
      channel = await connection.createChannel();
      await channel.assertQueue(queueName, {
        durable: true,
        expires: 1000 * 60 * 30,
      });
      console.log(' [con] Awaiting RPC requests');

      channel.consume(queueName, async (msg) => {
        const { correlationId } = msg.properties;
        const resultObject = await this.handleMsgContent(msg.content);
        const serializedResult = TaskResult.encode(resultObject).finish();

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
      delete Consumer.openQueues[queueName];
    };

    this.handleMsgContent = async function handleMsgContent(content) {
      const transactionStartDatetime = new Date().getTime();

      const task = parseTaskFromProto(content);
      ipcRenderer.send(
        'job-received',
        task.id,
        task.containerRef,
        task.content,
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

      const transactionEndDatetime = new Date().getTime();
      const duration = transactionEndDatetime - transactionStartDatetime;
      const reply = { id: task.id, content: result, resourceConsumed: 0.1, transactionStartDatetime, transactionEndDatetime, duration };

      console.log(` [con] Result: ${JSON.stringify(reply)}`);

      return reply;
    };
  }
}

ipcRenderer.on('start-consumer', async (event, queueName) => {
  const consumer = new Consumer(queueName);
  await consumer.startConsumer();
});

ipcRenderer.on('stop-consumer', async (event, queueName) => {
  const consumer = Consumer.openQueues[queueName];
  if (consumer) {
    await consumer.close();
  }
});
