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
import { splitHexByByteSize } from 'renderer/utils/cryptoUtils';
import reduxStore from '../../redux/store';

export const handleRegisterHost = async () => {
  const paymentProvider = reduxStore.getState().paymentProviderReducer.sdkProvider;
  if (!paymentProvider || !reduxStore.getState().paymentProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }

  const account = await getAccountFromProvider();
  const publicKeyCompressed = window.electron.store.get('publicKeyCompressed');
  const publicKeyByteArray = splitHexByByteSize(publicKeyCompressed, 32).map(
    (byte) => `0x${byte}`
  );

  const response = await registerHost(
    publicKeyByteArray,
    1,
    0.01,
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
  if (!paymentProvider || reduxStore.getState().paymentProviderReducer.connected) {
    throw new Error('Payment provider not connected');
  }
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  const account = await getAccountFromProvider();
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

async function getAccountFromProvider() {
  if (!window.ethereum) {
    throw new Error('No payment provider found');
  }
  let accounts;
  try {
    accounts = await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  } catch (error) {
    console.error('Error getting account', error);
  }
  if (!accounts) {
    throw new Error('No payment account found');
  }
  const account = accounts[0] as string;
  return account;
}
