import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Checkbox from '@mui/material/Checkbox';
import CoreSelectorWidget from './CoreSelectorWidget';
import MemorySelectorSlider from './MemorySelectorSlider';
import GpuSelectorWidget from './GpuSelectorWidget';
import PresetSelectorWidget from './PresetSelectorWidget';

const PreSharingEnabledComponent = ({
  handleEnableResourceSharing,
  isLoading,
  setIsLoading,
  isExecutorSettingsSaved,
  setIsExecutorSettingsSaved,
  executorSettings,
  setExecutorSettings,
  setDeviceHasGpu,
}) => {
  const [allocateGPU, setAllocateGPU] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsExecutorSettingsSaved(event.target.checked);
    window.electron.store.set(
      'isExecutorSettingsSaved',
      event.target.checked.toString()
    );
  };

  const handleGPUCheckBoxChange = async (event) => {
    setIsLoading(true);
    await window.electron.removeExecutorContainer('meca_executor_test');
    if (!allocateGPU) {
      try {
        await window.electron.runExecutorGpuContainer('meca_executor_test');
        setDeviceHasGpu(true);
      } catch (error) {
        setDeviceHasGpu(false);
        console.error('Error starting GPU container:', error);
      }
      setAllocateGPU(true);
    } else {
      try {
        await window.electron.runExecutorContainer('meca_executor_test');
      } catch (error) {
        console.error('Error starting container:', error);
      }
      setAllocateGPU(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (window.electron.store.get('isExecutorSettingsSaved') === 'true') {
      window.electron.store.set(
        'executorSettings',
        JSON.stringify(executorSettings)
      );
    }
  }, [executorSettings]);

  return (
    <Stack width="85%">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 0 0 0',
        }}
      >
        <ErrorOutlineIcon sx={{ color: 'primary.main' }} />
        <Typography
          width="80%"
          variant="body2"
          textAlign="start"
          padding="0rem 0rem 0rem 1rem"
          sx={{
            color: 'primary.main',
            fontWeight: '600',
          }}
        >
          You are currently have resource sharing disabled.
        </Typography>
      </Box>
      <PresetSelectorWidget
        executorSettings={executorSettings}
        setExecutorSettings={setExecutorSettings}
      />
      <AnimatePresence mode="wait">
        <motion.div
          animate={{
            height: executorSettings.option === 'custom' ? '100%' : '0',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Stack
            className="resource-allocator"
            sx={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <CoreSelectorWidget
              executorSettings={executorSettings}
              setExecutorSettings={setExecutorSettings}
            />
            <MemorySelectorSlider
              executorSettings={executorSettings}
              setExecutorSettings={setExecutorSettings}
            />
          </Stack>
        </motion.div>
      </AnimatePresence>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '1.5rem 0 0 0',
        }}
      >
        <Typography
          fontWeight="600"
          variant="body1"
          textAlign="start"
          color="text.primary"
        >
          Allocate GPU
        </Typography>
        <Checkbox
          checked={allocateGPU}
          onChange={handleGPUCheckBoxChange}
          size="small"
          sx={{
            color: 'text.primary',
            padding: '0.2rem 0',
          }}
        />
      </Box>
      <AnimatePresence mode="wait">
        <motion.div
          animate={{
            height: allocateGPU ? '100%' : '0',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <GpuSelectorWidget
            executorSettings={executorSettings}
            setExecutorSettings={setExecutorSettings}
          />
        </motion.div>
      </AnimatePresence>
      <Box
        sx={{
          padding: '1.5rem 0 0.5rem 0',
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          fontWeight="600"
          textAlign="start"
          color="text.primary"
        >
          Remember configuration
        </Typography>
        <Checkbox
          checked={isExecutorSettingsSaved}
          onChange={handleCheckboxChange}
          size="small"
          sx={{
            color: 'text.primary',
            padding: '0.2rem 0',
          }}
        />
      </Box>
      <Button
        onClick={handleEnableResourceSharing}
        sx={{
          margin: '1.5rem 0',
          padding: '0.5rem',
          color: isLoading ? 'primary.main' : 'background.paper',
          backgroundColor: isLoading ? 'background.paper' : 'primary.main',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          Enable Resource&nbsp;Sharing
        </Typography>
      </Button>
    </Stack>
  );
};

export default PreSharingEnabledComponent;
