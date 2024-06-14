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
    try {
      await getHostInitialStake();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(`${error.message}`);
      } else {
        console.error('Unknown Error:', error);
        throw new Error('An unknown error occurred');
      }
    }
  }

  const publicKey = window.electron.store.get('publicKey');
  await initActor("host");

  try {
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
    } else {
      throw new Error('Host registration failed');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

export const handleDeregisterHost = async () => {
  try {
    await pauseExecutor();
    await updateBlockTimeoutLimit(0);
    await closeActor();
    log.info('successfully deregistered');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
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
