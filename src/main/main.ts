/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, safeStorage, IpcMainEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { performance } from 'perf_hooks';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const Store = require('electron-store');
const io = require('socket.io')();
const { shell } = require('electron');

const start = performance.now();

const SDK_SOCKET_PORT = process.env.SDK_SOCKET_PORT || 3001;

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let workerWindow: BrowserWindow | null = null;

const appdev_server = io.listen(SDK_SOCKET_PORT);
appdev_server.on('connection', (socket) => {
  console.log('A user connected');

  async function clientRegistered(event: IpcMainEvent, containerRef: string) {
    console.log('Client registered: ', containerRef);
    socket.emit('registered', containerRef);
  }
  ipcMain.on('client-registered', clientRegistered)

  async function jobResultsReceived(event: IpcMainEvent, id: string, result: string) {
    console.log('Sending job results to client... ', id, result)
    socket.emit('job_results_received', id, result.toString());
  }
  ipcMain.on('job-results-received', jobResultsReceived)

  socket.on('offload', async (job: string) => {
    console.log('Received job...', job);
    try {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      mainWindow.webContents.send('offload-job', job);
      socket.emit('offloaded', null, 'success');
    } catch (error) {
      socket.emit('offloaded', error, null);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.webContents.send('deregister-client');

    ipcMain.removeAllListeners('client-registered');
    ipcMain.removeListener('job-results-received', jobResultsReceived);
  });

  try {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const containerRef = socket.handshake.query.containerRef;
    mainWindow.webContents.send('register-client', containerRef);
  } catch (error) {
    console.log(error);
  }
});

function showLoginWindow() {
  // window.loadURL('https://www.your-site.com/login')
  if (mainWindow) {
    shell.openExternal('localhost:1212/login');
    // mainWindow
    //   .loadFile('src/main/login.html') // For testing purposes only
    //   .then(() => {
    //     if (mainWindow) {
    //       mainWindow.show();
    //       console.log("mainwindowshowdone")
    //     }
    //   });
  }
}
ipcMain.handle('openLinkPlease', () => {
  shell.openExternal("http://localhost:3000/");
})

ipcMain.on('message:loginShow', (event) => {
  console.log("showLoginWindowpre")
  showLoginWindow();
  console.log("showLoginWindowpost")
});

ipcMain.on('electron-store-get', async (event, key) => {
  const encryptedKey = store.get(key);
  // help correct the line below
  const decryptedKey = safeStorage.decryptString(
    Buffer.from(encryptedKey, 'latin1')
  );
  event.returnValue = decryptedKey;
});

ipcMain.on('electron-store-set', async (event, key, val) => {
  const buffer = safeStorage.encryptString(val);
  store.set(key, buffer.toString('latin1'));
});

ipcMain.handle('publish-job', async (event, id, content) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send('publish-job', id, content);
  return 'published';
});

ipcMain.on('job-results-received', async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send('job-results-received', id, result);
});

ipcMain.on('job-received', async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send('job-received', id, result);
});

ipcMain.on('start-publisher', async (event, queueName, containerRef) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send('start-publisher', queueName, containerRef);
});

ipcMain.on('start-consumer', async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send('start-consumer', queueName);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions: string[] = [];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    const debug1 = performance.now() - start;
    console.log(`debug1 ${debug1} ms`);
    await installExtensions();
    const debug2 = performance.now() - start;
    console.log(`debug2 ${debug2} ms`);
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    icon: getAssetPath('logo-m.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
    },
  });
  console.log('mainWindow', mainWindow);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  workerWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  workerWindow.loadFile('src/worker_renderer/worker.html');

  mainWindow.once('focus', () => {
    const focusMs = performance.now() - start;
    console.log(`Window created in ${focusMs} ms`);
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const readyToShowMs = performance.now() - start;
    console.log(`Window ready to show in ${readyToShowMs} ms`);
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  // mainWindow.webContents.setWindowOpenHandler((edata) => {
  //   shell.openExternal(edata.url);
  //   return { action: 'deny' };
  // });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
// function showLoginWindow() {
//   // window.loadURL('https://www.your-site.com/login')
//   mainWindow.loadFile('login.html') // For testing purposes only
//       .then(() => { mainWindow.show(); })
// }

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    const appReadyMs = performance.now() - start;
    console.log(`App ready in ${appReadyMs} ms`);
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
