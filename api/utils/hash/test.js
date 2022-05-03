import { hashHelper} from "./index";


export const testingHASH = () => {
  const gostExample = 'Се ветри, Стрибожи внуци, веютъ с моря стрелами на храбрыя плъкы Игоревы'
  const gostExampleResult = '508f7e553c06501d749a66fc28c6cac0b005746d97537fa85d9e40904efed29d'

  const result = hashHelper.streebog_256(gostExample)
  const msgStr = `HASH-256: ${result}`

  if (result !== gostExampleResult) {
    console.error(msgStr)
    return
  }
  console.log(msgStr)
}


/* const buffer = Buffer.from(gost)

 // using engine
 const config = {
   name: 'GOST R 34.11',
   length: 256,
   version: 2012,
   mode: 'HASH'
 }
 const digest = gostEngine.getGostDigest(config)
 console.log(Buffer.from(digest.digest(buffer)).toString('hex'))

 gostCrypto.subtle.digest(streebog_256, buffer).then((arrayBuffer) => {
   console.log(Buffer.from(arrayBuffer).toString('hex'))
 })*/
