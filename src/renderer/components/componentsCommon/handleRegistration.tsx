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

export const handleActivateHost = async (
  blockTimeoutLimit: number,
  addStake: number
) => {
  await initActor('host');
  await registerHostIfNotRegistered(blockTimeoutLimit, addStake);
  const unpauseResponse = await unpauseExecutor();
  if (!unpauseResponse) {
    console.error('Unpause failed.');
  }
};

export const registerHostIfNotRegistered = async (
  blockTimeoutLimit: number,
  addStake: number
) => {
  const stakeRes = await getHostInitialStake();
  if (!stakeRes || stakeRes === undefined) {
    throw new Error('Failed to get host initial stake');
  }
  const publicKey = window.electron.store.get('publicKey');
  const isRegisteredResponse = await isRegistered();
  if (!isRegisteredResponse) {
    const registrationSuccess = await registerHost(
      publicKey,
      blockTimeoutLimit,
      stakeRes + addStake
    );
    if (!registrationSuccess) {
      throw new Error('Host registration failed');
    }
  } else {
    await updateBlockTimeoutLimit(blockTimeoutLimit);
    await updatePublicKey(publicKey);
  }
};

export const handleDeactivateHost = async () => {
  const pauseResponse = await pauseExecutor();
  if (!pauseResponse) {
    console.error('Pause failed.');
  }
  if ((await updateBlockTimeoutLimit(0)) && (await closeActor())) {
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
