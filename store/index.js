
export const state = {
   userId: '',
   isAuth : false,
 }


export const mutations = {
  onAuth(state) {
    state.loggedIn  = true
    localStorage.setItem('isAuth', "true")
  },
  offAuth(state) {
    state.loggedIn  = false
    localStorage.setItem('isAuth', "false")
  },
  login(state, value) {
    state.userId  = value
    localStorage.setItem('username', value)
    state.loggedIn  = true
    localStorage.setItem('isAuth', "true")
  },
  logout(state) {
    state.userId  = ""
    localStorage.removeItem('username')
    state.loggedIn  = false
    localStorage.setItem('isAuth', "false")

  }
}
