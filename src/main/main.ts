/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
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
import {
  equalsElectronStore,
  getElectronStore,
  setElectronStore,
} from './electronStore';
import {
  jobResultsReceived,
  jobReceived,
  startConsumer,
  stopConsumer,
  onClientRegistered,
  onJobResultsReceived,
} from './jobs';

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

ipcMain.on(Channels.STORE_EQUALS, equalsElectronStore);

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

app
  .whenReady()
  .then(() => {
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
