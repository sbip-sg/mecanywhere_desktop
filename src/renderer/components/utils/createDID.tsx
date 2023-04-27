import CryptoJS from 'crypto-js';

export function createDID(publicKey: string): string {
  // Generate the SHA-256 hash of the public key
  const hash = CryptoJS.SHA256(publicKey).toString(CryptoJS.enc.Hex);

  // Build the DID using the hash value
  const did = `did:example:${hash}`;

  return did;
}