import { useEffect } from 'react';
import {
  handleRegisterClient,
  handleDeregisterClient,
} from 'renderer/components/componentsCommon/handleRegistration';
import offloadTask from 'renderer/services/OffloadServices';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import Channels from '../../common/channels';

const useClientHooks = () => {
  const isClient = useSelector(
    (state: RootState) => state.userReducer.accessToken !== ''
  );
  const accessToken = useSelector(
    (state: RootState) => state.userReducer.accessToken
  );

  useEffect(() => {
    const registerClient = async () => {
      try {
        await handleRegisterClient();
        window.electron.clientRegistered(true);
      } catch (error) {
        console.log(error);
        window.electron.clientRegistered(false);
      }
    };

    const deregisterClient = async () => {
      await handleDeregisterClient();
    };

    window.electron.onRegisterClient(registerClient);
    window.electron.onDeregisterClient(deregisterClient);
  }, []);

  useEffect(() => {
    if (!isClient) return () => {};

    // const updateJob = (id: string, status: string) => {
    //   actions.addJob(id, status);
    // };

    // const updateJobResults = (id: string, result: string) => {
    //   actions.addJobResults(id, result);
    // };
    const did = window.electron.store.get('did');

    const offloadJob = async (jobJson: string) => {
      const jobJsonWithDid = `${jobJson.slice(0, -1)},"did":"${did}"}`;
      const reply = await offloadTask(accessToken, jobJsonWithDid);
      const { status, response, error, task_id, transaction_id } = reply;

      window.electron.jobResultsReceived(
        status,
        response,
        error,
        task_id,
        transaction_id
      );
      // actions.addJob(id, status);
    };

    // window.electron.onSubscribeJobs(updateJob);
    // window.electron.onSubscribeJobResults(updateJobResults);
    window.electron.onOffloadJob(offloadJob);

    return () => {
      // window.electron.removeListener(Channels.JOB_RECEIVED, updateJob);
      // window.electron.removeListener(Channels.JOB_RESULTS_RECEIVED, updateJobResults);
      window.electron.removeListener(Channels.OFFLOAD_JOB, offloadJob);
    };
  }, [isClient]);
};

export default useClientHooks;
