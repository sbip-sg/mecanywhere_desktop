// import {
//   createChallenge,
//   verifyResponse,
// } from '../../services/RegistrationServices';
// import { signMessage, decryptWithPassword } from '../../utils/cryptoUtils';
import { authenticate } from 'renderer/services/RegistrationServices';
import actions from '../../redux/actionCreators';

const handleLogin = async (password: string): Promise<boolean | undefined> => {
  const did = window.electron.store.get('did');
  if (!did) {
    throw new Error('No account detected on this device!');
  }
  const credential = JSON.parse(window.electron.store.get('credential'));
  // To sign the credential using the private key to become verifiable presentation
  // Get key with (decryptWithPassword(window.electron.store.get('privateKey'), password)). Rmb to catch password wrong error here
  const accessTokenResponse = await authenticate(did, credential);
  if (accessTokenResponse.error) {
    throw new Error(accessTokenResponse.error); // Propagate the error
  }
  const { access_token, refresh_token } = accessTokenResponse;
  console.log('did, ', did);
  console.log('access_token', access_token);
  actions.setAccessToken(access_token);
  actions.setRefreshToken(refresh_token);
  try {
    console.log('dockerDaemonIsRunningssss');

    const dockerDaemonIsRunning =
      await window.electron.checkDockerDaemonRunning();
    console.log('dockerDaemonIsRunning', dockerDaemonIsRunning);
    if (!dockerDaemonIsRunning) {
      throw new Error('Docker daemon is not running');
    }
    try {
      console.log('aaaa');
      await handleStartExecutor('meca_executor_test');
      console.log('bbbb');
    } catch (executorError) {
      console.error('Error starting executor:', executorError);
      throw executorError;
    }
    console.log('cccc');

    return true; // should only return true if signed VP is verified
  } catch (error) {
    console.error('Error in login process:', error);
    throw error;
  }
};

const handleStartExecutor = async (containerName: string) => {
  console.log('dddd');

  const containerExist = await window.electron.checkContainerExist(
    containerName
  );
  console.log('ccccaaa', containerExist);

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

export default handleLogin;

// for future reference if the challenge-response scheme for authentication will be reused.
// const challenge = await createChallenge({
//   did: window.electron.store.get('did'),
// });
// console.log("challenge", challenge)
// const signature = signMessage(
//   decryptWithPassword(window.electron.store.get('privateKey'), password),
//   challenge
// );
// console.log("signature", signature)
// const res = await verifyResponse({
//   message: challenge,
//   publicKey: window.electron.store.get('publicKeyCompressed'),
//   signature,
// });
// console.log("res", res)
// return res;
