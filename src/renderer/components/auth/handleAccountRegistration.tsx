import {
  generateMnemonicAndKeyPair,
  uint8ArrayToDecimal,
  utf8ToHex,
  encryptWithPassword,
  generateKeyPair,
} from '../../utils/cryptoUtils';
import { createAccount } from '../../services/RegistrationServices';

const handleAccountRegistration = async (
  password: string,
  skipRegenerateMnemonics: boolean
) => {
  try {
    let MnemonicAndKeyPair;
    let didToSet;
    let credentialToSet;
    if (skipRegenerateMnemonics) {
      // importing account
      const mnemonics = window.electron.store.get('mnemonic');
      MnemonicAndKeyPair = await generateKeyPair(mnemonics);
      didToSet = window.electron.store.get('did-temp');
      credentialToSet = window.electron.store.get('credential-temp');
    } else {
      // create entirely new account
      MnemonicAndKeyPair = await generateMnemonicAndKeyPair();
      if (typeof MnemonicAndKeyPair === 'undefined') {
        throw new Error('Key pair generation failed.');
      }
      const { did, credential } = await createAccount({
        publicKey: uint8ArrayToDecimal(MnemonicAndKeyPair.publicKey),
      });
      if (!credential.result) {
        throw new Error(`error${credential.errorMessage}`);
      }
      didToSet = did;
      credentialToSet = JSON.stringify({ credential: credential.result });
    }
    if (MnemonicAndKeyPair) {
      const { mnemonic, publicKey, privateKey, publicKeyCompressed } =
        MnemonicAndKeyPair;

      window.electron.store.set('mnemonic', mnemonic); // need to save mnemonic?
      window.electron.store.set(
        'publicKeyCompressed',
        utf8ToHex(publicKeyCompressed)
      );
      window.electron.store.set('publicKey', utf8ToHex(publicKey));
      window.electron.store.set(
        'privateKey',
        encryptWithPassword(utf8ToHex(privateKey), password)
      );
      window.electron.store.set('did', didToSet);
      window.electron.store.set('credential', credentialToSet);
      window.electron.store.set('isExecutorSettingsSaved', 'true');
      window.electron.store.set(
        'executorSettings',
        JSON.stringify({
          option: 'low',
          cpu_cores: 1,
          memory_mb: 2048,
          gpus: 0,
        })
      );
    }
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

export default handleAccountRegistration;
