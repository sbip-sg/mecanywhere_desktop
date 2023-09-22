// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// export type Channels = 'ipc-example';

const subscribe = (channel: string, func: (...args: any[]) => void) => {
  const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
    func(...args);
  ipcRenderer.on(channel, subscription);
};

const electronHandler = {
  // ipcRenderer: {
  //   sendMessage(channel: Channels, args: unknown[]) {
  //     ipcRenderer.send(channel, args);
  //   },
  //   on(channel: Channels, func: (...args: unknown[]) => void) {
  //     const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
  //       func(...args);
  //     ipcRenderer.on(channel, subscription);

  //     return () => {
  //       ipcRenderer.removeListener(channel, subscription);
  //     };
  //   },
  //   once(channel: Channels, func: (...args: unknown[]) => void) {
  //     ipcRenderer.once(channel, (_event, ...args) => func(...args));
  //   },
  // },
  // process.once("loaded", () => {
  //   contextBridge.exposeInMainWorld('electronAPI', {
  openLinkPlease: () => ipcRenderer.invoke('openLinkPlease'),
  //   })
  // });
  openWindow: () => {
      ipcRenderer.send('message:loginShow');
    },
    // Other method you want to add like has(), reset(), etc.
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },

  // TODO: extract channel names

  // from host
  startConsumer: (queueName: string) =>
    ipcRenderer.send('start-consumer', queueName),
  // to host
  stopConsumer: (queueName: string) =>
    ipcRenderer.send('stop-consumer', queueName),
  onSubscribeJobs: (callback: (...args: any[]) => void) => {
    subscribe('job-received', callback);
  },
  onSubscribeJobResults: (callback: (...args: any[]) => void) => {
    subscribe('job-results-received', callback);
  },

  removeListener: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, func);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
