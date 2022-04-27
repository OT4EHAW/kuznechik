import {cryptoHelper} from "./cryptoHelper";


export const checkCryptoHelper = () => {
  const targetStr = "пароль ret "
  const keyStr = "userPassword1234"
  const keyFictionStr = "userPassword1235"
  const encryptedStr = cryptoHelper.getEncryptedStr(targetStr, keyStr)
  const decryptedStr = cryptoHelper.getDecryptedStr(encryptedStr, keyStr)
  const logStr = `${targetStr} => ${encryptedStr} => ${decryptedStr}`
  if (targetStr !== decryptedStr) {
    console.error(logStr)
    return
  }
  console.log(logStr)
}
