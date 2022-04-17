export default function ({ store, redirect, context, route }) {
  if (route.fullPath ===  "login" || route.fullPath ===  "registration") {
    return
  }
  if (localStorage.getItem('isAuth') === "false") {
   // return redirect('/login')
  }
}
