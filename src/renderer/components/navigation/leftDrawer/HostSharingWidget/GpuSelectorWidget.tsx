import {
  Typography,
  ButtonGroup,
  Button,
  Stack,
  Box,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '@emotion/react';

const GpuSelectorWidget = ({
  executorSettings,
  setExecutorSettings,
  deviceResource,
}) => {
  const theme = useTheme();
  const incrementGpu = () => {
    if (executorSettings.gpus < deviceResource.totalGpus) {
      setExecutorSettings((prev) => ({
        ...prev,
        gpus: prev.gpus + 1,
      }));
    }
  };

  const decrementGpu = () => {
    if (executorSettings.gpus > 0) {
      setExecutorSettings((prev) => ({
        ...prev,
        gpus: prev.gpus - 1,
      }));
    }
  };

  return (
    <Stack
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 0.1rem 0 0 ',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', padding: '0.2rem 0 0 0' }}
      >
        {deviceResource.gpuModel === '' ? (
          <>
            <ErrorIcon
              sx={{
                color: 'error.main',
                fontSize: '16px',
                margin: '0 0.2rem 0.2rem 0',
              }}
            />
            <Typography variant="body2" color="error.main">
              No GPU detected on your system
            </Typography>
          </>
        ) : (
          <Typography variant="body2">
            {`Model: ${deviceResource.gpuModel}`}
          </Typography>
        )}
      </Box>
      {deviceResource.gpuModel !== '' && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 0.1rem 0 0 ',
          }}
        >
          <Typography
            sx={{
              height: '100%',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
            }}
          >
            GPU cores
          </Typography>
          <ButtonGroup
            variant="contained"
            size="small"
            sx={{ margin: '0.5rem 0' }}
          >
            <Button
              disabled
              sx={{
                backgroundColor: `${theme.palette.background.paper} !important`,
                color: `${theme.palette.text.primary} !important`,
                fontWeight: '600',
              }}
            >
              {executorSettings.gpus}
            </Button>
            <Stack>
              <IconButton
                onClick={incrementGpu}
                sx={{ padding: '0.1rem 0.1rem 0rem 0.1rem' }}
              >
                <KeyboardArrowUpIcon
                  sx={{ fontSize: '20px', color: 'text.primary' }}
                />
              </IconButton>
              <IconButton
                onClick={decrementGpu}
                sx={{ padding: '0rem 0.1rem 0.1rem 0.1rem' }}
              >
                <KeyboardArrowDownIcon
                  sx={{ fontSize: '20px', color: 'text.primary' }}
                />
              </IconButton>
            </Stack>
          </ButtonGroup>
        </Box>
      )}
    </Stack>
  );
};

export default GpuSelectorWidget;
