import Channels from '../common/channels';
import { IpcMainEvent } from 'electron';

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

export const onClientRegistered =
  (socket) => async (event: IpcMainEvent, registered: boolean) => {
    console.log('Client registered: ', registered);
    socket.emit('registered', registered);
  };

export const onJobResultsReceived =
  (socket) =>
  async (
    event: IpcMainEvent,
    status: Number,
    response: String,
    error: String,
    taskId: String,
    transactionId: String
  ) => {
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
  };
