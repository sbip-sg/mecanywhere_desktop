import {toByteArray} from "./generateKeyPairAndMnemonics"
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

export default function signMessage(privateKey, message) {
    const signature = nacl.sign.detached(nacl.util.decodeUTF8(message), toByteArray(privateKey));
    const signatureB64 = nacl.util.encodeBase64(signature);
    // console.log("nacl.util.decodeUTF8(message)", nacl.util.decodeUTF8(message))
    // console.log("toByteArray(privateKey)", toByteArray(privateKey))
    // nacl.util.decodeUTF8
    // var signature = nacl.sign(nacl.util.decodeUTF8(message), toByteArray(privateKey))
    // console.log("signature", signature)
    // var signatureB64 = nacl.util.encodeBase64(signature);
    // console.log("signatureB64", signatureB64)
    return signatureB64;
}

// export default async function RSASign(privateKey, data) {
//     const encoder = new TextEncoder();
//     const dataBuffer = encoder.encode(data);
//     console.log("Sssss", privateKey)
//     console.log("tobyteAsa", toByteArray(privateKey))
//     // Import the private key
//     const importedPrivateKey = await window.crypto.subtle.importKey(
//       'pkcs8',
//       toByteArray(privateKey),
//       {
//         name: 'RSA-PSS',
//         hash: 'SHA-256'
//       },
//       false,
//       ['sign']
//     );
//     console.log("importedPrivateKey", importedPrivateKey)
//     // Sign the data
//     const signature = await window.crypto.subtle.sign(
//       {
//         name: 'RSA-PSS',
//         saltLength: 32
//       },
//       importedPrivateKey,
//       dataBuffer
//     );
//     console.log("singature", signature)
//     // Convert the signature to a hex string
//     const signatureHex = Array.from(new Uint8Array(signature))
//       .map((byte) => {
//         return byte.toString(16).padStart(2, '0');
//       })
//       .join('');
  
//     console.log("signatureHex", signatureHex);
//     return signatureHex;
// }

// import crypto from 'crypto'

// export default function RSASign(privateKey, data): string {
//     const sign = crypto.createSign('RSA-SHA256');
//     sign.update(data);
//     var sig = sign.sign(privateKey, 'hex')
//     console.log(sig);
//     return sig;
// }

