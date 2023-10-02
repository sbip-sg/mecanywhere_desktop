import { useEffect } from 'react';
import { handleDeregisterHost } from './handleRegistration';
import reduxStore from '../redux/store';
import log from 'electron-log/renderer';

const handleAppExit = async () => {
  const accessToken = reduxStore.getState().accountUser.hostAccessToken;
  log.info("accessToken", accessToken)
  if (accessToken && accessToken !== '') {
    await handleDeregisterHost();
  }
};
const useHandleAppExitHook = () => {
  useEffect(() => {
    const handleAppCloseInitiated = async () => {
      try {
        await handleAppExit();
        window.electron.confirmAppClose();
      } catch (error) {
        console.error('Failed to make API call during app close:', error);
        window.electron.confirmAppClose();
      }
    };
    window.electron.onAppCloseInitiated(handleAppCloseInitiated);
    return () => {
      window.electron.removeListener(
        'app-close-initiated',
        handleAppCloseInitiated
      );
    };
  }, []);
};

export default useHandleAppExitHook;
