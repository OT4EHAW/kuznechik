import {compile} from "vue-template-compiler";

export const state = () => ({
  isAuth: false,
  id: null, // user id
  email: localStorage.getItem('email'), // user email address
  access_token: null, // JWT access token
  refresh_token: localStorage.getItem('refresh_token') // JWT refresh token
})

// reusable aliases for mutations
export const AUTH_MUTATIONS = {
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT'
}

export const mutations = {
  // store the logged in user in the state
  [AUTH_MUTATIONS.SET_USER] (state, { email }) {
    state.isAuth = true
    state.id = email
    state.email = email
    localStorage.setItem('user', email)
  },
  // store new or updated token fields in the state
  [AUTH_MUTATIONS.SET_TOKEN] (state, { access_token, refresh_token }) {
    state.access_token = access_token
    state.refresh_token = refresh_token
    localStorage.setItem('refresh_token', refresh_token)
  },
  // clear our the state, essentially logging out the user
  [AUTH_MUTATIONS.LOGOUT] (state) {
    state.isAuth = false
    state.id = null
    state.email = null
    state.access_token = null
    state.refresh_token = null
    localStorage.removeItem('email')
  }
}

export const actions = {
  async login ({ commit, dispatch }, { email, password }) {
    return this.$axios.post('/api/account/login', { email: email, password: password })
  },

  async register ({ commit }, { email, password }) {
    // make an API call to register the user
    return this.$axios.post('/api/account/new',
      { email: email, password: password }
    )
  },

  // given the current refresh token, refresh the user's access token to prevent expiry
  async refresh ({ commit, state }) {
    const { refresh_token } = state

    // make an API call using the refresh token to generate a new access token
    this.$axios.post(
      '/api/account/refresh',
      { refresh_token }
    ).then(({ data: { token } }) => {
      commit(AUTH_MUTATIONS.SET_TOKEN, token)
    })
  },

  // logout the user
  logout ({ commit, state }) {
    commit(AUTH_MUTATIONS.LOGOUT)
  }
}
