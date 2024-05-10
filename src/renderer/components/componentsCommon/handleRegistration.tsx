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
  const publicKeyCompressed = window.electron.store.get('publicKeyCompressed');
  const publicKeyByteArray = splitHexByByteSize(publicKeyCompressed, 32).map(
    (byte) => `0x${byte}`
  );

  // TODO: check host registered and edit block timeout limit
  const response = await registerHost(
    publicKeyByteArray,
    blockTimeoutLimit,
    stake
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
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  if (await updateBlockTimeoutLimit(0)) {
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
