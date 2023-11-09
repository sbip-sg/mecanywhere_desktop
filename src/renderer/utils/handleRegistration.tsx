import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import log from 'electron-log/renderer';
import actions from '../redux/actionCreators';
import { registerHost, deregisterHost } from '../services/RegistrationServices';
import reduxStore from '../redux/store';

export const handleRegisterHost = async () => {
  const did = window.electron.store.get('did');
  const { accessToken } = reduxStore.getState().userReducer;
  if (did && accessToken) {
    const response = await registerHost(accessToken, did);
    if (response) {
      const unpauseResponse = await unpauseExecutor();
      if (!unpauseResponse) {
        console.error('Unpause failed.');
      }
      window.electron.startConsumer(did);
    } else {
      throw new Error('Host registration failed');
    }
  } else {
    throw new Error('Credential not found');
  }
};

export const handleDeregisterHost = async () => {
  const did = window.electron.store.get('did');
  const { accessToken } = reduxStore.getState().userReducer;
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  log.info('in deregister');
  const response = await deregisterHost(accessToken, did);
  if (response) {
    actions.setAccessToken('');
    window.electron.stopConsumer(did);
    log.info('successfully deregistered');
  } else {
    throw new Error('Deregistration failed');
  }
};
