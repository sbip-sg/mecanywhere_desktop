import { Button, Typography, Stack, Grid, Box, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import actions from "./states/actionCreators";
import { reduxStore } from './states/store';
import { registerHost, deregisterHost } from '../services/RegistrationServices';

export default function HostRegistration() {
  const [registered, setRegistered] = useState(false);
  const handleRegisterHost = async () => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    if (credential) {
        actions.setCredential(credential);
        const response = await registerHost({ credential });
        const { access_token } = response;
        actions.setHostAccessToken(access_token);
        console.log("response", response)
        if (response.ok) {
            setRegistered(true);
            window.electron.startConsumer('rpc_queue');
        }
    }      
  };
  const handleDeregisterHost = async () => {
    const response = await deregisterHost(reduxStore.getState().accountUser.hostAccessToken)
    console.log("response", response);
    setRegistered(false)
  }
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
            onChange={handleRegisterHost}
          >
            {registered ? (
              <>
                REGISTERED <CheckIcon />
              </>
            ) : (
              <>REGISTER</>
            )}
          </ToggleButton>
          <Button onClick={handleDeregisterHost}>DEREGISTER HOST</Button>
        </Stack>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}
