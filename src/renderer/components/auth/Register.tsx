import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextFieldWrapper from '../common/TextField';
import { RegisterFormSchema } from '../common/FormSchema';
import Transitions from '../transitions/Transition';
import ErrorDialog from '../common/ErrorDialogue';
import { ReactComponent as Logo } from '../../../../assets/LogoColor.svg';
import { RootState } from '../../redux/store';

interface FormValues {
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
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
        navigate('/roleselection', { state: { password } });
      } catch (error) {
        setErrorMessage(String(error));
        setErrorDialogOpen(true);
        console.error(error);
      }
      setIsLoading(false);
    },
    []
  );
  const isImportingAccount = useSelector(
    (state: RootState) => state.importingAccountReducer.importingAccount
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
      validationSchema={RegisterFormSchema}
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
              {isImportingAccount === true ? (
                <Typography variant="h5" py={4}>
                  Set Password
                </Typography>
              ) : (
                <Typography variant="h5" py={4}>
                  CREATE ACCOUNT
                </Typography>
              )}

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
                {did
                  ? 'You already have an existing account on this device, creating an account will overwrite the existing one.'
                  : 'You do not have an account set up on this device. Please register to create a new wallet and seed phrase'}
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {isImportingAccount === true ? (
                  <Button variant="contained" type="submit">
                    Confirm Password
                  </Button>
                ) : (
                  <Button variant="contained" type="submit">
                    Create Account
                  </Button>
                )}

                <Button variant="contained" onClick={() => navigate('/login')}>
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
