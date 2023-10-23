import {
  createChallenge,
  verifyResponse,
} from '../../services/RegistrationServices';
import { signMessage, decryptWithPassword } from '../../utils/cryptoUtils';

const handleLogin = async (password: string): Promise<boolean | undefined> => {
  const challenge = await createChallenge({
    did: window.electron.store.get('did'),
  });
  console.log("challenge", challenge)
  const signature = signMessage(
    decryptWithPassword(window.electron.store.get('privateKey'), password),
    challenge
  );
  console.log("signature", signature)
  const res = await verifyResponse({
    message: challenge,
    publicKey: window.electron.store.get('publicKeyCompressed'),
    signature,
  });
  console.log("res", res)
  return res;
};

export default handleLogin;
