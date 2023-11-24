// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import log from 'electron-log/main';
import Channels from '../common/channels';

const subscribe = (channel: string, func: (...args: any[]) => void) => {
  const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
    func(...args);
  ipcRenderer.on(channel, subscription);
};

const electronHandler = {
  openLinkPlease: () => ipcRenderer.invoke(Channels.OPEN_LINK_PLEASE),
  openWindow: () => {
    ipcRenderer.send(Channels.OPEN_WINDOW);
  },
  store: {
    get(key) {
      return ipcRenderer.sendSync(Channels.STORE_GET, key);
    },
    set(property, val) {
      ipcRenderer.send(Channels.STORE_SET, property, val);
    },
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

  // from host
  startConsumer: (queueName: string) =>
    ipcRenderer.send(Channels.START_CONSUMER, queueName),
  // to host
  stopConsumer: (queueName: string) =>
    ipcRenderer.send(Channels.STOP_CONSUMER, queueName),
  onSubscribeJobs: (callback: (...args: any[]) => void) => {
    subscribe(Channels.JOB_RECEIVED, callback);
  },
  onSubscribeJobResults: (callback: (...args: any[]) => void) => {
    subscribe(Channels.JOB_RESULTS_RECEIVED, callback);
  },

  removeListener: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, func);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
