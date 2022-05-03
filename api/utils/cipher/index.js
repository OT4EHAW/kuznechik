import {CBC, CFB, CTR, ECB, OFB} from "cryptokuznechik/src/package";
import {hashHelper} from "../hash";

/**
 * конфигурация для Кузнечика
* */
const buildCryptoHelper = (keyStr) => {
  const cryptoHelper = new CTR()
  const keyArray = hashHelper.streebog_256_array(keyStr)
  cryptoHelper.kuz.GetKeys(Buffer.from(keyArray))
  return  cryptoHelper

}
export const cipherHelper = {
  name: "CTR",
  kuznechikEncrypt: (targetStr, keyStr) => {
    const helper = buildCryptoHelper(keyStr)
    let targetBuffer = Buffer.from(targetStr);
    let encryptedBuffer = helper.Encrypt(targetBuffer);
    return encryptedBuffer
  },
  kuznechikDecrypt: (encryptedBuffer, keyStr) => {
    const helper = buildCryptoHelper(keyStr)
    let decryptedBuffer = helper.Decrypt(encryptedBuffer);
    return decryptedBuffer.toString('utf-8')
  }
}
