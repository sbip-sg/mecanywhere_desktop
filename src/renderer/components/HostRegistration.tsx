import {
  Button,
  Typography,
  Stack,
  Grid,
  Box,
  ToggleButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import actions from './states/actionCreators';
import { reduxStore } from './states/store';
import { registerHost, deregisterHost } from '../services/RegistrationServices';

export default function HostRegistration() {
  const [registered, setRegistered] = useState(false);
  const handleRegisterHost = async () => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const { did } = reduxStore.getState().accountUser;
    if (credential && did) {
      actions.setCredential(credential);
      const registrationRes = await registerHost(did, credential);
      console.log('registration response:', registrationRes);
      if (registrationRes) {
        const { access_token } = registrationRes;
        actions.setHostAccessToken(access_token);
        window.electron.startConsumer(did);
        setRegistered(true);
      }
    }
  };

  const handleDeregisterHost = async () => {
    const { did } = reduxStore.getState().accountUser;
    const responseSuccess = await deregisterHost(
      reduxStore.getState().accountUser.hostAccessToken,
      did
    );
    if (responseSuccess) {
      setRegistered(false);
    }
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
            onChange={registered ? handleDeregisterHost : handleRegisterHost}
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
