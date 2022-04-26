import {Kuznec} from "cryptokuznechik/src/package";
import {getHashArray32Bytes} from "../hashCode";


const buildCryptoHelper = (keyStr) => {
  const cryptoHelper = new Kuznec()
  const keyArray = getHashArray32Bytes(keyStr)
  cryptoHelper.GetKeys(Buffer.from(keyArray))
  return  cryptoHelper
}
export const cryptoHelper = {
  name: "kuznec",
  getEncryptedStr: (targetStr, keyStr) => {
    const cryptoHelper = buildCryptoHelper(keyStr)
    let targetBuffer = Buffer.from(targetStr);
    let encryptedBuffer = cryptoHelper.Encryption(targetBuffer);
    return encryptedBuffer
  },
  getDecryptedStr: (encryptedBuffer, keyStr) => {
    const cryptoHelper = buildCryptoHelper(keyStr)
    let decryptedBuffer = cryptoHelper.Decryption(encryptedBuffer);
    return decryptedBuffer.toString('utf-8')
  }
}
