import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import {
  registerHost,
  deregisterHost,
} from 'renderer/services/HostContractService';
import {
  registerClient,
  deregisterClient,
} from 'renderer/services/RegistrationServices';
import log from 'electron-log/renderer';
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
    const response = await registerHost(
      publicKey,
      1,
      1,
      1,
      paymentProvider,
      did
    );
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
  const did = window.electron.store.get('did');
  const response = await deregisterHost(paymentProvider, did, did);
  if (response) {
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
