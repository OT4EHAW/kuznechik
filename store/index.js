
export const actions = {
  async nuxtServerInit ({ dispatch, commit, state }) {
    const { access_token, refresh_token } = state.auth

    if (access_token && refresh_token) {
      try {
        // refresh the access token
        await dispatch('auth/refresh')
      } catch (e) {
        // catch any errors and automatically logout the user
        await dispatch('auth/logout')
      }
    }
  }
}
