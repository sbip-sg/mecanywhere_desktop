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
    try {
      const { did, credential } = await createAccount({
        publicKey: uint8ArrayToDecimal(publicKey),
      });
      console.log('did, credential', did, credential);
      if (!credential.result) {
        throw new Error(`error${credential.errorMessage}`);
      }
      window.electron.store.set('mnemonic', mnemonic);
      window.electron.store.set(
        'publicKeyCompressed',
        utf8ToHex(publicKeyCompressed)
      );
      window.electron.store.set('publicKey', utf8ToHex(publicKey));
      window.electron.store.set(
        'privateKey',
        encryptWithPassword(utf8ToHex(privateKey), password)
      );
      window.electron.store.set('did', did);
      window.electron.store.set(
        'credential',
        JSON.stringify({ credential: credential.result })
      );
      window.electron.store.set('isExecutorSettingsSaved', 'true');
      window.electron.store.set(
        'executorSettings',
        JSON.stringify({
          option: 'low',
          cpu_cores: 1,
          memory_mb: 2048,
        })
      );
    } catch (createAccountError) {
      throw createAccountError;
    }
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

export default handleAccountRegistration;
