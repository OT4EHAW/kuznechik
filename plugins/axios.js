import {AUTH_MUTATIONS} from "../store";

export default function ({ $axios, $toast, store, redirect }) {
  $axios.onRequest((config) => {
    const jwt = store.state.access_token
    config.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization',
      Authorization: jwt
    }
    console.log(config)
  })

  $axios.onError((error) => {
    let msg = 'Сервер вернул ошибку'
    const code = error.response.status
    if (code === 401) {
      store.commit(AUTH_MUTATIONS.LOGOUT)
      redirect('/login')
    }
    switch (code) {
      case 401: msg = 'Ошибка авторизации'; break
      case 404: msg = 'Не найдено '; break
      case 406: msg = 'Неверный пароль'; break
      case 409: msg = 'Имя должно быть уникальным'; break
      case 500: msg = 'На сервере возникла ошибка'; break
      case 520: msg = 'Ошибка в шифровании'; break
    }
    $toast.error(msg)
    console.error(msg, error.response.data)
  })
}
