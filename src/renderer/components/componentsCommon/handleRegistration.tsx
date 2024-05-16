import {
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import {
  isRegistered,
  registerHost,
  updateBlockTimeoutLimit,
} from 'renderer/services/HostContractService';
import log from 'electron-log/renderer';
import { splitHexByByteSize } from 'renderer/utils/cryptoUtils';
import { closeActor, initActor } from 'renderer/services/PymecaService';

export const handleRegisterHost = async (blockTimeoutLimit: number, stake: number) => {
  const publicKeyCompressed = window.electron.store.get('publicKeyCompressed');
  const publicKeyByteArray = splitHexByByteSize(publicKeyCompressed, 32).map(
    (byte) => `0x${byte}`
  );

  await initActor("host");
  const isRegisteredResponse = await isRegistered();
  console.log(isRegisteredResponse)
  let registrationSuccess;
  if (!isRegisteredResponse) {
    registrationSuccess = await registerHost(
      publicKeyByteArray,
      blockTimeoutLimit,
      stake
    );
  } else {
    registrationSuccess = updateBlockTimeoutLimit(blockTimeoutLimit);
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
