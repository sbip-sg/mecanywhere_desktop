import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import {
  handleActivateHost,
  handleDeactivateHost,
} from 'renderer/components/componentsCommon/handleRegistration';
import {
  updateConfig,
  getResourceStats,
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import { waitForTasks } from 'renderer/services/HostContractService';
import { ContainerName } from 'common/dockerNames';
import reduxStore from 'renderer/redux/store';
import Transitions from '../../../utils/Transition';
import PreSharingEnabledComponent from './HostSharingWidgetComponent/PreSharingEnabledComponent';
import PostSharingEnabledComponent from './HostSharingWidgetComponent/PostSharingEnabledComponent';
import actions from '../../../redux/actionCreators';
import ErrorDialog from '../../componentsCommon/ErrorDialogue';

const HostSharingWidget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deviceHasGpu, setDeviceHasGpu] = useState(false);
  const [initialResourcesLog, setInitialResourcesLog] = useState({
    total_cpu: 0,
    total_mem: 0,
    used_cpu: 0,
    used_mem: 0,
    task_cpu: 0,
    task_mem: 0,
    task_used_cpu: 0,
    task_used_mem: 0,
    gpu_model: '',
    task_gpu: 0,
    task_used_gpu: 0,
  });
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  let initialExecutorSettings = {
    option: 'low',
    cpu_cores: 1,
    memory_mb: 2048,
    gpus: 0,
  };
  const initialIsExecutorSettingsSaved =
    window.electron.store.get('isExecutorSettingsSaved') === 'true';
  if (window.electron.store.get('isExecutorSettingsSaved') === null) {
    window.electron.store.set('isExecutorSettingsSaved', 'true');
  }
  if (window.electron.store.get('executorSettings') === null) {
    window.electron.store.set('executorSettings', initialExecutorSettings);
  }
  if (window.electron.store.get('isExecutorSettingsSaved') === 'true') {
    initialExecutorSettings = JSON.parse(
      window.electron.store.get('executorSettings')
    );
  }

  useEffect(() => {
    setIsLoading(true);
    handleRetrieveDeviceStats();
  }, [deviceHasGpu]);

  const handleRetrieveDeviceStats = async () => {
    let success = false;
    const maxRetries = 10;
    const retryInterval = 500;

    for (let i = 0; i < maxRetries && !success; i++) {
      try {
        await unpauseExecutor();
        const resourceStats = await getResourceStats();
        const totalCpuCores = resourceStats.total_cpu;
        const totalMem = resourceStats.total_mem;
        const totalGpus = resourceStats.task_gpu;
        const gpuModel = resourceStats.gpu_model;
        console.log('gpuModel', gpuModel);
        actions.setDeviceStats({
          totalCpuCores,
          totalMem,
          totalGpus,
          gpuModel,
        });
        await pauseExecutor();
        success = true;
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(`Error retrieving device stats: ${error}`);
        setErrorDialogOpen(true);
        if (i < maxRetries - 1) {
          console.log(`Retrying in ${retryInterval / 1000} seconds...`);
          await new Promise((resolve) => {
            setTimeout(resolve, retryInterval);
          });
        }
      }
    }
    if (!success) {
      console.error('Failed to retrieve device stats after several retries.');
      setIsLoading(false);
    }
  };

  const [isExecutorSettingsSaved, setIsExecutorSettingsSaved] = useState(
    initialIsExecutorSettingsSaved
  );

  const [executorSettings, setExecutorSettings] = useState(
    initialExecutorSettings
  );

  const [resourceSharingEnabled, setResourceSharingEnabled] =
    useState<Boolean>(false);

  const handleEnableResourceSharing = async () => {
    setIsLoading(true);
    const containerName = ContainerName.MECA_EXECUTOR_1;
    try {
      const containerExist = await window.electron.checkContainerExist(
        containerName
      );
      if (containerExist) {
        const hasGpuSupport = await window.electron.checkContainerGpuSupport(
          containerName
        );
        if (hasGpuSupport && !deviceHasGpu) {
          setErrorMessage(
            'Failed to start the container: GPU not detected or unavailable.'
          );
          setErrorDialogOpen(true);
        } else {
          await updateConfig({
            cpu: executorSettings.cpu_cores,
            mem: executorSettings.memory_mb,
          });
          await handleActivateHost(100, 0);
          const towerAddresses =
            reduxStore.getState().towerListReducer.registered;
          const hostEncryptionPrivateKey =
            window.electron.store.get('privateKey');
          await waitForTasks(towerAddresses, hostEncryptionPrivateKey, 10, {
            cpu: executorSettings.cpu_cores,
            mem: executorSettings.memory_mb,
            gpu: executorSettings.gpus,
          });
          const initialResources = await getResourceStats();
          setInitialResourcesLog(initialResources);
          setResourceSharingEnabled(true);
        }
      }
    } catch (error) {
      setErrorMessage(`${error}`);
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableResourceSharing = async () => {
    setIsLoading(true);
    try {
      await handleDeactivateHost();
      setResourceSharingEnabled(false);
    } catch (error) {
      setErrorMessage(`${error}`);
      setErrorDialogOpen(true);
    }
    setIsLoading(false);
  };

  const BlurredBackground = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backdropFilter: 'blur(5px)',
    zIndex: -1,
  });

  return (
    <Box
      id="transition-widget-wrapper"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      {isLoading && (
        <>
          <BlurredBackground />
          <Transitions duration={1}>
            <CircularProgress
              style={{
                color: 'secondary.main',
                position: 'absolute',
                width: '2.5rem',
                height: '2.5rem',
                left: '50%',
                top: '50%',
                translate: '-1.25rem -1.25rem',
              }}
            />
          </Transitions>
        </>
      )}
      <Box
        id="widget-wrapper"
        sx={{
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0.2 : 1,
          transition: 'opacity 0.5s ease',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!resourceSharingEnabled ? (
          <PreSharingEnabledComponent
            handleEnableResourceSharing={handleEnableResourceSharing}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isExecutorSettingsSaved={isExecutorSettingsSaved}
            setIsExecutorSettingsSaved={setIsExecutorSettingsSaved}
            executorSettings={executorSettings}
            setExecutorSettings={setExecutorSettings}
            setDeviceHasGpu={setDeviceHasGpu}
          />
        ) : (
          <PostSharingEnabledComponent
            handleDisableResourceSharing={handleDisableResourceSharing}
            isLoading={isLoading}
            initialResourcesLog={initialResourcesLog}
          />
        )}
      </Box>
      <ErrorDialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default HostSharingWidget;
