import { getAccount } from 'renderer/services/PymecaService';
import {
  generateMnemonicAndKeyPair,
  utf8ToHex,
} from '../../utils/cryptoUtils';
import actions from '../../redux/actionCreators';

const setStoreSettings = async () => {
  try {
    const MnemonicAndKeyPair = await generateMnemonicAndKeyPair();

    if (typeof MnemonicAndKeyPair === 'undefined') {
      throw new Error('Key pair generation failed.');
    }

    if (MnemonicAndKeyPair) {
      const { mnemonic, publicKey, privateKey, publicKeyCompressed } =
        MnemonicAndKeyPair;

      window.electron.store.set('mnemonic', mnemonic); // need to save mnemonic?
      window.electron.store.set(
        'publicKeyCompressed',
        utf8ToHex(publicKeyCompressed)
      );
      window.electron.store.set('publicKey', `0x${utf8ToHex(publicKey)}`);
      window.electron.store.set('privateKey', `0x${utf8ToHex(privateKey)}`);
      window.electron.store.set('isExecutorSettingsSaved', 'true');
      window.electron.store.set(
        'executorSettings',
        JSON.stringify({
          option: 'low',
          cpu_cores: 1,
          memory_mb: 2048,
          gpus: 0,
        })
      );
      window.electron.store.set(
        'taskList',
        JSON.stringify({
          downloaded: [],
          built: [],
          tested: [],
          activated: [],
        })
      );
    }
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

const fetchAccount = async () => {
  const account = await getAccount();
  actions.setAuthenticated(true);
  window.electron.store.set('did', account);
};

const startExecutor = async (containerName: string) => {
  const dockerDaemonIsRunning =
    await window.electron.checkDockerDaemonRunning();
  if (!dockerDaemonIsRunning) {
    throw new Error('Docker daemon is not running');
  }
  const containerExist = await window.electron.checkContainerExist(
    containerName
  );
  if (containerExist) {
    const hasGpuSupport = await window.electron.checkContainerGpuSupport(
      containerName
    );
    if (hasGpuSupport) {
      await window.electron.removeExecutorContainer(containerName);
    }
  }
  await window.electron.runExecutorContainer(containerName);
};

export { setStoreSettings, fetchAccount, startExecutor };
