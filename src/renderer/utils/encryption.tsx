import { AES, enc } from 'crypto-js';

export const encryptWithPassword = (privateKey, password) => {
    return AES.encrypt(privateKey, password).toString();
}

export const decryptWithPassword = (ciphertext, password) => {
    const decryptedBytes = AES.decrypt(ciphertext, password);
    return decryptedBytes.toString(enc.Utf8);
}