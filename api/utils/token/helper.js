import uuid from "node-uuid";
import {signatureHelper} from "./signature";

export const encodeBase64urlToJSON = (obj) => {
  const str = JSON.stringify(obj)
  const base64 = btoa(str);
  return base64
    .replace(/\+/g, '_')
    .replace(/\//g, '-')
    .replace(/=+$/g, '');
}
const decodedBase64urlFromJSON = (base64url) => {
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

const createKey = () => {
  return uuid.v4()
}
let SECRET_KEY = createKey();

 const tokenHelper = {
   updateKey: () => {
     SECRET_KEY = createKey();
   },
  createAccess: (userId, time) => {
    const headerJSON = encodeBase64urlToJSON({ alg: "Streebog", typ: "JWT" })
    const payloadJSON = encodeBase64urlToJSON({ exp: time, user: userId })
    const signatureStr = `${headerJSON}.${payloadJSON}`
    const signature = signatureHelper.hmac(signatureStr, SECRET_KEY)
    const jwt = `${headerJSON}.${payloadJSON}.${signature}`
    console.log("jwt:", jwt)
    return jwt
  },
  createRefresh: () => {
    return createKey()
  },
  getUser: (accessToken) => {
    const payloadJSON = accessToken.split(".")[1]
    const payload = decodedBase64urlFromJSON(payloadJSON)
    console.log("user:", payload.user)

    return payload.user
  }
}


export default tokenHelper
