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
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';
import { resolveHtmlPath, getAssetPath } from './util';
import MenuBuilder from './menu';
import Channels from '../common/channels';
import fs from 'fs';
import {
  removeDockerContainer,
  runDockerContainer,
  runExecutorGPUContainer,
  checkDockerDaemonRunning,
  checkContainerExists,
  checkContainerGPUSupport,
  buildImage,
  stopDockerContainer,
} from './dockerIntegration';
import {
  equalsElectronStore,
  getElectronStore,
  setElectronStore,
} from './electronStore';
import { jobResultsReceived, jobReceived } from './jobs';

import {
  openFileDialog,
  openFolderDialog,
  uploadFileToIPFS,
  uploadFolderToIPFS,
  downloadFromIPFS,
  testGenerateLargeFile,
  readFirstLineOfFileInFolder,
  deleteFolder,
  checkFolderExists,
  catFile,
  statObject,
  getLocalFile,
} from  './ipfsIntegration'

const start = performance.now();

let mainWindow: BrowserWindow | null = null;
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

ipcMain.on(Channels.STORE_GET, getElectronStore);

ipcMain.on(Channels.STORE_SET, setElectronStore);

ipcMain.on(Channels.STORE_EQUALS, equalsElectronStore);

ipcMain.on(Channels.JOB_RESULTS_RECEIVED, (event, id, result) => {
  jobResultsReceived(mainWindow, event, id, result);
});

ipcMain.on(Channels.JOB_RECEIVED, (event, id, result) => {
  jobReceived(mainWindow, event, id, result);
});

ipcMain.on(Channels.APP_CLOSE_CONFIRMED, () => {
  if (mainWindow) mainWindow.destroy();
});

ipcMain.on(Channels.APP_RELOAD_CONFIRMED, () => {
  if (mainWindow) mainWindow.reload();
});

// docker integration
ipcMain.on(Channels.REMOVE_DOCKER_CONTAINER, removeDockerContainer);
ipcMain.on(Channels.RUN_DOCKER_CONTAINER, runDockerContainer);
ipcMain.on(Channels.RUN_EXECUTOR_GPU_CONTAINER, runExecutorGPUContainer);
ipcMain.on(Channels.CHECK_DOCKER_DAEMON_RUNNING, checkDockerDaemonRunning);
ipcMain.on(Channels.CHECK_CONTAINER_EXIST, checkContainerExists);
ipcMain.on(Channels.CHECK_CONTAINER_GPU_SUPPORT, checkContainerGPUSupport);
ipcMain.on(Channels.BUILD_IMAGE, buildImage);
ipcMain.on(Channels.STOP_DOCKER_CONTAINER, stopDockerContainer);

// ipfs integration
ipcMain.on(Channels.OPEN_FILE_DIALOG, openFileDialog);
ipcMain.on(Channels.OPEN_FOLDER_DIALOG, openFolderDialog);
ipcMain.handle(Channels.UPLOAD_FILE_TO_IPFS, uploadFileToIPFS);
ipcMain.handle(Channels.UPLOAD_FOLDER_TO_IPFS, uploadFolderToIPFS);
ipcMain.handle(Channels.DOWNLOAD_FROM_IPFS, downloadFromIPFS);
ipcMain.on(Channels.TEST_GENERATE_LARGE_FILE, testGenerateLargeFile);
ipcMain.handle(Channels.TEST_READ_FILE, readFirstLineOfFileInFolder);
ipcMain.handle(Channels.GET_LOCAL_FILE, getLocalFile);
ipcMain.handle(Channels.DELETE_FOLDER, deleteFolder);
ipcMain.handle(Channels.CHECK_FOLDER_EXISTS, checkFolderExists);
ipcMain.handle(Channels.IPFS_CAT, catFile);
ipcMain.handle(Channels.IPFS_STAT, statObject);

// edit env file
const updateEnvFile = (key: string, value: string) => {
  console.log("updateEnvFile is called")
  const envPath = path.join(__dirname, '../../.env')
  const envPymecaPath = path.join(__dirname, "../../.env.pymeca")
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  const envPymecaConfig = dotenv.parse(fs.readFileSync(envPymecaPath));

  console.log("current env config: ", envConfig)

  envConfig[key] = value;

  const updatedEnv = Object.keys(envConfig)
    .map(k => `${k}=${envConfig[k]}`)
    .join('\n');

  fs.writeFileSync(envPath, updatedEnv);
}

// IPC handler for updating .env files
ipcMain.handle('update-env', (event, key, value) => {
  try {
    updateEnvFile(key, value)
    return {success: true}
  } catch(error : any) {
    log.error('Failed to update .env file', error)
    return { success: false, error: error.message };
  }
})

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
    const appReadyTimeTaken = (performance.now() - start).toFixed(2);
    console.log(`App ready in ${appReadyTimeTaken} ms`);
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        createMainWindow();
      }
    });
  })
  .catch(console.log);
