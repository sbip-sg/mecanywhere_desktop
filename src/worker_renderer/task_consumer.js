const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');
const { postTaskExecution } = require('./executor_api');
const { struct } = require('pb-util');

const MQ_URL = process.env.MQ_URL || 'amqp://localhost:5672';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

const TaskResult = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('TaskResult');

const parseTaskFromProto = (content) => {
  const task = Task.decode(content);
  task.resource = struct.decode(task.resource);
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
      channel = await connection.createChannel();
      const callbackQueue = await channel.assertQueue(queueName, {
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

    this.close = async function close() {
      await connection.close();
      delete Consumer.openQueues[queueName];
    };

    this.handleMsgContent = async function handleMsgContent(content) {
      const task = parseTaskFromProto(content);

      ipcRenderer.send(
        'job-received',
        task.id,
        task.containerRef,
        task.content,
        // task.resource
      );

      let result = '';
      result = await postTaskExecution(
        task.containerRef,
        task.content,
        task.resource
      );

      ipcRenderer.send('job-results-received', task.id, result);
      return { id: task.id, content: result };
    };
  }
}

ipcRenderer.on('start-consumer', async (event, queueName) => {
  const consumer = new Consumer(queueName);
  await consumer.startConsumer();
});
