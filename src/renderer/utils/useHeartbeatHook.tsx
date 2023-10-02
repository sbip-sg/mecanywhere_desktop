import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "renderer/redux/store";
import { heartbeat } from "renderer/services/RegistrationServices";

const useHeartbeatHook = () => {
  const isHost = useSelector(
    (state: RootState) => state.accountUser.hostAccessToken !== ''
  );
  const hostAccessToken = useSelector(
    (state: RootState) => state.accountUser.hostAccessToken
  );

  useEffect(() => {
    if (!isHost) return () => {};

    const did = window.electron.store.get('did');

    const interval = setInterval(async () => {
      await heartbeat(hostAccessToken, did);
    }, 60000);
    return () => clearInterval(interval);
  }, [isHost]);
};

export default useHeartbeatHook;
