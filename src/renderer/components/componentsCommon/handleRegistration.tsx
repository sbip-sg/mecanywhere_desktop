import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import {
  registerHost,
  deregisterHost,
  updateBlockTimeoutLimit,
} from 'renderer/services/HostContractService';
import {
  registerClient,
  deregisterClient,
} from 'renderer/services/RegistrationServices';
import log from 'electron-log/renderer';
import { splitHexByByteSize } from 'renderer/utils/cryptoUtils';
import reduxStore from '../../redux/store';

export const handleRegisterHost = async (blockTimeoutLimit: number, stake: number) => {
  const paymentProvider = reduxStore.getState().paymentProviderReducer.sdkProvider;
  if (!paymentProvider || !reduxStore.getState().paymentProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }

  const account = reduxStore.getState().paymentProviderReducer.accounts[0];
  const publicKeyCompressed = window.electron.store.get('publicKeyCompressed');
  const publicKeyByteArray = splitHexByByteSize(publicKeyCompressed, 32).map(
    (byte) => `0x${byte}`
  );

  const response = await registerHost(
    publicKeyByteArray,
    blockTimeoutLimit,
    stake,
    paymentProvider,
    account
  );
  if (response) {
    const unpauseResponse = await unpauseExecutor();
    if (!unpauseResponse) {
      console.error('Unpause failed.');
    }
    const did = window.electron.store.get('did');
    window.electron.startConsumer(did);
  } else {
    throw new Error('Host registration failed');
  }
};

export const handleDeregisterHost = async () => {
  const paymentProvider = reduxStore.getState().paymentProviderReducer.sdkProvider;
  if (!paymentProvider || !reduxStore.getState().paymentProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  const account = reduxStore.getState().paymentProviderReducer.accounts[0];
  await updateBlockTimeoutLimit(0, paymentProvider, account);
  const response = await deregisterHost(paymentProvider, account, account);
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
    log.info('successfully deregistered as client');
  } else {
    throw new Error('Deregistration failed');
  }
};
