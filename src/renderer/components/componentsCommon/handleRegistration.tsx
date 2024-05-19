import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import {
  getHostInitialStake,
  isRegistered,
  registerHost,
  updateBlockTimeoutLimit,
  updatePublicKey,
} from 'renderer/services/HostContractService';
import log from 'electron-log/renderer';
import { closeActor, initActor } from 'renderer/services/PymecaService';

export const handleRegisterHost = async (
  blockTimeoutLimit: number,
  stake?: number
) => {
  if (!stake) {
    const stakeRes = await getHostInitialStake();
    if (!stakeRes || stakeRes === undefined) {
      throw new Error('Failed to get host initial stake');
    }
    stake = stakeRes;
  }

  const publicKey = window.electron.store.get('publicKey');
  await initActor("host");
  const isRegisteredResponse = await isRegistered();
  let registrationSuccess;
  if (!isRegisteredResponse) {
    registrationSuccess = await registerHost(
      publicKey,
      blockTimeoutLimit,
      stake
    );
  } else {
    registrationSuccess =
      (await updateBlockTimeoutLimit(blockTimeoutLimit)) &&
      (await updatePublicKey(publicKey));
  }
  if (registrationSuccess) {
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
  if ((await updateBlockTimeoutLimit(0)) && (await closeActor())) {
    const did = window.electron.store.get('did');
    window.electron.stopConsumer(did);
    log.info('successfully deregistered');
  } else {
    throw new Error('Deregistration failed');
  }
};

export const handleRegisterClient = async () => {
  const response = await initActor("user");
  if (!response) {
    throw new Error('Client registration failed');
  }
  log.info('successfully registered as client');
};

export const handleDeregisterClient = async () => {
  const response = await closeActor();
  if (response) {
    log.info('successfully deregistered as client');
  } else {
    throw new Error('Deregistration failed');
  }
};
