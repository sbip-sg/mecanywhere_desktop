import {
  createChallenge,
  verifyResponse,
} from '../../services/RegistrationServices';
import reduxStore from '../../redux/store';
import { signMessage, decryptWithPassword } from '../../utils/cryptoUtils';

const handleLogin = async (password: string): Promise<boolean | undefined> => {
    const challenge = await createChallenge({
        did: reduxStore.getState().accountUser.did,
    });
    const signature = signMessage(
        decryptWithPassword(window.electron.store.get('privateKey'), password),
        challenge
    );
    const res = await verifyResponse({
        message: challenge,
        publicKey: window.electron.store.get('publicKeyCompressed'),
        signature: signature,
    });
    return res;
}

export default handleLogin;