import {bigCryptoHelper} from "./bigCryptoHallper";
import {cryptoHelper} from "./cryptoHallper";


export const getAlgName = (targetStr) => {
  const helper = targetStr.length > 16 ? bigCryptoHelper : cryptoHelper
  return helper.name
}
export const getHelper = (algName) => {
  let helper = bigCryptoHelper;
 /* switch (algName){
    case "kuznec": helper = cryptoHelper; break;
  }*/
 return helper
}
export const encryptStr = (targetStr, keyStr, algName) => {
  const helper = getHelper(algName)
  return  helper.getEncryptedStr(targetStr, keyStr)
}
export const decryptStr = (encryptedStr, keyStr, algName) => {
  const helper = getHelper(algName)
  return  helper.getDecryptedStr(encryptedStr, keyStr, helper)
}

export const checkCryptoHelper = () => {
  const targetStr = "пароль ret "
  const keyStr = "userPassword1234"
  const keyFictionStr = "userPassword1235"
  const algName = getAlgName(targetStr)
  const encryptedStr = encryptStr(targetStr, keyStr)
  const decryptedStr = decryptStr(encryptedStr, keyStr)
  const logStr = `${targetStr} => ${encryptedStr} => ${decryptedStr}`
  if (targetStr !== decryptedStr) {
    console.error(logStr)
    return
  }
  console.log(logStr)
}
