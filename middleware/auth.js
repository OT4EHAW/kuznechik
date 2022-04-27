import {AUTH_MUTATIONS} from "../store";

export default function ({ store, redirect, route, $axios }) {

  if (route.fullPath === 'login' || route.fullPath === 'registration'
    || route.fullPath === '') {
      return
  }

  const id = store.state.email
  if (!id) {
    return redirect('/login')
  }
}
