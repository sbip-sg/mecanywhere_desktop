import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import log from 'electron-log/renderer';
import {
  registerHost,
  deregisterHost,
  registerClient,
  deregisterClient,
} from '../../services/RegistrationServices';
import reduxStore from '../../redux/store';

export const handleRegisterHost = async () => {
  const paymentProvider = reduxStore.getState().SDKProviderReducer.sdkProvider;
  if (!paymentProvider || reduxStore.getState().SDKProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }
  const did = window.electron.store.get('did');
  const { accessToken } = reduxStore.getState().userReducer;
  const publicKey = window.electron.store.get('publicKey');
  if (did && accessToken) {
    const response = await registerHost(publicKey, 1, 1, paymentProvider);
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
  const paymentProvider = reduxStore.getState().SDKProviderReducer.sdkProvider;
  if (!paymentProvider || reduxStore.getState().SDKProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  log.info('in deregister');
  const response = await deregisterHost(paymentProvider);
  if (response) {
    const did = window.electron.store.get('did');
    window.electron.stopConsumer(did);
    log.info('successfully deregistered');
  } else {
    throw new Error('Deregistration failed');
  }
};

export const handleRegisterClient = async () => {
  const did = window.electron.store.get('did');
  const { accessToken } = reduxStore.getState().userReducer;
  if (did && accessToken) {
    const response = await registerClient(accessToken, did);
    if (!response) {
      throw new Error('Client registration failed');
    }
    log.info('successfully registered as client');
  } else {
    throw new Error('Credential not found');
  }
};

export const handleDeregisterClient = async () => {
  const did = window.electron.store.get('did');
  const { accessToken } = reduxStore.getState().userReducer;
  const response = await deregisterClient(accessToken, did);
  if (response) {
    // actions.setAccessToken('');
    log.info('successfully deregistered as client');
  } else {
    throw new Error('Deregistration failed');
  }
};
