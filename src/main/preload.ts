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
  openLinkPlease: () => ipcRenderer.invoke('openLinkPlease'),
  //   })
  // });
  openWindow: () => {
    ipcRenderer.send('message:loginShow');
  },
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },

  // A method to send 'app-close-confirmed' from renderer to main process.
  confirmAppClose: () => {
    ipcRenderer.send('app-close-confirmed');
  },

  // A method to subscribe to 'app-close-initiated' from main process in renderer process.
  onAppCloseInitiated: (callback: (...args: any[]) => void) => {
    subscribe('app-close-initiated', callback);
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
