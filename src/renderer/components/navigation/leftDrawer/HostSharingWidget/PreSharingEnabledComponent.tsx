import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Checkbox from '@mui/material/Checkbox';
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
  const theme = useTheme();
 
  const handleCheckboxChange = (event) => {
    setIsExecutorSettingsSaved(event.target.checked);
    window.electron.store.set(
      'isExecutorSettingsSaved',
      event.target.checked.toString()
    );
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
    <Stack width="100%">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 0 0 1.5rem',
          color: theme.palette.cerulean.main,
        }}
      >
        <ErrorOutlineIcon />
        <Typography
          width="80%"
          variant="body2"
          fontSize="14px"
          textAlign="start"
          padding="0rem 0rem 0rem 1rem"
          style={{ color: theme.palette.cerulean.main, fontWeight: '600' }}
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
          // width: "80%",
          padding: '1rem 1rem 0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          // width="80%"
          variant="body2"
          fontSize="16px"
          textAlign="start"
          color={theme.palette.cerulean.main}
          // padding="3rem 1.5rem 1rem 1.5rem"
        >
          Remember configuration
        </Typography>
        <Checkbox
          checked={isExecutorSettingsSaved}
          onChange={handleCheckboxChange}
          style={{ color: theme.palette.offWhite.main }}
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
            color: isLoading
              ? theme.palette.cerulean.main
              : theme.palette.darkBlack.main,
            backgroundColor: isLoading
              ? theme.palette.darkBlack.main
              : theme.palette.mintGreen.main,
          }}
        >
          <Typography variant="h3" fontSize="15px" textAlign="center">
            Enable Resource&nbsp;Sharing
          </Typography>
        </Button>
      </Box>
    </Stack>
  );
};

export default PreSharingEnabledComponent;
