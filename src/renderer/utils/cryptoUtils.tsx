import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { AES, enc, SHA256 } from 'crypto-js';
import sha3 from 'js-sha3';
// @ts-ignore
import secp256k1 from '../../node_modules/secp256k1';

export const generateKeyPair = async (mnemonic: string) => {
  const seed = mnemonicToSeedSync(mnemonic).toString('hex');
  const privateKey = SHA256(seed).toString();
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  if (!secp256k1.privateKeyVerify(privateKeyBuffer)) {
    console.error('Invalid private key');
    return undefined;
  }
  const compressedPublicKey = secp256k1.publicKeyCreate(privateKeyBuffer);
  const uncompressedPublicKey = secp256k1.publicKeyConvert(
    compressedPublicKey,
    false
  );
  const publicKey = uncompressedPublicKey.slice(1);
  return {
    mnemonic,
    publicKey,
    privateKey: privateKeyBuffer,
    publicKeyCompressed: compressedPublicKey,
  };
};

export const generateMnemonicAndKeyPair = async () => {
  const mnemonic = generateMnemonic();
  // console.log('mnemonic', mnemonic);
  const MnemonicAndKeyPair = await generateKeyPair(mnemonic);
  // console.log('MnemonicAndKeyPair', MnemonicAndKeyPair);
  return MnemonicAndKeyPair;
};

function isUint8Array(value: any): value is Uint8Array {
  return value instanceof Uint8Array;
}

function isHexString(value: any): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const hexRegex = /^[0-9A-Fa-f]+$/;
  return hexRegex.test(value);
}

export const utf8ToHex = (uint8Array: Uint8Array): string => {
  if (!isUint8Array(uint8Array)) {
    throw new Error('Input is not a valid Uint8Array');
  }
  return Buffer.from(uint8Array).toString('hex');
};

export const hexToUtf8 = (string: string): Uint8Array => {
  if (!isHexString(string)) {
    throw new Error('Input is not a valid hex string');
  }
  return Uint8Array.from(Buffer.from(string, 'hex'));
};

export function uint8ArrayToDecimal(uint8Array: Uint8Array): string {
  if (!isUint8Array(uint8Array)) {
    throw new Error('Input is not a Uint8Array');
  }
  const hexString = Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return BigInt(`0x${hexString}`).toString();
}

export const encryptWithPassword = (privateKey: string, password: string) => {
  if (!isHexString(privateKey)) {
    throw new Error('privateKey provided is not a valid hex string');
  }
  if (privateKey.length !== 64) {
    throw new Error('privateKey provided is not 64 characters long');
  }
  return AES.encrypt(privateKey, password).toString();
};

export const decryptWithPassword = (ciphertext: string, password: string) => {
  const decryptedBytes = AES.decrypt(ciphertext, password);
  // try {
  //   decryptedBytes.toString(enc.Utf8)
  // } catch (error) {
  //   throw error;
  // }
  return decryptedBytes.toString(enc.Utf8);
};

export const signMessage = (privateKey: string, message: string) => {
  if (!isHexString(privateKey)) {
    throw new Error('privateKey provided is not a valid hex string');
  }
  if (privateKey.length !== 64) {
    throw new Error('privateKey provided is not 64 characters long');
  }
  const digest = sha3.sha3_256;
  const hash = Buffer.from(digest(message), 'hex');
  const signature = secp256k1.ecdsaSign(hash, hexToUtf8(privateKey));
  if (signature === undefined) {
    throw new Error('Failed to sign message');
  }
  return utf8ToHex(signature.signature);
};
