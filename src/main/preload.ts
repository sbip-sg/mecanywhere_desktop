// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

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
  
  
  publishJob: (id: string, content: string) =>
    ipcRenderer.invoke('publish-job', id, content),
  onSubscribeJobResults: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('job-results-received', callback);
  },
  onSubscribeJobs: (callback: (...args: any[]) => void) => {
    ipcRenderer.on('job-received', callback);
  },
  startConsumer: (queueName: string) =>
    ipcRenderer.send('start-consumer', queueName),
  startPublisher: (queueName: string) =>
    ipcRenderer.send('start-publisher', queueName),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
