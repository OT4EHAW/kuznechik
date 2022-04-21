import {Streebog2} from "./Streebog2";
import {Streebog} from "./Streebog";

const isResult512Bit = false // Для хеш-функции с длиной выхода 256 бит

const habrData = [0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,
  0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,
  0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,
  0x34,0x33,0x32,0x31,0x30,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x31,0x30]
const habrHash = "00-55-7B-E5-E5-84-FD-52-A4-49-B1-6B-02-51-D0-5D-27-F9-4A-B7-6C-BA-A6-DA-89-0B-59-D8-EF-1E-15-9D"

const textMsg = "ыверогИ ыкълп яырбарх ан ималертс яром с ътюев, ицунв ижобиртС, иртев еС"
const textMsgHash = isResult512Bit
  ? "28fbc9bada033b1460642bdcddb90c3fb3e56c497ccd0f62b8a2ad4935e85f037613966de4ee00531ae60f3b5a47f8dae06915d5f2f194996fcabf2622e6881e"
  :"508f7e553c06501d749a66fc28c6cac0b005746d97537fa85d9e40904efed29d"
const gost256Msg = "323130393837363534333231303938373635343332313039383736353433323130393837363534333231303938373635343332313039383736353433323130"
const gost256Msg2 = "01323130393837363534333231303938373635343332313039383736353433323130393837363534333231303938373635343332313039383736353433323130"
const gost256HashMsg = "00557be5e584fd52a449b16b0251d05d27f94ab76cbaa6da890b59d8ef1e159d"

const msg = gost256Msg
const hashMsg = gost256HashMsg


export const checkHashCode = () => {
  const t = new Streebog2()
  const byteArray = t.getHashArray(msg, isResult512Bit) // массив из 32-х значений  (32 байта = 256 бит)
  console.error(byteArray, byteArray.length === 32)

  function bufferToHex (buffer) {
    return Array
      .from (new Uint8Array (buffer))
      .map (b => b.toString (16).padStart (2, "0"))
      .join ("");
  }
  const bytesString = bufferToHex(byteArray);
  console.error(bytesString, bytesString === hashMsg)
}
