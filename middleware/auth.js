export default function ({ store, redirect, context, route }) {
  if (route.fullPath === 'login' || route.fullPath === 'registration') {
    return
  }
  if (store.state.isAuth) {
    // return redirect('/login')
  }
}
