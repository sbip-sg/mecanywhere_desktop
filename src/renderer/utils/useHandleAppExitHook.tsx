// import log from 'electron-log/renderer';
import { useEffect } from 'react';
import { stopExecutor } from 'renderer/services/ExecutorServices';
import { handleDeactivateHost } from '../components/componentsCommon/handleRegistration';

const handleAppExit = async () => {
  await stopExecutor();
  await handleDeactivateHost();
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
    const handleAppReloadInitiated = async () => {
      try {
        await handleAppExit();
        window.electron.confirmAppReload();
      } catch (error) {
        console.error('Failed to make API call during app reload:', error);
        window.electron.confirmAppReload(); // still confirm reload
      }
    };

    window.electron.onAppCloseInitiated(handleAppCloseInitiated);
    window.electron.onAppReloadInitiated(handleAppReloadInitiated);

    return () => {
      window.electron.removeListener(
        'app-close-initiated',
        handleAppCloseInitiated
      );
      window.electron.removeListener(
        'app-reload-initiated',
        handleAppReloadInitiated
      );
    };
  }, []);
};

export default useHandleAppExitHook;
