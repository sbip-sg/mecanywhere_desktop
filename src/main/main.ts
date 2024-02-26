/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron';
import log from 'electron-log/main';
import path from 'path';
import { performance } from 'perf_hooks';
import { resolveHtmlPath, getAssetPath } from './util';
import MenuBuilder from './menu';
import Channels from '../common/channels';
import {
  removeExecutorContainer,
  runExecutorContainer,
  runExecutorGPUContainer,
  checkDockerDaemonRunning,
  checkContainerExists,
  checkContainerGPUSupport,
} from './dockerIntegration';
import { getElectronStore, setElectronStore } from './electronStore';
import {
  jobResultsReceived,
  jobReceived,
  startConsumer,
  stopConsumer,
  onClientRegistered,
  onJobResultsReceived,
} from './jobs';

import { create, globSource } from 'ipfs-http-client'

const os = require('os');
const fs = require('fs-extra');
// const { globSource } = require('ipfs-http-client');

let ipfsFilesDir
if (process.platform === 'win32') {
  // ipfsFilesDir = path.join(baseDir, 'ipfsFiles');
  console.error("decide on window's baseDir")
} else {
  const baseDir = path.join(os.homedir(), '.MECA');
  ipfsFilesDir = path.join(baseDir, 'ipfsFiles');
  fs.ensureDirSync(ipfsFilesDir);
  console.log("ipfsFilesDir", ipfsFilesDir)
}

const url = 'http://localhost:5001'
const client = create({ url });

const start = performance.now();

let mainWindow: BrowserWindow | null = null;
let workerWindow: BrowserWindow | null = null;
let tray: Tray;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

ipcMain.on('open-file-dialog', async (event) => {
  let win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile'] // Allows users to select files only
  });

  if (canceled) {
    return;
  }

  // Assuming `filePaths[0]` is the path to the file you want to upload to IPFS
  event.reply('selected-file', filePaths[0]);
});

ipcMain.on('open-directory-dialog', async (event) => {
  let win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'] // Allows users to select directories only
  });

  if (canceled) {
    return;
  }

  // Assuming `filePaths[0]` is the path to the directory you want to upload to IPFS
  event.reply('selected-directory', filePaths[0]);
});




ipcMain.on('IPFS_ADD_LARGE_FILE', async (event, sizeInMB) => {
  const filePath = path.join(ipfsFilesDir, 'largeFile.txt');
  
  generateLargeFile(filePath, sizeInMB)
      .then(() => {
          event.reply('IPFS_ADD_LARGE_FILE_RESPONSE', true, filePath);
      })
      .catch(error => {
          console.error('Error generating large file:', error);
          event.reply('IPFS_ADD_LARGE_FILE_RESPONSE', false, null, error.message);
      });
});

const generateLargeFile = async (filePath, sizeInMB) => {
  // Delete the file first if it exists
  await fs.remove(filePath);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    const oneMB = 1024 * 1024; // Bytes
    const chunkSize = 1024; // Adjust chunk size as needed
    const totalChunks = (sizeInMB * oneMB) / chunkSize;
    let written = 0;
    const dataChunk = '0'.repeat(chunkSize - 1) + '\n'; // Ending each chunk with a newline

    stream.on('error', reject);

    const writeChunk = () => {
      while (written < totalChunks) {
        if (!stream.write(dataChunk)) {
          written++;
          return stream.once('drain', writeChunk);
        }
        written++;
      }
      if (written >= totalChunks) {
        stream.end();
      }
    };

    stream.on('finish', () => {
      console.log(`Finished writing ${sizeInMB}MB to ${filePath}`);
      resolve(filePath); // Resolve the promise with the filePath
    });

    writeChunk();
  });
};

// Handler to add data to IPFS
ipcMain.handle(Channels.IPFS_ADD, async (event, data) => {
  try {
    const { cid } = await client.add(data);
    return cid.toString();
  } catch (error) {
    console.error('Error adding data to IPFS:', error);
    throw error; // This will be sent as an error to the renderer
  }
});

