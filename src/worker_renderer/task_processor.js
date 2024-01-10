const log = require('electron-log/renderer');
const protobuf = require('protobufjs');
const executor_api = require('./executor_api');

const Task = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('Task');

const TaskResult = protobuf
  .loadSync('src/worker_renderer/schema.proto')
  .lookupType('TaskResult');

function parseTaskFromProto(content) {
  let task;
  try {
    task = Task.decode(content);
  } catch (err) {
    console.log(' [con] Got decode error: %s', err.toString());
    log.info(' [con] Got decode error: %s', err.toString());
    return { id: '', content: err.toString() };
  }

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
}

async function handleMsgContent(content) {
  const transactionStartDatetime = Math.floor(new Date().getTime() / 1000);

  const task = parseTaskFromProto(content);

  let result = '';
  result = await executor_api.postTaskExecution(
    task.containerRef,
    task.content,
    task.resource,
    task.runtime
  );

  if (task.resource == null) {
    task.resource = { cpu: 1, memory: 128 };
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

  return TaskResult.encode(TaskResult.fromObject(reply)).finish();
}

module.exports = {
  handleMsgContent,
};
