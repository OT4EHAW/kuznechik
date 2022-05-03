import { gostEngine  } from "node-gost-crypto";

// HMAC algorithm based on GOST R 34.11
export const signatureHelper = {
  name: 'id-tc26-HMAC-gost-3411-12-256',
  hmac: (targetStr, keyStr) => {
    const targetBuffer = Buffer.from(targetStr)
    const keyBuffer = Buffer.from(keyStr)
    const config = {
      name: 'GOST R 34.11',
      mode: "HMAC",
      type: 'secret',
      usages: 'sign',
      buffer: keyBuffer
    }
    const helper = gostEngine.getGostDigest(config)
    const resultBuffer = helper.digest(targetBuffer)
    const result = Buffer.from(resultBuffer)
    return result.toString('hex')
  },
}


/*  const buffer = Buffer.from(msg)
  const keyBuffer = Buffer.from(keyStr)
  const key = {
    algorithm: {
      name: 'GOST R 34.12'
    },
    type: 'secret',
    usages: 'sign',
    buffer: keyBuffer
  }
  gostCrypto.subtle.sign('GOST R 34.11-HMAC', key, buffer).then((arrayBuffer) => {
    console.log(Buffer.from(arrayBuffer).toString('hex'))
  })*/
