import { Button, Typography, Stack, Grid, Box, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import actions from "./states/actionCreators";
import { reduxStore } from './states/store';
import { registerUser, deregisterUser } from '../services/RegistrationServices';

export default function UserRegistration() {
  const [registered, setRegistered] = useState(false);
  // TODO: register client 
  // TODO: update global state
  // TODO: use queue name from registration
  
  const handleRegisterUser = async () => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    if (credential) {
        actions.setCredential(credential);
        const response = await registerUser({ credential });
        const { access_token } = response;
        actions.setUserAccessToken(access_token);
        console.log("response", response)
        if (response.ok) {
            setRegistered(true);
            window.electron.startPublisher('rpc_queue');
        }
    }
};
  const handleDeregisterUser = async () => {
    const response = await deregisterUser(reduxStore.getState().accountUser.userAccessToken)
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
            <Typography fontSize="24px">Register as User</Typography>
          </Box>

          <ToggleButton
            sx={{ minWidth: '10rem', width: '50%' }}
            value="check"
            selected={registered}
            onChange={handleRegisterUser}
          >
            
            {registered ? (
              <>
                REGISTERED <CheckIcon />
              </>
            ) : (
              <>REGISTER</>
            )}
          </ToggleButton>
          <Button onClick={handleDeregisterUser}>DEREGISTER</Button>
        </Stack>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}
