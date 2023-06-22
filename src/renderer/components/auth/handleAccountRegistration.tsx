import {
  generateMnemonicAndKeyPair,
  uint8ArrayToDecimal,
  utf8ToHex,
  encryptWithPassword,
} from '../../utils/cryptoUtils';
import { createAccount } from '../../services/RegistrationServices';
  
const handleAccountRegistration = async (password: string) => {
    try {
      const keyPair = await generateMnemonicAndKeyPair();
      if (typeof keyPair === 'undefined') {
        throw new Error('Key pair generation failed.');
      }
  
      const { mnemonic, publicKey, privateKey, publicKeyCompressed } = keyPair;
      console.log("keyPair", keyPair)
      try {
        const { did, credential } = await createAccount({
          publicKey: uint8ArrayToDecimal(publicKey),
        });
        if (!credential.result) {
          throw new Error("error" + credential.errorMessage)
        }
        window.electron.store.set('mnemonic', mnemonic);
        window.electron.store.set('publicKeyCompressed', utf8ToHex(publicKeyCompressed));
        window.electron.store.set('publicKey', utf8ToHex(publicKey));
        window.electron.store.set('privateKey', encryptWithPassword(utf8ToHex(privateKey), password));
        window.electron.store.set('did', did);
        window.electron.store.set('credential', JSON.stringify({ credential: credential.result }));
      } catch (createAccountError) {
        throw createAccountError;
      }
    } catch (keyPairGenerationError) {
      throw keyPairGenerationError
    }
  };
  
export default handleAccountRegistration;