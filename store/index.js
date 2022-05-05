import Vuex from 'vuex'



// reusable aliases for mutations
export const AUTH_MUTATIONS = {
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT'
}

// reusable aliases for mutations
export const GROUP_MUTATIONS = {
  SET_GROUP_ID: 'SET_GROUP_ID',
  SET_RECORD_ID: 'SET_RECORD_ID',
  SET_GROUP_LIST: 'SET_GROUP_LIST',
  SET_RECORD_LIST: 'SET_RECORD_LIST',
  NEED_UPDATE_GROUP_LIST: "NEED_UPDATE_GROUP_LIST",
  SET_GROUP: "SET_GROUP"
}


const createStore = () => {
  return new Vuex.Store({
    state: {
      id: null, // user id
      email: localStorage.getItem('email'), // user email address

      access_token: null,
      refresh_token: localStorage.getItem('refresh_token'),

      groupId: '-1',
      recordId: null,
      groupName: 'Все записи',
      groupList: [],
      recordList: [],
      needUpdate: false
    },
    mutations: {
      // store the logged in user in the state
      [AUTH_MUTATIONS.SET_USER] (state, { email }) {
        if (!email) {
          console.error("user email not found")
          return
        }
        state.isAuth = true
        state.id = email
        state.email = email
        localStorage.setItem('email', email)
      },
      // store new or updated token fields in the state
      [AUTH_MUTATIONS.SET_TOKEN] (state, { access_token, refresh_token }) {
        state.access_token = access_token;
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
        localStorage.removeItem('refresh_token')
      },
      [GROUP_MUTATIONS.SET_GROUP] (state, {id, name}) {
        state.groupId = id
        state.groupName = name
        console.log("GROUP NAME",name)
      },
      // store the logged in user in the state
      [GROUP_MUTATIONS.SET_GROUP_ID] (state, id) {
        state.groupId = id
      },

      [GROUP_MUTATIONS.SET_RECORD_ID] (state, id) {
        state.recordId = id
      },
      [GROUP_MUTATIONS.SET_GROUP_LIST] (state, list) {
        state.groupList = list.slice() || []
        state.needUpdate = false
      },
      [GROUP_MUTATIONS.SET_RECORD_LIST] (state, list) {
        state.recordList = list.slice() || []
        state.needUpdate = false
      },
      [GROUP_MUTATIONS.NEED_UPDATE_GROUP_LIST] (state) {
        state.needUpdate = true
      }

    }
  })
}

export default createStore



