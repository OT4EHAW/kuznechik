
export default function ({ $axios, $toast, store, redirect }) {
  $axios.onRequest((config) => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      Authorization: `Bearer ${store.state.auth.access_token}`
    }
  })

  $axios.onError((error) => {
    return new Promise((resolve, reject) => {
      let msg = 'Сервер вернул ошибку'
      const code = error.response.status
      switch (code) {
        case 500: msg = 'Ошибка на сервере'; break
        case 401: msg = 'Неверный пароль'; break
        case 406: msg = 'Пользователь с таким логином уже существует'; break
      }
      $toast.error(msg)
      console.error(msg, error.response.data)
    })
  })
}
