// import {
//   createChallenge,
//   verifyResponse,
// } from '../../services/RegistrationServices';
// import { signMessage, decryptWithPassword } from '../../utils/cryptoUtils';
import { authenticate } from 'renderer/services/RegistrationServices';
import actions from '../../redux/actionCreators';

const handleLogin = async (password: string): Promise<boolean | undefined> => {
  const did = window.electron.store.get('did');
  const credential = JSON.parse(window.electron.store.get('credential'));
  // To sign the credential using the private key to become verifiable presentation
  // Get key with (decryptWithPassword(window.electron.store.get('privateKey'), password))
  const accessTokenResponse = await authenticate(did, credential);
  const { access_token, refresh_token } = accessTokenResponse;
  console.log('did, ', did);
  console.log('access_token', access_token);
  actions.setAccessToken(access_token);
  actions.setRefreshToken(refresh_token);
  await handleStartExecutor('meca_executor_test');
  return true; // should only return true if signed VP is verified

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
};

const handleStartExecutor = async (containerName: string) => {
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

export default handleLogin;
