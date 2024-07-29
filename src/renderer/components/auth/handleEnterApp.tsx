import { getAccount } from 'renderer/services/PymecaService';
import { ImageName } from 'common/dockerNames';
import { initialTaskList } from 'renderer/redux/reducers';
import { getPublicKey } from '../../utils/cryptoUtils';
import actions from '../../redux/actionCreators';

const setStoreSettings = async () => {
  try {
    const privateKey = process.env.MECA_HOST_ENCRYPTION_PRIVATE_KEY || '';
    const publicKey = getPublicKey(privateKey);
    window.electron.store.set('publicKey', `0x${publicKey}`);
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
    window.electron.store.set('taskList', JSON.stringify(initialTaskList));
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

const fetchAccount = async () => {
  try {
    const account = await getAccount();
    actions.setAuthenticated(true);
    window.electron.store.set('did', account);
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetch account:', error.message);
      throw new Error(`There was a problem with the fetch account: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

const startDockerContainer = async (
  imageName: ImageName,
  containerName: string
) => {
  const dockerDaemonIsRunning =
    await window.electron.checkDockerDaemonRunning();
  if (!dockerDaemonIsRunning) {
    throw new Error('Docker daemon is not running');
  }
  const containerExist = await window.electron.checkContainerExist(containerName);
  if (containerExist) {
    const hasGpuSupport = await window.electron.checkContainerGpuSupport(
      containerName
    );
    if (hasGpuSupport) {
      await window.electron.removeDockerContainer(containerName);
    }
  }
  await window.electron.runDockerContainer(imageName, containerName);
};

export { setStoreSettings, fetchAccount, startDockerContainer };
