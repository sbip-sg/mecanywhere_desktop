import { Box } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import {
  handleRegisterHost,
  handleDeregisterHost,
} from 'renderer/components/common/handleRegistration';
import { updateConfig } from 'renderer/services/ExecutorServices';
import Transitions from '../../../transitions/Transition';
import PreSharingEnabledComponent from './PreSharingEnabledComponent';
import PostSharingEnabledComponent from './PostSharingEnabledComponent';

const HostSharingWidget = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  let initialExecutorSettings = {
    option: 'low',
    cpu_cores: 1,
    memory_mb: 2048,
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
    const updateConfigResponse = await updateConfig(configToUpdate);
    await handleRegisterHost();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // remove in production; solely for visualization of loading icon
    setResourceSharingEnabled(true);
    setIsLoading(false);
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
        // padding: "1.2rem 1.2rem 1.2rem 1.2rem"
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
    </Box>
  );
};

export default HostSharingWidget;
