import {
  generateMnemonicAndKeyPair,
  uint8ArrayToDecimal,
  utf8ToHex,
  encryptWithPassword,
} from '../../utils/cryptoUtils';
import { createAccount } from '../../services/RegistrationServices';

const generateRandomString = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  };
  
const handleAccountRegistration = async (password: string) => {
    try {
      const keyPair = await generateMnemonicAndKeyPair();
      if (typeof keyPair === 'undefined') {
        throw new Error('Key pair generation failed.');
      }
  
      const { mnemonic, publicKey, privateKey, publicKeyCompressed } = keyPair;
  
      try {
        const { did, credential } = await createAccount({
          email: 'placeholder-' + generateRandomString(),
          password: 'placeholder-pw',
          publicKey: uint8ArrayToDecimal(publicKey),
          publicKeyWallet: uint8ArrayToDecimal(publicKey),
        });
        window.electron.store.set('mnemonic', mnemonic);
        window.electron.store.set('publicKeyCompressed', utf8ToHex(publicKeyCompressed));
        window.electron.store.set('publicKey', utf8ToHex(publicKey));
        window.electron.store.set('privateKey', encryptWithPassword(utf8ToHex(privateKey), password));
        window.electron.store.set('did', did);
        window.electron.store.set('credential', JSON.stringify({ credential: credential.result }));
      } catch (createAccountError) {
        console.log(createAccountError);
      }
    } catch (keyPairGenerationError) {
      console.log(keyPairGenerationError);
    }
  };
  
export default handleAccountRegistration;