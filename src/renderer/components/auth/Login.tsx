import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import ErrorDialog from '../../utils/ErrorDialogue';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import TextFieldWrapper from '../../utils/TextField';
import actions from '../../redux/actionCreators';
import logoBlack from '../../../../assets/logo-black.png';
import Transitions from '../Transition';
import { FormikHelpers } from 'formik';
import FormSchema from '../../utils/FormSchema';
import handleLogin from './handleLogin';

interface FormValues {
  password: string;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };
  const handleSubmit = useCallback(async (values: FormValues, formActions: FormikHelpers<FormValues>) => {
    setIsLoading(true);
    try {
      formActions.resetForm();
      const { password } = values;
      
      const userIsAuthenticated = await handleLogin(password);  
      if (userIsAuthenticated) {
        actions.setAuthenticated(true);
        navigate('/userjobsubmission');
      } else {
        setErrorMessage('Wrong password');
        setErrorDialogOpen(true);

      }
    } catch (error) {
      setErrorMessage('Wrong password');
      setErrorDialogOpen(true);
      console.error(error);
    }
    setIsLoading(false);
  }, [])

  return (
    <>
      {isLoading ? (
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
                  <img src={logoBlack} width="50%" height="50%" />
                  <Typography variant="h5" py={2}>
                    LOG IN
                  </Typography>
                  <TextFieldWrapper
                    name="password"
                    placeholder="Enter password"
                    label="Password"
                    type="password"
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
      )}
    </>
  );
}

export default Login;
