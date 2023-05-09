import {toByteArray} from "./generateKeyPairAndMnemonics"
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

export default function signMessage(privateKey, message) {
    const signature = nacl.sign.detached(nacl.util.decodeUTF8(message), toByteArray(privateKey));
    const signatureB64 = nacl.util.encodeBase64(signature);
    return signatureB64;
}
