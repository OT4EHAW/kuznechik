import {cipherHelper} from "./index";

export const testingKuznechik = () => {
  const targetStr = "пароль ret "
  const keyStr = "userPassword1234"
  const keyFictionStr = "userPassword1235"
  const encryptedStr = cipherHelper.kuznechikEncrypt(targetStr, keyStr)
  const decryptedStr = cipherHelper.kuznechikDecrypt(encryptedStr, keyStr)
  const logStr = `${targetStr} => ${encryptedStr} => ${decryptedStr}`
  if (targetStr !== decryptedStr) {
    console.error(logStr)
    return
  }
  console.log(logStr)
}
