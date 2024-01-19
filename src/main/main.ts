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
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  safeStorage,
  IpcMainEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import { performance } from 'perf_hooks';
import log from 'electron-log/main';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import Channels from '../common/channels';
const fs = require('fs');
const os = require('os');
const Store = require('electron-store');
const io = require('socket.io')();
const Docker = require('dockerode');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

log.initialize({ preload: true });
// log.info('Log from the main process');

const start = performance.now();

const SDK_SOCKET_PORT = process.env.SDK_SOCKET_PORT || 3001;

const store = new Store();
const docker = new Docker();

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

  async function onClientRegistered(event: IpcMainEvent, registered: boolean) {
    console.log('Client registered: ', registered);
    socket.emit('registered', registered);
  }
  ipcMain.on(Channels.CLIENT_REGISTERED, onClientRegistered);

  async function onJobResultsReceived(
    event: IpcMainEvent,
    status: Number,
    response: String,
    error: String,
    taskId: String,
    transactionId: String
  ) {
    console.log(
      'Sending job results to client... ',
      status,
      response,
      error,
      taskId,
      transactionId
    );
    socket.emit(
      'job_results_received',
      status,
      response,
      error,
      taskId,
      transactionId
    );
  }
  ipcMain.on(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived);

  socket.on('offload', async (jobJson: string) => {
    console.log('Received job...', jobJson);
    try {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      mainWindow.webContents.send(Channels.OFFLOAD_JOB, jobJson);
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
    mainWindow.webContents.send(Channels.DEREGISTER_CLIENT);

    ipcMain.removeAllListeners(Channels.CLIENT_REGISTERED);
    ipcMain.removeListener(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived);
  });

  try {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.webContents.send(Channels.REGISTER_CLIENT);
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on(Channels.STORE_GET, async (event, key) => {
  try {
    const encryptedKey = store.get(key);
    if (encryptedKey !== undefined) {
      const decryptedKey = safeStorage.decryptString(
        Buffer.from(encryptedKey, 'latin1')
      );
      event.returnValue = decryptedKey;
    } else {
      event.returnValue = null;
    }
  } catch (error) {
    console.error('Error while getting value:', error);
    event.returnValue = null;
  }
});

ipcMain.on(Channels.STORE_SET, async (event, key, val) => {
  const buffer = safeStorage.encryptString(val);
  store.set(key, buffer.toString('latin1'));
});

ipcMain.on(Channels.REMOVE_EXECUTOR_CONTAINER, async (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error(err);
      event.reply(
        Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
        false,
        err.message
      );
      return;
    }

    const containerInfo = containers.find((c) =>
      c.Names.some((n) => n === `/${containerName}`)
    );

    if (containerInfo) {
      const container = docker.getContainer(containerInfo.Id);

      const removeContainer = () => {
        container.remove((err) => {
          if (err) {
            console.error(err);
            event.reply(
              Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
              false,
              err.message
            );
          } else {
            event.reply(Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE, true);
            console.log(`Container ${containerName} removed successfully.`);
          }
        });
      };

      // Check if the container is already stopped
      if (containerInfo.State === 'running') {
        container.stop((err) => {
          if (err) {
            console.error(err);
            event.reply(
              Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
              false,
              err.message
            );
            return;
          }
          removeContainer();
        });
      } else {
        removeContainer();
      }
    } else {
      console.log(`Container ${containerName} not found.`);
      event.reply(Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE, true);
    }
  });
});

ipcMain.on(Channels.RUN_EXECUTOR_CONTAINER, async (event, containerName) => {
  try {
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        console.error(err);
        return;
      }

      const existingContainer = containers.find((c) =>
        c.Names.includes('/' + containerName)
      );

      if (existingContainer) {
        // Container exists, start it if it's not running
        if (existingContainer.State !== 'running') {
          docker.getContainer(existingContainer.Id).start((err, data) => {
            if (err) {
              console.error(err);
            } else {
              log.info('Existing container started');
              event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
            }
          });
        } else {
          log.info('Container is already running');
          event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
        }
      } else {
        // Container does not exist, create and start it
        const containerOptions = {
          name: containerName,
          Image: 'meca-executor:latest',
          ExposedPorts: { '2591/tcp': {} },
          HostConfig: {
            Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
            PortBindings: { '2591/tcp': [{ HostPort: '2591' }] },
            NetworkMode: 'meca',
          },
          NetworkingConfig: {
            EndpointsConfig: {
              meca: {
                IPAMConfig: {
                  IPv4Address: process.env.IPV4_ADDRESS,
                },
              },
            },
          },
        };

        docker.createContainer(containerOptions, (err, container) => {
          if (err) {
            console.error(err);
            return;
          }

          container.start((err, data) => {
            if (err) {
              console.error(err);
            } else {
              log.info('New container started');
              event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
            }
          });
        });
      }
    });
  } catch (error) {
    event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, false, error.message);
  }
});

