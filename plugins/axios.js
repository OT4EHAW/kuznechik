
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}

export default function ({ $axios, $toast }) {
  $axios.onRequest((config) => {
    config.headers = headers

  })

  $axios.onError(({response})=> {
    let msg = "Сервер вернул ошибку"
    const code= response.status
    switch (code) {
      case 500: msg = "Ошибка на асервере"; break
      case 401: msg = "Неверный пароль"; break
      case 406: msg = "Пользователь с таким логином уже существует"; break
    }
    $toast.error(msg);
   console.error(msg,response.data);
  })
}
