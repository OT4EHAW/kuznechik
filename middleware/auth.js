export default function ({ store, redirect, context, route }) {
  if (route.fullPath === 'login' || route.fullPath === 'registration' || route.fullPath === '') {
    return
  }
  if (!store.state.auth.isAuth) {
    return redirect('/login')
  }
}
