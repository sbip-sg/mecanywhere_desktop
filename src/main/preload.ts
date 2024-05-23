// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import log from 'electron-log/preload';
import Channels from '../common/channels';
import { statObject } from './ipfsIntegration';

const subscribe = (channel: string, func: (...args: any[]) => void) => {
  const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
    func(...args);
  ipcRenderer.on(channel, subscription);
};

const electronHandler = {
  once: (channel, func) => ipcRenderer.once(channel, func),
  store: {
    get(key) {
      return ipcRenderer.sendSync(Channels.STORE_GET, key);
    },
    equals(key, val) {
      return ipcRenderer.sendSync(Channels.STORE_EQUALS, key, val);
    },
    set(property, val) {
      ipcRenderer.send(Channels.STORE_SET, property, val);
    },
  },

  openFileDialog: () => ipcRenderer.send(Channels.OPEN_FILE_DIALOG),
  openFolderDialog: () => ipcRenderer.send(Channels.OPEN_FOLDER_DIALOG),
  onFileSelected: (callback: (...args: any[]) => void) => ipcRenderer.on(Channels.SELECTED_FILE, callback),
  onFolderSelected: (callback: (...args: any[]) => void) => ipcRenderer.on(Channels.SELECTED_FOLDER, callback),
  uploadFileToIPFS: (filePath: string) => ipcRenderer.invoke(Channels.UPLOAD_FILE_TO_IPFS, filePath),
  uploadFolderToIPFS: (folderPath: string) => ipcRenderer.invoke(Channels.UPLOAD_FOLDER_TO_IPFS, folderPath),
  downloadFromIPFS: (cid: string) => ipcRenderer.invoke(Channels.DOWNLOAD_FROM_IPFS, cid),
  testReadFile: (cid: string) => ipcRenderer.invoke(Channels.TEST_READ_FILE, cid),
  getLocalFile: (cid: string, fileName: string) => ipcRenderer.invoke(Channels.GET_LOCAL_FILE, cid, fileName),
  deleteFolder: (cid: string) => ipcRenderer.invoke(Channels.DELETE_FOLDER, cid),
  checkFolderExists: (cid: string) => ipcRenderer.invoke(Channels.CHECK_FOLDER_EXISTS, cid),
  generateLargeFile: (sizeInMB: number) => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(Channels.TEST_GENERATE_LARGE_FILE, sizeInMB);
        ipcRenderer.once(Channels.TEST_GENERATE_LARGE_FILE_RESPONSE, (event, success, filePath, error) => {
            if (success) {
                resolve(filePath);
            } else {
                reject(new Error(error));
            }
        });
    });
  },
  catFile: (cid: string, fileName: string) => ipcRenderer.invoke(Channels.IPFS_CAT, cid, fileName),
  statObject: (cid: string) => ipcRenderer.invoke(Channels.IPFS_STAT, cid),

  checkDockerDaemonRunning: () => {
    return new Promise<boolean>((resolve, reject) => {
      ipcRenderer.send(Channels.CHECK_DOCKER_DAEMON_RUNNING);
      ipcRenderer.once(
        Channels.CHECK_DOCKER_DAEMON_RUNNING_RESPONSE,
        (event, success, error) => {
          if (success) {
            resolve(true);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  removeExecutorContainer: (containerName: string) => {
    return new Promise<void>((resolve, reject) => {
      ipcRenderer.send(Channels.REMOVE_EXECUTOR_CONTAINER, containerName);
      ipcRenderer.once(
        Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
        (event, success, error) => {
          if (success) {
            resolve();
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },

  runExecutorContainer: (containerName: string) => {
    return new Promise<void>((resolve, reject) => {
      ipcRenderer.send(Channels.RUN_EXECUTOR_CONTAINER, containerName);
      // Setup a one-time listener for the response
      ipcRenderer.once(
        Channels.RUN_EXECUTOR_CONTAINER_RESPONSE,
        (event, success, error) => {
          if (success) {
            resolve();
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },

  runExecutorGpuContainer: (containerName: string) => {
    return new Promise<void>((resolve, reject) => {
      ipcRenderer.send(Channels.RUN_EXECUTOR_GPU_CONTAINER, containerName);
      // Setup a one-time listener for the response
      ipcRenderer.once(
        Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE,
        (event, success, error) => {
          if (success) {
            resolve();
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },

  checkContainerExist: (containerName: string) => {
    return new Promise<boolean>((resolve, reject) => {
      ipcRenderer.send(Channels.CHECK_CONTAINER_EXIST, containerName);
      ipcRenderer.once(
        Channels.CHECK_CONTAINER_EXIST_RESPONSE,
        (event, success, containerExists) => {
          if (success) {
            resolve(containerExists);
          } else {
            reject(new Error('Failed to check container existence'));
          }
        }
      );
    });
  },

  checkContainerGpuSupport: (containerName: string) => {
    return new Promise<boolean>((resolve, reject) => {
      ipcRenderer.send(Channels.CHECK_CONTAINER_GPU_SUPPORT, containerName);
      ipcRenderer.once(
        Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
        (event, success, hasGpuSupport) => {
          if (success) {
            resolve(hasGpuSupport); // Assuming 'hasGpuSupport' is a boolean
          } else {
            reject(new Error('Failed to check GPU support'));
          }
        }
      );
    });
  },

  buildImage: (tag: string, dockerfilePath: string) => {
    return new Promise<boolean>((resolve, reject) => {
      ipcRenderer.send(Channels.BUILD_IMAGE, tag, dockerfilePath);
      ipcRenderer.once(
        Channels.BUILD_IMAGE_RESPONSE,
        (event, success, error) => {
          if (success) {
            resolve(true);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },

  onAppCloseInitiated: (callback: (...args: any[]) => void) => {
    subscribe(Channels.APP_CLOSE_INITIATED, callback);
  },
  confirmAppClose: () => {
    ipcRenderer.send(Channels.APP_CLOSE_CONFIRMED);
  },
  onAppReloadInitiated: (callback: (...args: any[]) => void) => {
    subscribe(Channels.APP_RELOAD_INITIATED, callback);
  },
  confirmAppReload: () => {
    ipcRenderer.send(Channels.APP_RELOAD_CONFIRMED);
  },

  onSubscribeJobs: (callback: (...args: any[]) => void) => {
    subscribe(Channels.JOB_RECEIVED, callback);
  },
  jobResultsReceived: (
    status: Number,
    response: String,
    error: String,
    taskId: String,
    transactionId: String
  ) =>
    ipcRenderer.send(
      Channels.JOB_RESULTS_RECEIVED,
      status,
      response,
      error,
      taskId,
      transactionId
    ),
  onSubscribeJobResults: (callback: (...args: any[]) => void) => {
    subscribe(Channels.JOB_RESULTS_RECEIVED, callback);
  },
  // to client
  onRegisterClient: (callback: (...args: any[]) => void) => {
    subscribe(Channels.REGISTER_CLIENT, callback);
  },
  onOffloadJob: (callback: (...args: any[]) => void) => {
    subscribe(Channels.OFFLOAD_JOB, callback);
  },
  onDeregisterClient: (callback: (...args: any[]) => void) => {
    subscribe(Channels.DEREGISTER_CLIENT, callback);
  },
  // from client
  clientRegistered: (status: boolean) =>
    ipcRenderer.send(Channels.CLIENT_REGISTERED, status),

  removeListener: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, func);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
