import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import TextFieldWrapper from '../../utils/TextField';
import {
  createChallenge,
  verifyResponse,
} from '../../services/RegistrationServices';
import actions from '../../redux/actionCreators';
import { reduxStore } from '../../redux/store';
import { signMessage, decryptWithPassword } from '../../utils/cryptoUtils';
import logoBlack from '../../../../assets/logo-black.png';
import Transitions from '../Transition';

function Login() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false); // Close the error dialog
  };
  const handleSubmit = async (values, formActions) => {
    setIsLoading(true);
    formActions.resetForm();
    if (window.electron.store.get('did')) {
      actions.setDID(window.electron.store.get('did'));
    } else {
      throw new Error('DID not found');
    }
    const { password } = values;
    const challenge = await createChallenge({
      email: 'placeholder-email',
      password: 'placeholder-pw',
      did: reduxStore.getState().accountUser.did,
    });

    try {
      const signature = signMessage(
        decryptWithPassword(window.electron.store.get('privateKey'), password),
        challenge
      );
      const res = await verifyResponse({
        message: challenge,
        publicKey: window.electron.store.get('publicKeyCompressed'),
        signature: signature,
      });
      if (res === true) {
        actions.setAuthenticated(true);
        setIsLoading(false);
        navigate('/userjobsubmission');
      } else {
        console.log('User not authenticated');
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('Wrong password'); // Set the error message
      setErrorDialogOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <Transitions>
          <CircularProgress
            size={36}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Transitions>
      ) : (
        <Formik
          initialValues={{ password: '' }}
          // validationSchema={FormSchema}
          onSubmit={(values, formActions) => {
            handleSubmit(values, formActions);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Container component="main" maxWidth="xs">
                <Box
                  sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src={logoBlack} width="50%" height="50%" />
                  <Typography variant="h5" py={2}>
                    LOG IN
                  </Typography>
                  <Typography variant="h6" align="center" color="red">
                    {error}
                  </Typography>
                  <TextFieldWrapper
                    margin="dense"
                    name="password"
                    placeholder="Enter password"
                    autoComplete="off"
                    label="Password"
                    type="password"
                    error={errors.password && touched.password}
                    helperText={
                      errors.password && touched.password && errors.password
                    }
                  />
                  <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                  >
                    <Button variant="contained" color="secondary" type="submit">
                      Log In
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate('/register')}
                    >
                      Create Account
                    </Button>
                  </Stack>
                  <Dialog
                    open={errorDialogOpen}
                    onClose={handleCloseErrorDialog}
                  >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                      <DialogContentText>{errorMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseErrorDialog}>OK</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Container>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

export default Login;
