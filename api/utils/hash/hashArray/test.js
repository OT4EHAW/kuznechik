
import {Streebog} from "./Streebog";


/**
 * преобразует строку в массив байт из 32-х значений (32 байта = 256 бит)
 * через функцию "Стрибог"
 */
export const getHashArray32Bytes = (password) => {
  const isResult512Bit = false
  const hashCoder = new Streebog()
  return hashCoder.getHashArray(password, isResult512Bit)
}

/**
 * преобразует строку в массив байт из 64-х значений (64 байта = 512 бит)
 * через функцию "Стрибог"
 */
export const getHashArray64Bytes = (password) => {
  const isResult512Bit = true
  const hashCoder = new Streebog()
  return hashCoder.getHashArray(password, isResult512Bit)
}

/**
 * преобразует массив из 32-х байт в символьную строку
 */
const getHashString = (buffer) =>{
  return Array
    .from (new Uint8Array (buffer))
    .map (b => b.toString (16).padStart (2, "0"))
    .join ("");
}


/**
 * возвращает хэш-код длиной в 256 бит
 */
export const createHashCode256 = (password) => {
  const byteArray = getHashArray32Bytes(password)
  if (byteArray.length !== 32){
    console.error(byteArray)
    return null
  }
  return getHashString(byteArray);
}

/**
 * возвращает хэш-код длиной в 512 бит
 */
export const createHashCode512 = (password) => {
  const byteArray = getHashArray64Bytes(password)
  if (byteArray.length !== 64){
    console.error(byteArray)
    return null
  }
  return getHashString(byteArray);
}

/**
 * тест для библиотеки хэширования
 */
export const checkHashCode = () => {
  // тестовый набор 1
  const habrData = [0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,
    0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,
    0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,
    0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30]
  const habrHash = "00-55-7B-E5-E5-84-FD-52-A4-49-B1-6B-02-51-D0-5D-27-F9-4A-B7-6C-BA-A6-DA-89-0B-59-D8-EF-1E-15-9D"

  // тестовый набор 2
  const textMsg = "ыверогИ ыкълп яырбарх ан ималертс яром с ътюев, ицунв ижобиртС, иртев еС"
  const textMsgHash = "508f7e553c06501d749a66fc28c6cac0b005746d97537fa85d9e40904efed29d"

  // тестовый набор 3
  const gost256Msg = "fbe2e5f0eee3c820fbeafaebef20fffbf0e1e0f0f520e0ed20e8ece0ebe5f0f2f120fff0eeec20f120faf2fee5e2202ce8f6f3ede220e8e6eee1e8f0f2d1202ce8f0f2e5e220e5d1"
  const gost256HashMsg = "508F7E553C6501D749A66FC28C6CAC0B05746D97537FA85D9E40904EFED29D"
  const cryptoProResult = "E7AB4EFD0915EAAC2DAB58DAE45D0F28D14F83C57794B3338F7872C10542C19"

  const msg =gost256Msg
  const hashMsg = gost256HashMsg

  const hashMsgResult = createHashCode256(msg)

  if (hashMsg !== hashMsgResult){
    console.error("Несовпадение", hashMsgResult)
  }
}


