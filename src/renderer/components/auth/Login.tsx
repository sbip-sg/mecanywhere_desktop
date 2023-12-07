import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import ErrorDialog from '../../utils/ErrorDialogue';
import TextFieldWrapper from '../../utils/TextField';
import actions from '../../redux/actionCreators';
// import logoTest from '../../../assets/logo-test.png';
import { ReactComponent as Logo } from '../../../../assets/LogoColorHorizontal.svg';

import Transitions from '../transitions/Transition';
import FormSchema from '../../utils/FormSchema';
import handleLogin from './handleLogin';

interface FormValues {
  password: string;
}

const getMessageByRole = (role: String) => {
  switch (role) {
    case 'host':
      return 'You have previously registered as a host on this device. Please log in to continue.';
    case 'provider':
      return 'You have previously registered as a provider on this device. Please log in to continue.';
    case 'client':
      return 'You have previously registered as a client on this device. Please log in to continue.';
    default:
      return 'It appears you have yet to set up MECAnywhere on this device. To get started, please proceed with the registration.';
  }
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };
  const role = window.electron.store.get('role');
  actions.setImportingAccount(false); // clear state
  const handleSubmit = useCallback(
    async (values: FormValues, formActions: FormikHelpers<FormValues>) => {
      setIsLoading(true);
      try {
        formActions.resetForm();
        const { password } = values;
        const userIsAuthenticated = await handleLogin(password);
        if (userIsAuthenticated) {
          actions.setAuthenticated(true);
          if (role === 'host') {
            navigate('/hosttxndashboard');
          } else if (role === 'provider') {
            navigate('/providertxndashboard');
          } else {
            console.error('invalid role');
          }
        } else {
          setErrorMessage('Wrong password');
          setErrorDialogOpen(true);
        }
      } catch (error) {
        setErrorMessage('Wrong password');
        setErrorDialogOpen(true);
      }
      setIsLoading(false);
    },
    [role, navigate]
  );

  return isLoading ? (
    <Transitions duration={2}>
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
      validationSchema={FormSchema}
      onSubmit={(values, formActions) => {
        handleSubmit(values, formActions);
      }}
    >
      {() => (
        <Form>
          <Container
            component="main"
            maxWidth="xs"
            sx={{ height: '100vh', display: 'flex' }}
          >
            <Box
              sx={{
                pb: '6rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  paddingLeft: '0.5rem',
                  height: '20%',
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <Logo width="300px" height="auto" />
              </Box>
              <Typography variant="h5" sx={{ py: '2rem' }}>
                LOG IN
              </Typography>
              <TextFieldWrapper
                name="password"
                placeholder="Enter password"
                label="Password"
                type="password"
              />
              <Typography
                fontSize="12px"
                maxWidth="22rem"
                textAlign="center"
                marginTop="0.5rem"
              >
                {getMessageByRole(window.electron.store.get('role'))}
              </Typography>
              <Box sx={{ maxWidth: '22rem', width: '100%' }}>
                <Box
                  sx={{
                    pt: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      width: '35%',
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      fontWeight: '600',
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      width: '60%',
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      fontWeight: '600',
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <Typography>OR</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => navigate('/import-seed-phrase')}
                  sx={{
                    maxWidth: '22rem',
                    width: '100%',
                  }}
                >
                  Import With Seed Phrase
                </Button>
              </Box>
              <ErrorDialog
                open={errorDialogOpen}
                onClose={handleCloseErrorDialog}
                errorMessage={errorMessage}
              />
            </Box>
          </Container>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
