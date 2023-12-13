import {
  Stack,
  Box,
  Button,
  Typography,
  useTheme,
  Switch,
} from '@mui/material';

const Settings = () => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'top',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography
          color="primary.main"
          variant="h3"
          style={{ margin: '0rem 0 0 0' }}
        >
          Settings
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography
          variant="h4"
          style={{ fontSize: '16px', margin: '1.5rem 0 0 0' }}
        >
          WIP
        </Typography>
      </Box>
    </Stack>
  );
};

export default Settings;
