import { Typography, Stack, Grid, Button, Box } from '@mui/material';
import { useState } from 'react';

export default function HostRegistration() {
  const [registered, setRegistered] = useState(false);
  const registerHost = async () => {
    // TODO: register host
    setRegistered(true);
    // TODO: update global state
    // TODO: start task consumer
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

          <Button
            variant="contained"
            onClick={registerHost}
            sx={{ minWidth: '10rem', width: '30%' }}
          >
            Register
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}
