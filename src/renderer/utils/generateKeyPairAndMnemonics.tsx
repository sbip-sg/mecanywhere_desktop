const bip39 = require('bip39');
const tweetnacl = require('tweetnacl');

export const generateMnemonicAndKeyPair = async () => {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const truncatedSeed = seed.slice(0, 32); // take the first 32 bytes
  const keyPair = tweetnacl.sign.keyPair.fromSeed(truncatedSeed);
  console.log(mnemonic, keyPair)
  return {
    mnemonic,
    publicKey: keyPair.publicKey,
    secretKey: keyPair.secretKey,
  };
};

export function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

export function toByteArray(hexString) {
  const length = hexString.length / 2;
  const byteArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}