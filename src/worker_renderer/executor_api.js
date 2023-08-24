const TASK_EXECUTOR_URL =
  process.env.TASK_EXECUTOR_URL || 'http://localhost:2591';

async function postTaskExecution(containerRef, input) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: containerRef,
      // resource: {
      //   cpu: 1,
      //   mem: 128,
      // },
      input,
    }),
  };
  const msg = await fetch(TASK_EXECUTOR_URL, requestOptions)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((res) => {
      return res.msg;
    })
    .catch((e) => {
      return e.toString();
    });
  return msg;
}

module.exports.postTaskExecution = postTaskExecution;
