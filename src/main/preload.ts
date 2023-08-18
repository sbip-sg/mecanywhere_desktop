// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  openLinkPlease: () => ipcRenderer.invoke('openLinkPlease'),
  //   })
  // });
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  // from client
  publishJob: (id: string, content: string) =>
    ipcRenderer.invoke('publish-job', id, content),
  startPublisher: (queueName: string) =>
    ipcRenderer.send('start-publisher', queueName),
  clientRegistered: () => ipcRenderer.send('client-registered'),
  // to client
  onRegisterClient: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('register-client', callback);
  },
  onOffloadJob: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('offload-job', callback);
  },
  onDeregisterClient: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('deregister-client', callback);
  },
  // from host
  startConsumer: (queueName: string) =>
    ipcRenderer.send('start-consumer', queueName),
  // to host
  onSubscribeJobs: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('job-received', callback);
  },
  // to client and host
  onSubscribeJobResults: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('job-results-received', callback);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
