import {CBC, CFB, CTR, ECB, OFB} from "cryptokuznechik/src/package";
import {getHashArray32Bytes} from "../hashCode";


const buildCryptoHelper = (keyStr) => {
  const cryptoHelper = new CTR()
  const keyArray = getHashArray32Bytes(keyStr)
  cryptoHelper.kuz.GetKeys(Buffer.from(keyArray))
  return  cryptoHelper

}
export const bigCryptoHelper = {
  name: "CTR",
  getEncryptedStr: (targetStr, keyStr) => {
    const cryptoHelper = buildCryptoHelper(keyStr)
    let targetBuffer = Buffer.from(targetStr);
    let encryptedBuffer = cryptoHelper.Encrypt(targetBuffer);
    return encryptedBuffer
  },
  getDecryptedStr: (encryptedBuffer, keyStr) => {
    const cryptoHelper = buildCryptoHelper(keyStr)
    let decryptedBuffer = cryptoHelper.Decrypt(encryptedBuffer);
    return decryptedBuffer.toString('utf-8')
  }
}
