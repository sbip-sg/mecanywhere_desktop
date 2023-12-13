import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Checkbox from '@mui/material/Checkbox';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import CoreSelectorWidget from './CoreSelectorWidget';
import MemorySelectorSlider from './MemorySelectorSlider';
import PresetSelectorWidget from './PresetSelectorWidget';

const PreSharingEnabledComponent = ({
  handleEnableResourceSharing,
  isLoading,
  isExecutorSettingsSaved,
  setIsExecutorSettingsSaved,
  executorSettings,
  setExecutorSettings,
}) => {
  const handleCheckboxChange = (event) => {
    setIsExecutorSettingsSaved(event.target.checked);
    window.electron.store.set(
      'isExecutorSettingsSaved',
      event.target.checked.toString()
    );
  };
  const isLightTheme = useIsLightTheme();
  useEffect(() => {
    if (window.electron.store.get('isExecutorSettingsSaved') === 'true') {
      window.electron.store.set(
        'executorSettings',
        JSON.stringify(executorSettings)
      );
    }
  }, [executorSettings]);

  return (
    <Stack width="100%">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 0 0 1.5rem',
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
          style={{
            height: executorSettings.option === 'custom' ? '50%' : '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            overflowY: 'hidden',
          }}
          initial={{ height: '0' }}
          animate={{
            height: executorSettings.option === 'custom' ? '50%' : '0',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Grid
            container
            item
            sx={{
              height: '100%',
              width: '100%',
              padding: '0rem 1.5rem 0rem 1.5rem',
              overflow: 'hidden',
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
          </Grid>
        </motion.div>
      </AnimatePresence>
      <Box
        sx={{
          padding: '1rem 1rem 0 1.5rem',
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          fontWeight="600"
          variant="body1"
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
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem 1.5rem 2rem 1.5rem',
        }}
      >
        <Button
          onClick={handleEnableResourceSharing}
          sx={{
            width: '100%',
            padding: '0.6rem',
            color: isLoading ? 'primary.main' : 'background.paper',
            backgroundColor: isLoading ? 'background.paper' : 'primary.main',
          }}
        >
          <Typography
            sx={{
              fontSize: '15px',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Enable Resource&nbsp;Sharing
          </Typography>
        </Button>
      </Box>
    </Stack>
  );
};

export default PreSharingEnabledComponent;
