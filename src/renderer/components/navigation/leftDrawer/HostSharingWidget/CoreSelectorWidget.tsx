import {
  Typography,
  ButtonGroup,
  Button,
  Stack,
  Grid,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@emotion/react';

const CoreSelectorWidget = ({ executorSettings, setExecutorSettings }) => {
  const theme = useTheme();

  const incrementCore = () => {
    if (executorSettings.cpu_cores < 4) {
      setExecutorSettings((prev) => ({
        ...prev,
        cpu_cores: prev.cpu_cores + 1,
      }));
    }
  };

  const decrementCore = () => {
    if (executorSettings.cpu_cores > 0) {
      setExecutorSettings((prev) => ({
        ...prev,
        cpu_cores: prev.cpu_cores - 1,
      }));
    }
  };

  return (
    <Grid container item xs={12} sx={{ justifyContent: 'space-between' }}>
      <Typography
        style={{
          height: '100%',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        CPU cores
      </Typography>
      <ButtonGroup variant="contained" size="small">
        <Button
          disabled
          sx={{
            color: `${theme.palette.offWhite.main} !important`,
            fontWeight: '600',
          }}
        >
          {executorSettings.cpu_cores}
        </Button>
        <Stack>
          <IconButton
            onClick={incrementCore}
            sx={{ padding: '0.1rem 0.1rem 0rem 0.1rem' }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', color: 'white' }} />
          </IconButton>
          <IconButton
            onClick={decrementCore}
            sx={{ padding: '0rem 0.1rem 0.1rem 0.1rem' }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', color: 'white' }} />
          </IconButton>
        </Stack>
      </ButtonGroup>
    </Grid>
  );
};

export default CoreSelectorWidget;