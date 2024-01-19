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
    // const MnemonicAndKeyPair = await generateMnemonicAndKeyPair();
    // if (typeof MnemonicAndKeyPair === 'undefined') {
    //   throw new Error('Key pair generation failed.');
    // }
    // const { mnemonic, publicKey, privateKey, publicKeyCompressed } =
    //   MnemonicAndKeyPair;

    var MnemonicAndKeyPair;
    if (skipRegenerateMnemonics) {
      const mnemonics = window.electron.store.get('mnemonic');
      MnemonicAndKeyPair = await generateKeyPair(mnemonics);
    } else {
      MnemonicAndKeyPair = await generateMnemonicAndKeyPair();
    }
    if (typeof MnemonicAndKeyPair === 'undefined') {
      throw new Error('Key pair generation failed.');
    }
    const { mnemonic, publicKey, privateKey, publicKeyCompressed } =
      MnemonicAndKeyPair;
    // let did;
    // let credential;
    try {
      // if (window.electron.store.get('role') === 'provider') {
      // const publicKeyProvider =
      //   '9162489900438906348702968436157779450275819589845486784832046751964054847774610311218195072132906483269992698213206439837565459982787113366244600208153925';
      //   const result = await createAccount({
      //     publicKey: publicKeyProvider,
      //   });
      //   did = result.did;
      //   credential = result.credential;
      // } else {
      //   const result = await createAccount({
      //     publicKey: uint8ArrayToDecimal(publicKey),
      //   });
      //   did = result.did;
      //   credential = result.credential;
      // }
      const { did, credential } = await createAccount({
        publicKey: uint8ArrayToDecimal(publicKey),
      });
      console.log('did, credential', did, credential);
      if (!credential.result) {
        throw new Error(`error${credential.errorMessage}`);
      }
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
          gpus: 0,
        })
      );
      // window.electron.store.set(
      //   'deviceStats',
      //   JSON.stringify({
      //     totalCpuCores: 4,
      //     totalMem: 8192,
      //     totalGpus: 0,
      //     gpuModel: '',
      //   })
      // );
    } catch (createAccountError) {
      throw createAccountError;
    }
  } catch (keyPairGenerationError) {
    throw keyPairGenerationError;
  }
};

export default handleAccountRegistration;
