import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { ContainerName, ImageName } from 'common/dockerNames';
import { initActor } from 'renderer/services/PymecaService';
import { Formik, Form, FormikHelpers, Field, ErrorMessage, FormikProps } from 'formik';
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

  const checkEnvVariables = () => {
    return {
      TASK_EXECUTOR_HOST: process.env.TASK_EXECUTOR_HOST || '',
      TASK_EXECUTOR_PORT: process.env.TASK_EXECUTOR_PORT || '',
      PYMECA_ACTOR_SERVER_HOST: process.env.PYMECA_ACTOR_SERVER_HOST || '',
      PYMECA_ACTOR_SERVER_PORT: process.env.PYMECA_ACTOR_SERVER_PORT || '',
      IPFS_NODE_URL: process.env.IPFS_NODE_URL || '',
      MECA_BLOCKCHAIN_RPC_URL: process.env.MECA_BLOCKCHAIN_RPC_URL || '',
      MECA_TASK_EXECUTOR_URL: process.env.MECA_TASK_EXECUTOR_URL || '',
      MECA_IPFS_HOST: process.env.MECA_IPFS_HOST || '',
      MECA_IPFS_PORT: process.env.MECA_IPFS_PORT || '',
      MECA_HOST_PRIVATE_KEY: process.env.MECA_HOST_PRIVATE_KEY || '',
      MECA_HOST_ENCRYPTION_PRIVATE_KEY: process.env.MECA_HOST_ENCRYPTION_PRIVATE_KEY || '',
      MECA_IPFS_API_HOST: process.env.MECA_IPFS_API_HOST || '',
      MECA_IPFS_API_PORT: process.env.MECA_IPFS_API_PORT || '',
      MECA_DEV_PRIVATE_KEY: process.env.MECA_DEV_PRIVATE_KEY || '',
      MECA_USER_PRIVATE_KEY: process.env.MECA_USER_PRIVATE_KEY || '',
      MECA_TOWER_PRIVATE_KEY: process.env.MECA_TOWER_PRIVATE_KEY || '',
    };
  };

  const initialValues: LoginFormValues = checkEnvVariables();

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

  async function postSetup() {
    await registerHostIfNotRegistered(100, 0);
    await fetchAccount();
    await loadTowers();
  }

  const handleSubmit = async (values: LoginFormValues, formActions: FormikHelpers<LoginFormValues>) => {
    console.log(values);

    Object.entries(values).forEach(([key, value]) => {
      window.electron.store.set(key, value);
    });

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
        <div>

          <Formik
            initialValues={initialValues}
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
