import { signatureHelper } from "./index";

export const testingHMAC = () => {
  const targetStr = '0126bdb87800af214341456563780100'
  const keyStr = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
  const result = signatureHelper.hmac(targetStr, keyStr)
  console.log(`HMAC: ${result}`)
}
