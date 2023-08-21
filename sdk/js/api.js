const io = require('socket.io-client');

async function initiateConnection(containerRef, callbackOnReceive) {
    return new Promise((resolve, reject) => {
        const socket = io('http://localhost:3000', {query: {containerRef}});
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
            callbackOnReceive(id, result);
        });
        socket.on('registered', (registered) => {
            console.log('Registered with server: ', registered);
            if (!registered) {
                reject('Container not registered');
            }
            resolve(socket);
        })
    });
}

async function offloadTask(task, callback) { // publish job
  console.log('Offloading task...');
  socket.emit('offload', task, callback);
}

exports.connectAndListen = connectAndListen;
exports.offloadTask = offloadTask;
