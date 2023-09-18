import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import ErrorDialog from '../../utils/ErrorDialogue';
import TextFieldWrapper from '../../utils/TextField';
import actions from '../../redux/actionCreators';
import logoTest from '../../../../assets/logo-test.png';
import Transitions from '../transitions/Transition';
import FormSchema from '../../utils/FormSchema';
import handleLogin from './handleLogin';
import { RootState } from '../../redux/store';

interface FormValues {
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };
  const isProvider = useSelector(
    (state: RootState) => state.isProvider.isProvider
  );
  const handleSubmit = useCallback(
    async (values: FormValues, formActions: FormikHelpers<FormValues>) => {
      setIsLoading(true);
      try {
        formActions.resetForm();
        const { password } = values;
        // const userIsAuthenticated = await handleLogin(password);
        const userIsAuthenticated = true;
        if (userIsAuthenticated) {
          actions.setAuthenticated(true);
          if (isProvider) {
            navigate('/providertxndashboard');
          } else {
            navigate('/hosttxndashboard');
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
    [isProvider, navigate]
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
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                alt="logo"
                src={logoTest}
                width="70%"
                height="70%"
                style={{ margin: '5rem 0 2rem' }}
              />
              <Typography variant="h5" py={2}>
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
                {useSelector((state: RootState) => state.isProvider.isProvider)
                  ? 'You have previously registered as a parent organization on this device. Please log in to continue.'
                  : 'You have previously registered as a client/host on this device. Please log in to continue.'}
              </Typography>
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
