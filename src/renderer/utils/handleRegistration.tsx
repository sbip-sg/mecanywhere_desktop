import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import log from 'electron-log/renderer';
import actions from '../redux/actionCreators';
import { registerHost, deregisterHost } from '../services/RegistrationServices';
import reduxStore from '../redux/store';

export const handleRegisterHost = async () => {
  const credential = JSON.parse(window.electron.store.get('credential'));
  const did = window.electron.store.get('did');
  if (credential && did) {
    console.log('credential, did', credential, did);
    const response = await registerHost(did, credential);
    const { access_token } = response;
    console.log('access_token', access_token);
    actions.setAccessToken(access_token);
    const unpauseResponse = await unpauseExecutor();
    if (!unpauseResponse) {
      console.error('Unpause failed.');
    }
    if (response) {
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
  if (response && response.ok) {
    actions.setAccessToken('');
    window.electron.stopConsumer(did);
    log.info('successfully deregistered');
  } else {
    throw new Error('Deregistration failed');
  }
};
