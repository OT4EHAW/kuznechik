import uuid  from 'node-uuid'
import {Streebog} from "../hashCode/Streebog";
import {createHashCode} from "../hashCode";

const createKey = () => {
  return uuid.v4()
}
const getTokenWorkTime = () => {

}
export const SECRET_KEY = createKey();
export const refreshToken = createKey();
const initSecondsCount = 300 //300 seconds

const encodeBase64urlFromJSON = (obj) => {
  const str = JSON.stringify(obj)
  const base64 = btoa(str);
  return base64
    .replace(/\+/g, '_')
    .replace(/\//g, '-')
    .replace(/=+$/g, '');
}
const decodedBase64urlToJSON = (base64url) => {
  let base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const pad = base64.length % 4;
  if(pad) {
    if(pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    base64 += new Array(5-pad).join('=');
  }
  return JSON.parse(atob(base64));
}


export const createAccessToken = (id, time = initSecondsCount) => {
  const headerCode = encodeBase64urlFromJSON({ alg:"Streebog", typ:"JWT" })
  const payloadCode = encodeBase64urlFromJSON({ exp: time, user: id})
  const signature = createHashCode(`${headerCode}.${payloadCode}`, SECRET_KEY)
  const jwt = `${headerCode}.${payloadCode}.${signature}`
  console.log("jwt:", jwt)
  return jwt
}

export const createRefreshToken = () => {
  return createKey()
}







export const verifyToken = (authorization) => {
  if (!authorization) {
    return null
  }
  let tokenParts = authorization
    .split(' ')[1]
    .split('.')
  let signature = crypto
    .createHmac('SHA256', SECRET_KEY)
    .update(`${tokenParts[0]}.${tokenParts[1]}`)
    .digest('base64')
  if (signature !== tokenParts[2]) {
    return null
  }
  return JSON.parse(
    Buffer.from(tokenParts[1], 'base64').toString(
      'utf8'
    )
  )
}


export const getSignatureUserToken = (userId) => {
    let head = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64')
    let body = Buffer.from(JSON.stringify(userId)).toString(
      'base64'
    )
   return crypto
      .createHmac('SHA256', SECRET_KEY)
      .update(`${head}.${body}`)
      .digest('base64')

};


