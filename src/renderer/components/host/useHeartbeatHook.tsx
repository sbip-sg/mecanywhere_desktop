import { useEffect } from "react";
import { heartbeat } from "renderer/services/RegistrationServices";

const useHeartbeatHook = (isHost: boolean, hostAccessToken: string, did: string) => {

  useEffect(() => {
    if (!isHost) return () => {};

    const interval = setInterval(async () => {
      await heartbeat(hostAccessToken, did);
    }, 300000);
    return () => clearInterval(interval);
  }, [isHost]);
};

export default useHeartbeatHook;
