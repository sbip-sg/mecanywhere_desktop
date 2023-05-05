const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');

const CONSUMER_QUEUE = 'rpc_queue';
const MQ_URL = 'amqp://localhost';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

let correlationId;

const connection = await amqp.connect(MQ_URL);
const channel = await connection.createChannel();
const callbackQueue = await channel.assertQueue('', {
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

async function publishTask(id, serializedTaskProto) {
  correlationId = id;

  console.log(' [pub] Requesting: ', serializedTaskProto);
  channel.sendToQueue(CONSUMER_QUEUE, Buffer.from(serializedTaskProto), {
    correlationId,
    replyTo: callbackQueue.queue,
    persistent: true,
  });
}

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

  const serializedTask = Task.encode(Task.create(taskObject)).finish();
  publishTask(id, serializedTask);
});
