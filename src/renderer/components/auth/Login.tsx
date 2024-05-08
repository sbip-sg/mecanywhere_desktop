import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useCallback, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import TextFieldWrapper from '../componentsCommon/TextField';
import actions from '../../redux/actionCreators';
import { ReactComponent as Logo } from '../../../../assets/LogoColor.svg';
import Transitions from '../../utils/Transition';
import { LoginFormSchema } from '../componentsCommon/FormSchema';
import handleLogin from './handleLogin';
import { getAccount } from 'renderer/services/PymecaService';

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

  useEffect(() => {
    actions.setImportingAccount(false);
  }, []);

  const handleSubmit = useCallback(
    async (values: FormValues, formActions: FormikHelpers<FormValues>) => {
      setIsLoading(true);
      try {
        formActions.resetForm();
        const { password } = values;
        const userIsAuthenticated = await handleLogin(password);
        if (userIsAuthenticated) {
          actions.setAuthenticated(true);
          navigate('/txndashboard');
        } else {
          throw new Error('Wrong password');
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            typeof error === 'string' ? error : 'An unexpected error occurred'
          );
        }
        setErrorDialogOpen(true);
      }
      setIsLoading(false);
    },
    [navigate]
  );

  const fetchAccount = async () => {
    try {
      const account = await getAccount();
      actions.setAuthenticated(true);
      window.electron.store.set('did', account);
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  };

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
      validationSchema={LoginFormSchema}
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
                <Logo width="300px" height="100%" />
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
                      width: '45%',
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      fontWeight: '600',
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => fetchAccount()}
                    sx={{
                      width: '50%',
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      fontWeight: '600',
                    }}
                  >
                    Use secret
                  </Button>
                </Box>
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
