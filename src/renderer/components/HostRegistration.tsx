import { Typography, Stack, Grid, Box, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';

export default function HostRegistration() {
  const [registered, setRegistered] = useState(false);
  const registerHost = async () => {
    // TODO: register host
    setRegistered(true);
    // TODO: update global state

    // TODO: use queue name from registration
    window.electron.startConsumer('rpc_queue');
  };

  return (
    <Grid container spacing={3} sx={{ margin: '0 0 0.5rem 0' }}>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Stack direction="column">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              marginBottom: '0.5rem',
            }}
          >
            <Typography fontSize="24px">Register as Host</Typography>
          </Box>

          <ToggleButton
            sx={{ minWidth: '10rem', width: '50%' }}
            value="check"
            selected={registered}
            onChange={() => {
              registerHost();
              setRegistered(!registered);
            }}
          >
            {registered ? (
              <>
                REGISTERED <CheckIcon />
              </>
            ) : (
              <>REGISTER</>
            )}
          </ToggleButton>
        </Stack>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}
