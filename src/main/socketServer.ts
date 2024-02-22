const io = require('socket.io')();
const Channels = require('../common/channels'); // Adjust the path as necessary
import log from 'electron-log/main';

export const setupSocketServer = () => {
    log.info("aaaaa")
//   const SDK_SOCKET_PORT = process.env.SDK_SOCKET_PORT || 3001;
//   const server = io.listen(SDK_SOCKET_PORT);

//   server.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('offload', async (jobJson) => {
//       // ... handle 'offload' event ...
//       if (mainWindow) {
//         mainWindow.webContents.send(Channels.OFFLOAD_JOB, jobJson);
//       }
//     });

//     // Define other socket event handlers here...

//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//       // ... handle 'disconnect' event ...
//     });
//   });

//   return server;
};
