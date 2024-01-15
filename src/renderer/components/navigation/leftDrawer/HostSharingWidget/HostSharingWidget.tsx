import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import {
  handleRegisterHost,
  handleDeregisterHost,
} from 'renderer/components/common/handleRegistration';
import {
  updateConfig,
  getResourceStats,
  unpauseExecutor,
  pauseExecutor,
} from 'renderer/services/ExecutorServices';
import Transitions from '../../../transitions/Transition';
import PreSharingEnabledComponent from './PreSharingEnabledComponent';
import PostSharingEnabledComponent from './PostSharingEnabledComponent';
import actions from '../../../../redux/actionCreators';
import ErrorDialog from '../../../common/ErrorDialogue';

const HostSharingWidget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
  }, []);

  const handleRetrieveDeviceStats = async () => {
    let success = false;
    const maxRetries = 10;
    const retryInterval = 500;

    for (let i = 0; i < maxRetries && !success; i++) {
      try {
        await unpauseExecutor();
        const resourceStats = await getResourceStats();
        console.log('resourceStats', resourceStats);
        const totalCpuCores = resourceStats.total_cpu;
        const totalMem = resourceStats.total_mem;
        const totalGpus = resourceStats.task_gpu;
        const gpuModel = resourceStats.gpu_model;
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
        console.error('Error retrieving device stats: ', error);
        if (i < maxRetries - 1) {
          console.log(`Retrying in ${retryInterval / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
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
    const configToUpdate = {
      timeout: 2,
      cpu: executorSettings.cpu_cores,
      mem: executorSettings.memory_mb,
      microVM_runtime: 'kata',
    };
    const containerName = 'meca_executor_test';
    try {
      // const containerExist = await window.electron.checkContainerExist(
      //   containerName
      // );

      // if (containerExist) {
      await updateConfig(configToUpdate);
      await handleRegisterHost(
        executorSettings.cpu_cores,
        executorSettings.memory_mb
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // for loading visualization
      setResourceSharingEnabled(true);
      // } else {
      //   return;
      // }
    } catch (error) {
      setErrorMessage("Container is not valid or doesn't exist");
      setErrorDialogOpen(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableResourceSharing = async () => {
    setIsLoading(true);
    await handleDeregisterHost();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // remove in production; solely for visualization of loading icon
    setResourceSharingEnabled(false);
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
          />
        ) : (
          <PostSharingEnabledComponent
            handleDisableResourceSharing={handleDisableResourceSharing}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
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
