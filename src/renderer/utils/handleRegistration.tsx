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
  console.log("1")
  const { accessToken } = reduxStore.getState().userReducer;
  console.log("2")
  console.log("did", did, )
  console.log("accessToken", accessToken, )
  if (did && accessToken) {
    console.log("3")

    const response = await registerHost(accessToken, did);
    if (response) {
      console.log("41")
      const unpauseResponse = await unpauseExecutor();
      if (!unpauseResponse) {
        console.log("15")
        console.error('Unpause failed.');
      }
      console.log("14")
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
    // actions.setAccessToken('');
    window.electron.stopConsumer(did);
    log.info('successfully deregistered');
  } else {
    throw new Error('Deregistration failed');
  }
};
