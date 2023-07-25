const io = require('socket.io-client');

async function connectAndListen(port, callback) {
    return new Promise((resolve, reject) => {
        const socket = io('http://localhost:' + port);
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('connect_error', (error) => {
            console.error('Error connecting to server:', error);
            reject(error);
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket.on('job-results-received', (id, result) => {
            console.log('Received result:', result, 'for job:', id);
            callback(id, result);
        });
        socket.on('registered', () => {
            console.log('Registered with server');
            resolve(socket);
        })
    });
}

async function main() {
  const socket = await connectAndListen(3000, (id, result) => console.log("callbacked ", id, result));
  
async function offloadTask(task, callback) { // publish job
  console.log('Offloading task...');
  socket.emit('offload', task, callback);
}

  offloadTask('1+1', (err, response) => {
    if (err) {
      console.error('Error executing code:', err);
    } else {
      console.log(response.status);
    }
  });

  exports.connectAndListen = connectAndListen;
  exports.offloadTask = offloadTask;
  
}

main();

// exports.connectAndListen = connectAndListen;
// exports.offloadTask = offloadTask;
