import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import {
  handleRegisterHost,
  handleDeregisterHost,
} from 'renderer/utils/handleRegistration';
import Transitions from '../../transitions/Transition';

const HostSharingWidget = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [cpuUtilization, setCpuUtilization] = useState<string>('71%');
  const [gpuUtilization, setGpuUtilization] = useState<string>('31%');

  const [resourceSharingEnabled, setResourceSharingEnabled] =
    useState<Boolean>(false);
  const handleEnableResourceSharing = async () => {
    setIsLoading(true);
    console.log('handleEnableResourceSharing');
    await handleRegisterHost();
    // Wrap the setTimeout in a Promise to use await
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResourceSharingEnabled(true);
    setIsLoading(false);
  };
  const handleDisableResourceSharing = async () => {
    setIsLoading(true);
    await handleDeregisterHost();

    console.log('handleDisableResourceSharing');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setResourceSharingEnabled(false);
    setIsLoading(false);
  };
  const BlurredBackground = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backdropFilter: 'blur(5px)', // You can adjust the blur amount as needed
    zIndex: -1,
  });

  const getRandomCpuUtilization = () => {
    return (60 + Math.random() * 2).toFixed(1);
  };

  const getRandomGpuUtilization = () => {
    return (30 + Math.random() * 3).toFixed(1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newCpuUtilization = `${getRandomCpuUtilization()}%`;
      setCpuUtilization(newCpuUtilization);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newGpuUtilization = `${getRandomGpuUtilization()}%`;
      setGpuUtilization(newGpuUtilization);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: '13rem',
        width: '100%',
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {isLoading && (
        <>
          <BlurredBackground />
          <Transitions duration={1}>
            <CircularProgress
              // size={50}
              style={{
                color: theme.palette.mintGreen.main,
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
        sx={{
          width: '100%',
          opacity: isLoading ? 0.2 : 1,
          transition: 'opacity 0.5s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {resourceSharingEnabled ? (
          <Stack
            width="100%"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid container margin="2rem 0 0.5rem 0">
              <Grid item xs={5} padding="0rem 0rem 0.5rem 2rem">
                <Typography
                  fontWeight="500"
                  variant="h4"
                  fontSize="13px"
                  textAlign="left"
                >
                  Session ID:
                </Typography>
              </Grid>
              <Grid item xs={7} padding="0rem 2rem 0.5rem 0rem">
                <Typography
                  fontWeight="700"
                  variant="h4"
                  fontSize="13px"
                  textAlign="right"
                >
                  01H65Y8SMXXCZQ
                </Typography>
              </Grid>
              <Grid item xs={9} padding="0rem 0rem 0.5rem 2rem">
                <Typography
                  fontWeight="500"
                  variant="h4"
                  fontSize="13px"
                  textAlign="left"
                >
                  No. of Task Running:
                </Typography>
              </Grid>
              <Grid item xs={3} padding="0rem 2rem 0.5rem 0rem">
                <Typography
                  fontWeight="700"
                  variant="h4"
                  fontSize="13px"
                  textAlign="right"
                >
                  3
                </Typography>
              </Grid>
              <Grid item xs={7} padding="0rem 0rem 0.5rem 2rem">
                <Typography
                  fontWeight="500"
                  variant="h4"
                  fontSize="13px"
                  textAlign="left"
                >
                  CPU Utilization:
                </Typography>
              </Grid>
              <Grid item xs={5} padding="0rem 2rem 0.5rem 0rem">
                <Typography
                  fontWeight="700"
                  variant="h4"
                  fontSize="13px"
                  textAlign="right"
                >
                  {cpuUtilization}
                </Typography>
              </Grid>
              <Grid item xs={7} padding="0rem 0rem 0.5rem 2rem">
                <Typography
                  fontWeight="500"
                  variant="h4"
                  fontSize="13px"
                  textAlign="left"
                >
                  GPU Utilization:
                </Typography>
              </Grid>
              <Grid item xs={5} padding="0rem 2rem 0.5rem 0rem">
                <Typography
                  fontWeight="700"
                  variant="h4"
                  fontSize="13px"
                  textAlign="right"
                >
                  {gpuUtilization}
                </Typography>
              </Grid>
            </Grid>
            <Button
              onClick={handleDisableResourceSharing}
              sx={{
                width: '80%',
                padding: '0.7rem',
                color: isLoading ? theme.palette.cerulean.main : 'inherit',
                backgroundColor: isLoading
                  ? theme.palette.darkBlack.main
                  : theme.palette.violet.main,
              }}
            >
              <Typography variant="h3" fontSize="15px" textAlign="center">
                Disable Resource&nbsp;Sharing
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack
            width="100%"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box margin="2rem 0 0.5rem 0">
              <Typography
                variant="body2"
                fontSize="14px"
                textAlign="center"
                padding="0 1.5rem 0 1.5rem"
                marginBottom="1rem"
              >
                You are currently not registered for resource sharing.
              </Typography>
            </Box>
            <Button
              onClick={handleEnableResourceSharing}
              sx={{
                width: '80%',
                padding: '0.7rem',
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
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default HostSharingWidget;