ipcMain.handle('upload-file-to-ipfs', async (event, filePath) => {
  try {
    // Read the file content
    const content = await fs.promises.readFile(filePath);
    // Extract the file name
    const fileName = path.basename(filePath);
    // Construct a virtual directory structure by specifying a path
    const files = [{
      path: fileName, // Adjust 'wrapped' to your preferred directory name
      content
    }];
    
    // Use client.addAll to upload with the wrapping directory
    const addOptions = { 
      pin: true, 
      wrapWithDirectory: true, 
      timeout: 10000 // Adjust the timeout as necessary
    };
    let cid;
    for await (const file of client.addAll(files, addOptions)) {
      console.log(file);
      cid = file.cid.toString(); // This will update with each file, ending with the CID of the directory
    }
    return cid; // Return the CID of the wrapping directory
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
});

// ipcMain.handle('upload-file-to-ipfs', async (event, filePath) => {
//   try {
//     const file = await fs.promises.readFile(filePath);
//     const { cid } = await client.add({ path: path.basename(filePath), content: file });
//     return cid.toString();
//   } catch (error) {
//     console.error('Error uploading file to IPFS:', error);
//     throw error;
//   }
// });


ipcMain.handle('upload-folder-to-ipfs', async (event, folderPath) => {
  const globSourceOptions = { recursive: true };
  const addOptions = { 
    pin: true, 
    wrapWithDirectory: true, 
    timeout: 10000 // Adjust the timeout as necessary
  };
  try {
    for await (const file of client.addAll(globSource(folderPath, globSourceOptions), addOptions)) {
      console.log(file);
    }
  } catch (error) {
    console.error('Error uploading folder to IPFS:', error);
    throw error;  // Properly throw the error to propagate it back to the renderer process
  }
});
// Handler to fetch data from IPFS
ipcMain.handle(Channels.IPFS_CAT, async (event, cid) => {
  try {
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString(); // Assuming the data is text
  } catch (error) {
    console.error('Error fetching data from IPFS:', error);
    throw error; // This will be sent as an error to the renderer
  }
});

ipcMain.handle('download-from-ipfs', async (event, cid) => {
  console.log("Starting download for CID:", cid);
  try {
    let unwrappedBasePath = ""; // To store the unwrapped base path after identifying the wrapping layer

    for await (const file of client.get(cid)) {
      // Determine the unwrapped base path on the first iteration
      if (!unwrappedBasePath) {
        // Skip the first level directory (wrapping layer) by adjusting the basePath
        const firstSlashIndex = file.path.indexOf('/');
        if (firstSlashIndex !== -1) {
          unwrappedBasePath = path.join(ipfsFilesDir, file.path.substring(0, firstSlashIndex));
          await fs.ensureDir(unwrappedBasePath); // Ensure this adjusted base directory exists
        } else {
          // If there's no slash, it means it's a single file wrapped in a directory
          unwrappedBasePath = ipfsFilesDir; // Use the ipfsFilesDir directly
        }
      }

      // For the actual content, adjust the output path to remove the wrapping layer
      const relativePath = file.path.substring(file.path.indexOf('/') + 1);
      const outputPath = path.join(ipfsFilesDir, relativePath);

      if (file.content) {
        // It's a file; write its content to the outputPath
        await fs.ensureDir(path.dirname(outputPath)); // Ensure directory for the file exists
        const content = [];
        for await (const chunk of file.content) {
          content.push(chunk);
        }
        await fs.writeFile(outputPath, Buffer.concat(content));
      } else if (relativePath) {
        // It's a directory and not the wrapping layer; ensure it exists
        await fs.ensureDir(outputPath);
      }
    }

    console.log("Download complete");
    return `Content downloaded successfully to ${unwrappedBasePath}`;
  } catch (error) {
    console.error('Error downloading content from IPFS:', error);
    throw error;  // Propagate the error back to the renderer
  }
});

// ipcMain.handle('download-from-ipfs', async (event, cid) => {
//   console.log("cid", cid)
//   try {
//     for await (const file of client.get(cid)) {
//       console.log("file", file)
//       const outputPath = path.join(ipfsFilesDir, file.path);
//       console.log("outputPath", outputPath);

//       if (file.content) {
//         console.log("file.content", file.content)
//         await fs.ensureDir(path.dirname(outputPath)); // Ensure the output directory exists
//         const writable = fs.createWriteStream(outputPath);
//         for await (const chunk of file.content) {
//           writable.write(chunk); // Write each chunk directly to the file
//         }
//         writable.end(); // Ensure the stream is properly closed after writing
//       } else {
//         await fs.ensureDir(outputPath); // Ensure directory for directories
//       }
//     }
//     console.log("Download complete");
//     return `Content downloaded to ${ipfsFilesDir}`;
//   } catch (error) {
//     console.error('Error downloading content from IPFS:', error);
//     throw error; // Propagate the error back to the renderer
//   }
// });


const SDK_SOCKET_PORT = process.env.SDK_SOCKET_PORT || 3001;
const io = require('socket.io')();

const appDevServer = io.listen(SDK_SOCKET_PORT);

appDevServer.on('connection', (socket) => {
  console.log('A user connected');
  ipcMain.on(Channels.CLIENT_REGISTERED, onClientRegistered(socket));
  ipcMain.on(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived(socket));
  socket.on('offload', async (jobJson: string) => {
    console.log('Received job...', jobJson);
    try {
      mainWindow?.webContents.send(Channels.OFFLOAD_JOB, jobJson);
      socket.emit('offloaded', null, 'success');
    } catch (error) {
      socket.emit('offloaded', error, null);
    }
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    mainWindow?.webContents.send(Channels.DEREGISTER_CLIENT);
    ipcMain.removeAllListeners(Channels.CLIENT_REGISTERED);
    ipcMain.removeListener(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived);
  });
  mainWindow?.webContents.send(Channels.REGISTER_CLIENT);
});

ipcMain.on(Channels.STORE_GET, getElectronStore);

ipcMain.on(Channels.STORE_SET, setElectronStore);

ipcMain.on(Channels.JOB_RESULTS_RECEIVED, (event, id, result) => {
  jobResultsReceived(mainWindow, event, id, result);
});

ipcMain.on(Channels.JOB_RECEIVED, (event, id, result) => {
  jobReceived(mainWindow, event, id, result);
});

ipcMain.on(Channels.START_CONSUMER, (event, queueName) => {
  startConsumer(workerWindow, event, queueName);
});

ipcMain.on(Channels.STOP_CONSUMER, (event, queueName) => {
  stopConsumer(workerWindow, event, queueName);
});

ipcMain.on(Channels.APP_CLOSE_CONFIRMED, () => {
  if (mainWindow) mainWindow.destroy();
});

ipcMain.on(Channels.APP_RELOAD_CONFIRMED, () => {
  if (mainWindow) mainWindow.reload();
});

ipcMain.on(Channels.REMOVE_EXECUTOR_CONTAINER, removeExecutorContainer);

ipcMain.on(Channels.RUN_EXECUTOR_CONTAINER, runExecutorContainer);

ipcMain.on(Channels.RUN_EXECUTOR_GPU_CONTAINER, runExecutorGPUContainer);

ipcMain.on(Channels.CHECK_DOCKER_DAEMON_RUNNING, checkDockerDaemonRunning);

ipcMain.on(Channels.CHECK_CONTAINER_EXIST, checkContainerExists);

ipcMain.on(Channels.CHECK_CONTAINER_GPU_SUPPORT, checkContainerGPUSupport);

const createWorkerWindow = async () => {
  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  workerWindow.loadFile('src/worker_renderer/worker.html');
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    // frame: false,
    // titleBarStyle: 'hidden',
    show: false,
    width: 1440,
    height: 900,
    icon: getAssetPath('mecanywhere-icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
    },
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // before closing
  mainWindow.on('close', (event) => {
    log.info('attempt close');
    event.preventDefault();
    // mainWindow?.webContents.send('app-close-initiated');
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  // signify app successfully closed
  mainWindow.on('closed', () => {
    log.info('app successfully closed');
    mainWindow = null;
  });

  // intended for app reload, but not working currently
  // mainWindow.webContents.on('will-navigate', (event) => {
  //   log.info('mainWindow did-start-navigation');
  //   event.preventDefault();
  //   mainWindow?.webContents.send('app-reload-initiated');
  // });

  const icon = getAssetPath('mecanywhere-icon.png');
  tray = new Tray(icon);
  tray.setIgnoreDoubleClickEvents(true);

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: (_) => {
        app.quit();
        mainWindow?.webContents.send('app-close-initiated');
      },
    },
  ]);
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  tray.on('click', () => {
    console.log('tray left clicked');
    if (mainWindow) {
      mainWindow.show();
    }
  });

  tray.setToolTip('MECAnywhere');
  tray.setContextMenu(trayMenu);
};

app.on('before-quit', function () {
  tray.destroy();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// const startIPFS = async () => {
//   ipfsNode = await IPFS.create();
//   const version = await ipfsNode.version();
//   console.log('IPFS Node version:', version.version);

//   const id = await ipfsNode.id();
//   console.log('IPFS Node ID:', id.id);
// }

app
  .whenReady()
  .then(() => {
    // startIPFS()
    createMainWindow();
    createWorkerWindow();
    const appReadyTimeTaken = performance.now() - start;
    console.log(`App ready in ${appReadyTimeTaken} ms`);
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        createMainWindow();
        createWorkerWindow();
      }
    });
  })
  .catch(console.log);
