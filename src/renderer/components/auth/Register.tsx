import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import TextFieldWrapper from '../../utils/TextField';
import FormSchema from '../../utils/FormSchema';
// import logoBlack from '../../../../assets/logo-black.png';
import logoTest from '../../../../assets/logo-test.png';
import Transitions from '../transitions/Transition';
import handleAccountRegistration from './handleAccountRegistration';
import ErrorDialog from '../../utils/ErrorDialogue';
import { useTheme } from '@emotion/react';

interface FormValues {
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };
  const did = window.electron.store.get('did');
  const handleSubmit = useCallback(
    async (values: FormValues, formActions: FormikHelpers<FormValues>) => {
      setIsLoading(true);
      try {
        formActions.resetForm();
        const { password } = values;
        // await handleAccountRegistration(password);
        navigate('/roleselection');
      } catch (error) {
        setErrorMessage(String(error));
        setErrorDialogOpen(true);
        console.error(error);
      }
      setIsLoading(false);
    },
    []
  );

  return isLoading ? (
    <Transitions duration={1}>
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
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  alt="logo"
                  src={logoTest}
                  width="70%"
                  height="70%"
                  style={{ margin: '5rem 0 2rem' }}
                />
              </Box>
              <Typography
                variant="h5"
                py={2}
                color={theme.palette.cerulean.main}
                marginTop="1rem"
              >
                CREATE ACCOUNT
              </Typography>
              <TextFieldWrapper
                name="password"
                placeholder="Enter password"
                label="Password"
                type="password"
              />

              <Typography
                fontSize="12px"
                maxWidth="20rem"
                textAlign="center"
                marginTop="0.5rem"
              >
                {did
                  ? 'You already have an existing account on this device, creating an account will overwrite the existing one.'
                  : 'You do not have an account set up on this device. Please register to create a new wallet and seed phrase'}
              </Typography>
              <Stack
                sx={{ pt: 2 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained" color="secondary" type="submit">
                  Create Account
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/login')}
                >
                  Back
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

export default Register;