ipcMain.on(
  Channels.RUN_EXECUTOR_GPU_CONTAINER,
  async (event, containerName) => {
    try {
      // Configuration data
      const configData = `
type: "docker"
timeout: 1
cpu: 4
mem: 4096
has_gpu: true
`;

      // Create a temporary file and write configuration data
      const tempDir = os.tmpdir();
      const configFilePath = path.join(tempDir, 'meca_docker_gpu.yaml');
      fs.writeFileSync(configFilePath, configData);

      const containerOptions = {
        name: containerName,
        Image: 'meca-executor:latest',
        ExposedPorts: { '2591/tcp': {} },
        HostConfig: {
          Binds: [
            '/var/run/docker.sock:/var/run/docker.sock',
            `${configFilePath}:/app/meca_executor.yaml`,
          ],
          PortBindings: { '2591/tcp': [{ HostPort: '2591' }] },
          NetworkMode: 'meca',
          DeviceRequests: [
            {
              Driver: '',
              Count: -1, // -1 specifies "all GPUs"
              DeviceIDs: [],
              Capabilities: [['gpu']],
              Options: {},
            },
          ],
        },
        NetworkingConfig: {
          EndpointsConfig: {
            meca: {
              IPAMConfig: {
                IPv4Address: process.env.IPV4_ADDRESS,
              },
            },
          },
        },
      };
      docker.createContainer(containerOptions, (err, container) => {
        if (err) {
          console.error(err);
          return;
        }
        container.start((err, data) => {
          if (err) {
            event.reply(
              Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE,
              false,
              err.message
            );
            console.error(err);
          } else {
            log.info('New container started');
            event.reply(Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE, true);
          }
        });
      });
    } catch (error) {
      console.error(error);
      event.reply(
        Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE,
        false,
        error.message
      );
    }
  }
);

const checkIfContainerHasGpu = (containerId, callback) => {
  const container = docker.getContainer(containerId);
  container.inspect((err, data) => {
    if (err) {
      callback(err, false);
      return;
    }
    const hasGpu =
      data.HostConfig.DeviceRequests?.some((deviceRequest) =>
        deviceRequest.Capabilities?.some((capability) =>
          capability.includes('gpu')
        )
      ) || false;
    callback(null, hasGpu);
  });
};

ipcMain.on(Channels.CHECK_DOCKER_DAEMON_RUNNING, (event) => {
  docker.ping((err, data) => {
    if (err) {
      console.error('Docker daemon is not running', err);
      event.reply(
        Channels.CHECK_DOCKER_DAEMON_RUNNING_RESPONSE,
        false,
        err.message
      );
    } else {
      console.log('Docker daemon is running', data);
      event.reply(Channels.CHECK_DOCKER_DAEMON_RUNNING_RESPONSE, true, true);
    }
  });
});

ipcMain.on(Channels.CHECK_CONTAINER_EXIST, (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, false, err.message);
      return;
    }

    const containerExists = containers.some((container) =>
      container.Names.some((name) => name === `/${containerName}`)
    );

    event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, true, containerExists);
  });
});
// IPC listener to check for GPU support in a container
ipcMain.on(Channels.CHECK_CONTAINER_GPU_SUPPORT, (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(
        Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
        false,
        err.message
      );
      return;
    }

    const containerInfo = containers.find((c) =>
      c.Names.includes('/' + containerName)
    );

    if (containerInfo) {
      checkIfContainerHasGpu(containerInfo.Id, (error, hasGpu: boolean) => {
        if (error) {
          console.log('bb', hasGpu);

          console.error('Error inspecting container:', error);
          event.reply(
            Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
            false,
            error.message
          );
        } else {
          console.log('aa', hasGpu);
          event.reply(
            Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
            true,
            hasGpu
          );
        }
      });
    } else {
      console.log(`Container ${containerName} not found.`);
      event.reply(Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE, true, false);
    }
  });
});

ipcMain.on(Channels.JOB_RESULTS_RECEIVED, async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RESULTS_RECEIVED, id, result);
});

ipcMain.on(Channels.JOB_RECEIVED, async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RECEIVED, id, result);
});

ipcMain.on(Channels.START_CONSUMER, async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send(Channels.START_CONSUMER, queueName);
});

ipcMain.on(Channels.STOP_CONSUMER, async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send(Channels.STOP_CONSUMER, queueName);
});

ipcMain.on(Channels.APP_CLOSE_CONFIRMED, () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.destroy();
});

ipcMain.on(Channels.APP_RELOAD_CONFIRMED, () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.reload();
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
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

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

  workerWindow = new BrowserWindow({
    show: false,
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

  // before closing
  mainWindow.on('close', (e) => {
    log.info('app closing');
    e.preventDefault();
    mainWindow?.webContents.send('app-close-initiated');
  });

  // signify app successfully closed
  mainWindow.on('closed', () => {
    log.info('app successfully closed');
    mainWindow = null;
  });

  // intended for app reload, but not working currently
  mainWindow.webContents.on('will-navigate', (event) => {
    log.info('mainWindow did-start-navigation');
    event.preventDefault();
    mainWindow?.webContents.send('app-reload-initiated');
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  new AppUpdater();
};

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
