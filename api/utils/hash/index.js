import { gostEngine } from 'node-gost-crypto'
import {Streebog} from "./hashArray/Streebog";


const hashArray = (targetStr, length) => {
  const isResult512Bit = length === 512
  const helper = new Streebog()
  return helper.getHashArray(targetStr, isResult512Bit)
}

// 256 or 512 bits digest algorithm "Streebog" GOST R 34.11-2012 (default)
const hash = (targetStr, length) => {
  const targetBuffer = Buffer.from(targetStr)
  const config = {
    name: 'GOST R 34.11',
    mode: 'HASH',
    version: 2012,
    length: length
  }
  const helper = gostEngine.getGostDigest(config)
  const result = helper.digest(targetBuffer)
  const bufferResult = Buffer.from(result)
  return bufferResult.toString('hex')
}

/**
 * преобразует строку в хэш-код через функцию "Стрибог"
 */
export const hashHelper = {
  streebog_256: (targetStr) => {
    return hash(targetStr, 256) // строка из символов
  },
  streebog_512: (targetStr) => {
    return hash(targetStr, 512) // строка из символов
  },
  streebog_256_array: (targetStr) => {
    return hashArray(targetStr, 256)  // массив из 32-х байт (32 байта = 256 бит)
  },
  streebog_512_array: (targetStr) => {
    return hashArray(targetStr, 512)  // массив из 64-х байт (64 байта = 512 бит)
  }
}

