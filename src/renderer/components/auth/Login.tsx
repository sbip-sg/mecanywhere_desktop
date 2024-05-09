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
    setIsLoading(true);
    fetchAccount();
    startExecutor('meca_executor_test');
    setIsLoading(false);
  }, []);

  const fetchAccount = async () => {
    try {
      const account = await getAccount();
      actions.setAuthenticated(true);
      window.electron.store.set('did', account);
    } catch (error) {
      console.error('Error fetching account:', error);
      setErrorMessage('Error fetching account');
      setErrorDialogOpen(true);
    }
  };

  const startExecutor = async (containerName: string) => {
    const dockerDaemonIsRunning =
      await window.electron.checkDockerDaemonRunning();
    if (!dockerDaemonIsRunning) {
      throw new Error('Docker daemon is not running');
    }
    const containerExist = await window.electron.checkContainerExist(
      containerName
    );
    if (containerExist) {
      const hasGpuSupport = await window.electron.checkContainerGpuSupport(
        containerName
      );
      if (hasGpuSupport) {
        await window.electron.removeExecutorContainer(containerName);
      }
    }
    await window.electron.runExecutorContainer(containerName);
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
        <Typography
          fontSize="12px"
          maxWidth="22rem"
          textAlign="center"
          marginTop="2rem"
        >
          Cannot find your account
        </Typography>
        <Box sx={{ maxWidth: '22rem', width: '100%' }}>
          <Box
            sx={{
              pt: '2rem',
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              variant="contained"
              onClick={() => fetchAccount()}
              sx={{
                width: '70%',
                color: 'text.primary',
                backgroundColor: 'primary.main',
                fontWeight: '600',
              }}
            >
              Reload
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
  );
};

export default Login;
