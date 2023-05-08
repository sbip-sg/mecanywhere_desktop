import { Typography, Stack, Grid, Button, Box } from '@mui/material';
import { useState } from 'react';

export default function ClientRegistration() {
  const [registered, setRegistered] = useState(false);
  const registerClient = async () => {
    // TODO: register client
    setRegistered(true);
    // TODO: update global state
    // TODO: start task publisher
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
            <Typography fontSize="24px">Register as Client</Typography>
          </Box>

          <Button
            variant="contained"
            onClick={registerClient}
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
