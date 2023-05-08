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
import { app, BrowserWindow, shell, ipcMain, safeStorage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const Store = require('electron-store');

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

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('electron-store-get', async (event, key) => {
  const encryptedKey = store.get(key);
  //help correct the line below
  const decryptedKey = safeStorage.decryptString(Buffer.from(encryptedKey, 'latin1'))
  console.log("decryptedPrivateKey", decryptedKey)
  event.returnValue = decryptedKey;
});

ipcMain.on('electron-store-set', async (event, key, val) => {
  console.log("key", key)
  console.log("val", val)
  const buffer = safeStorage.encryptString(val);
  console.log("encryptedPrivateKey", buffer)
  console.log("encryptedPrivateKey", buffer.toString('latin1'))
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

ipcMain.on('start-publisher', async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send('start-publisher', queueName);
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
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1366,
    height: 768,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  workerWindow.loadFile('src/worker_renderer/worker.html');

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

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
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
