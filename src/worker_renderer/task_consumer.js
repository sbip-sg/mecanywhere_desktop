const amqp = require('amqplib');
const { ipcRenderer } = require('electron');
const protobuf = require('protobufjs');
const Docker = require('dockerode');

const MQ_URL = 'amqp://localhost';

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

const docker = new Docker();

const auth = {
  username: 'username',
  password: 'password',
  auth: '',
  email: 'your@email.email',
  serveraddress: 'https://index.docker.io/v1'
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
    let containerRef = null;

    this.startConsumer = async function startConsumer() {
      connection = await amqp.connect(MQ_URL);
      channel = await connection.createChannel();
      let callbackQueue = await channel.assertQueue(queueName, {
        durable: true,
        expires: 1000 * 60 * 30,
      });
      console.log(' [con] Awaiting RPC requests');

      channel.consume(queueName, (msg) => {
        const correlationId = msg.properties.correlationId;
        const result = handleMsgContent(msg.content);
        if (correlationId === 'containerRef') {
          containerRef = result;
        }

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(result.toString()),
          {
            correlationId: correlationId,
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

function pullContainer(containerRef) {
  console.log("in")
  return new Promise((resolve, reject) => {
    docker.pull(containerRef, (err, stream) => {
      console.log(err)
      console.log(stream)
      if (err) {
        reject(err);
      } else {
        function onFinished(err, output) {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        }

        docker.modem.followProgress(stream, {'authconfig': auth}, onFinished);
      }
    });
  });
}

function runContainer(input) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { 'id': self.containerRef, 'input': JSON.stringify(input) }
  }
  fetch('http://172.18.0.255:2591').then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  }).catch((e) => {
    return e.toString();
  })
}

async function handleMsgContent(content) {
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
      const containerRef = deserializedTask.content;
      // await pullContainer(containerRef).then(() => {
      //   result = containerRef;
      //   console.log("success")
      // }).catch((e) => {
      //   result = e.toString();
      //   console.log(result)
      // }).finally(() => {
      //   handleJobResultsReceived(deserializedTask.id, result);
      //   return result;
      // });
    } else {
      return runContainer(deserializedTask.content);
    }
  }
}

function handleJobResultsReceived(id, result) {
  ipcRenderer.send('job-results-received', id, result);
}
