import { useEffect } from "react";
import { handleRegisterClient, handleDeregisterClient } from "renderer/utils/handleRegistration";
import actions from 'renderer/redux/actionCreators';

const useClientHooks = (isClient: boolean) => {

  const generateUuid = () => {
    return (
      Math.random().toString() +
      Math.random().toString() +
      Math.random().toString()
    );
  };

  useEffect(() => {
    const registerClient = async (containerRef: string) => {
      try {
        await handleRegisterClient(containerRef);
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

    return () => {
      window.electron.removeListener("register-client", registerClient);
      window.electron.removeListener("deregister-client", deregisterClient);
    };
  });

  useEffect(() => {
    if (!isClient) return () => {};

    const updateJob = (id: string, status: string) => {
      actions.addJob(id, status);
    };

    const updateJobResults = (id: string, result: string) => {
      actions.addJobResults(id, result);
    };

    const offloadJob = async (job: string) => {
      const id = generateUuid();
      const status = await window.electron.publishJob(id, job);
      actions.addJob(id, status);
    };

    window.electron.onSubscribeJobs(updateJob);
    window.electron.onSubscribeJobResults(updateJobResults);
    window.electron.onOffloadJob(offloadJob);

    return () => {
      window.electron.removeListener("job-received", updateJob);
      window.electron.removeListener("job-results-received", updateJobResults);
      window.electron.removeListener("offload-job", offloadJob);
    };
  }, [isClient]);
};

export default useClientHooks;
