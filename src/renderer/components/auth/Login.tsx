import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { ContainerName, ImageName } from 'common/dockerNames';
import { initActor } from 'renderer/services/PymecaService';
import { Formik, Form, FormikHelpers } from 'formik';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import actions from '../../redux/actionCreators';
import { ReactComponent as Logo } from '../../../../assets/LogoColor.svg';
import Transitions from '../../utils/Transition';
import {
  fetchAccount,
  setStoreSettings,
  startDockerContainer,
} from './handleEnterApp';
import { registerHostIfNotRegistered } from '../componentsCommon/handleRegistration';
import loadTowers from '../componentsCommon/loadTower';
import TextFieldWrapper from '../componentsCommon/TextField';
import {
  LoginFormSchema,
  LoginFormValues,
} from '../componentsCommon/FormSchema';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  async function setup() {
    try {
      actions.setImportingAccount(false);
      setIsLoading(true);
      await setStoreSettings();
      await startDockerContainer(
        ImageName.MECA_EXECUTOR,
        ContainerName.MECA_EXECUTOR_1
      );
      await startDockerContainer(
        ImageName.PYMECA_SERVER,
        ContainerName.PYMECA_SERVER_1
      );

      const maxRetries = 5;
      const retryDelay = 1500;
      let retries = 0;

      const retryLoop = async () => {
        try {
          await initActor('host');
          await postSetup();
          setIsLoading(false);
        } catch (error) {
          if (retries < maxRetries) {
            retries++;
            setTimeout(retryLoop, retryDelay);
          } else {
            throw error;
          }
        }
      };

      setTimeout(retryLoop, retryDelay);
    } catch (error) {
      setErrorMessage(`Error starting: ${error}`);
      setErrorDialogOpen(true);
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   setup();
  // }, []);

  async function postSetup() {
    await registerHostIfNotRegistered(100, 0);
    await fetchAccount();
    await loadTowers();
  }

  const handleSubmit = async (
    values: LoginFormValues,
    formActions: FormikHelpers<LoginFormValues>
  ) => {
    formActions.resetForm();
    actions.setAuthenticated(true);
    setup();
  };

  return (
    <Transitions duration={2}>
      {isLoading ? (
        <CircularProgress
          size={36}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <Formik
          initialValues={
            {}
          }
          validationSchema={LoginFormSchema}
          onSubmit={(values, formActions) => {
            handleSubmit(values, formActions);
          }}
        >
          {() => (
            <Form>
              <Container
                component="main"
                sx={{
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    pb: '6rem',
                    display: 'flex',
                    flexDirection: 'row',
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
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      width: '100%',
                      padding: '3rem',
                    }}
                  >
                    {Object.keys(LoginFormSchema.fields).map((field) => (
                      <TextFieldWrapper
                        key={field}
                        name={field}
                        id={field}
                        label={field}
                        type={field}
                        size="small"
                        // defaultValue={LoginFormValues[field]}
                        sx={{ width: '20rem' }}
                      />
                    ))}
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
      )}
    </Transitions>
  );
};

export default Login;
