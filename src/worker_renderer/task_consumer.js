const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const CONSUMER_QUEUE = 'rpc_queue';
const MQ_URL = 'amqp://localhost';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

const connection = await amqp.connect(MQ_URL);
const channel = await connection.createChannel();
channel.assertQueue(CONSUMER_QUEUE, {
  durable: true,
});
channel.prefetch(1);

function compute(taskContent) {
  try {
    // Security risk
    return eval(taskContent);
  } catch (e) {
    return e.toString();
  }
}

console.log(' [con] Awaiting RPC requests');
channel.consume(CONSUMER_QUEUE, (msg) => {
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

  channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {
    correlationId: msg.properties.correlationId,
    persistent: true,
  });

  channel.ack(msg);
});

function closeConsumer() {
  connection.close();
}
