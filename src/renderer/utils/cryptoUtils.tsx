import { generateMnemonic, mnemonicToSeedSync} from 'bip39'
import { AES, enc, SHA256 } from 'crypto-js';
import sha3 from 'js-sha3'
import secp256k1 from 'secp256k1'

export const generateMnemonicAndKeyPair = async () => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic).toString('hex');
  const privateKey = SHA256(seed).toString();
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  if (!secp256k1.privateKeyVerify(privateKeyBuffer)) {
    console.error('Invalid private key');
    return;
  }  
  const compressedPublicKey = secp256k1.publicKeyCreate(privateKeyBuffer);
  const uncompressedPublicKey  = secp256k1.publicKeyConvert(compressedPublicKey, false);
  const publicKey = uncompressedPublicKey.slice(1);

    return {
    mnemonic,
    publicKey: publicKey,
    privateKey: privateKeyBuffer,
    publicKeyCompressed: compressedPublicKey
  };
};

export const encryptWithPassword = (privateKey, password) => {
  return AES.encrypt(privateKey, password).toString();
};

export const decryptWithPassword = (ciphertext, password) => {
  const decryptedBytes = AES.decrypt(ciphertext, password);
  return decryptedBytes.toString(enc.Utf8);
};

export const signMessage = (privateKey, message) => {
  console.log(hexToUtf8(privateKey))
  const digest = sha3.sha3_256;
  const hash = Buffer.from(digest(message), 'hex')
  const signature = secp256k1.ecdsaSign(hash, hexToUtf8(privateKey))
  return utf8ToHex(signature.signature);
}

export const utf8ToHex = (string) => {
  return Buffer.from(string).toString('hex');
}

export const hexToUtf8 = (string) => {
  return Uint8Array.from(Buffer.from(string, 'hex'));
}

export function uint8ArrayToDecimal(uint8Array) {
  const hexString = Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return BigInt(`0x${hexString}`).toString();
}