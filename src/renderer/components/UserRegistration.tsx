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
import {
  registerUser,
  deregisterUser,
  assignHost,
} from '../services/RegistrationServices';

export default function UserRegistration() {
  const [registered, setRegistered] = useState(false);

  const handleRegisterUser = async () => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const { did } = reduxStore.getState().accountUser;
    if (credential && did) {
      actions.setCredential(credential);
      const registrationRes = await registerUser(did, credential);
      console.log('registration response:', registrationRes);
      if (registrationRes) {
        const { access_token } = registrationRes;
        actions.setUserAccessToken(access_token);

        const assignmentRes = await assignHost(access_token, did);
        console.log('assignment response:', assignmentRes);
        if (assignmentRes) {
          const { queue } = assignmentRes;
          window.electron.startPublisher(queue);
          setRegistered(true);
        }
      }
    }
  };

  const handleDeregisterUser = async () => {
    const { did } = reduxStore.getState().accountUser;
    const responseSuccess = await deregisterUser(
      reduxStore.getState().accountUser.userAccessToken,
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
            <Typography fontSize="24px">Register as User</Typography>
          </Box>

          <ToggleButton
            sx={{ minWidth: '10rem', width: '50%' }}
            value="check"
            selected={registered}
            onChange={registered ? handleDeregisterUser : handleRegisterUser}
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
