import {
  generateMnemonicAndKeyPair,
  utf8ToHex,
  encryptWithPassword,
  generateKeyPair,
} from '../../utils/cryptoUtils';

const handleAccountRegistration = async (
  password: string,
  skipRegenerateMnemonics: boolean
) => {
  try {
    let MnemonicAndKeyPair;
    if (skipRegenerateMnemonics) {
      // importing account
      const mnemonics = window.electron.store.get('mnemonic');
      MnemonicAndKeyPair = await generateKeyPair(mnemonics);
    } else {
      // create entirely new account
      MnemonicAndKeyPair = await generateMnemonicAndKeyPair();
      if (typeof MnemonicAndKeyPair === 'undefined') {
        throw new Error('Key pair generation failed.');
      }
    }
    if (MnemonicAndKeyPair) {
      const { mnemonic, publicKey, privateKey, publicKeyCompressed } =
        MnemonicAndKeyPair;

      window.electron.store.set('password', password);
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
      window.electron.store.set(
        'taskList',
        JSON.stringify({
          downloaded: [],
          built: [],
          tested: [],
          activated: [],
        })
      );
    }
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

export default handleAccountRegistration;
