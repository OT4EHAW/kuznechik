
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}

export default function ({ $axios, $auth, redirect, store }) {
  $axios.onRequest((config) => {
    config.headers = headers
  })
}
