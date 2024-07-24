import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { ContainerName, ImageName } from 'common/dockerNames';
import { initActor } from 'renderer/services/PymecaService';
import { Formik, Form, FormikHelpers, } from 'formik';
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
  InitialLoginFormValues,
  LoginFormSchema,
  LoginFormValues,
} from '../componentsCommon/FormSchema';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

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
          actions.setAuthenticated(true);
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

  async function postSetup() {
    await registerHostIfNotRegistered(100, 0);
    await fetchAccount();
    await loadTowers();
  }

  const handleSubmit = async (values: LoginFormValues, formActions: FormikHelpers<LoginFormValues>) => {
    Object.entries(values).forEach(([key, value]) => {
      window.electron.store.set(key, value);
    });

    formActions.resetForm();
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
        <div>
          <Formik
            initialValues={InitialLoginFormValues}
            validationSchema={LoginFormSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Container
                  component="main"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: '3rem',
                    marginBottom: '3rem',
                  }}
                >
                  <Logo width="400px" height="50%"/>
                  <h1>Please enter details to login</h1>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      padding: '3rem',
                      width: '100%',
                      justifyItems: 'center',
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
                        sx={{
                          width: '20rem',
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    disabled={isSubmitting}
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
                </Container>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </Transitions>
  );
};

export default Login;
