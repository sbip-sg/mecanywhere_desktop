import Channels from '../common/channels';

export const jobResultsReceived = async (mainWindow, event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RESULTS_RECEIVED, id, result);
};

export const jobReceived = async (mainWindow, event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RECEIVED, id, result);
};
