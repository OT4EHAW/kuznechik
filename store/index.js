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
  ADD_RECORD_LIST: 'ADD_RECORD_LIST',
  NEED_UPDATE_GROUP_LIST: "NEED_UPDATE_GROUP_LIST",
  NEED_UPDATE_RECORD_LIST: "NEED_UPDATE_RECORD_LIST",
  SET_GROUP: "SET_GROUP",
  NEED_UPDATE_RECORD: "NEED_UPDATE_RECORD",
  RENAME_RECORD: "RENAME_RECORD"
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
      needGroupListUpdate: false,
      needRecordListUpdate: false,
      needRecordUpdate: false
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
        state.id = null
        state.email = null
        state.access_token = null
        state.refresh_token = null
        localStorage.removeItem('email')
        localStorage.removeItem('refresh_token')
        state.groupId='-1'
          state. recordId= null
          state.groupName= 'Все записи'
          state.groupList= []
          state.recordList= []
          state.needGroupListUpdate= false
          state.needRecordListUpdate= false
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
        state.needRecordUpdate = false
      },
      [GROUP_MUTATIONS.SET_GROUP_LIST] (state, list) {
        state.groupList = list.slice() || []
        state.needGroupListUpdate = false
      },
      [GROUP_MUTATIONS.ADD_RECORD_LIST] (state, list) {
        state.recordList = [...state.recordList, ...list]
        state.needRecordListUpdate = false
      },
      [GROUP_MUTATIONS.SET_RECORD_LIST] (state, list) {
        state.recordList = list.slice() || []
        state.needRecordListUpdate = false
      },
      [GROUP_MUTATIONS.RENAME_RECORD] (state, record) {
        state.recordList = state.recordList.map(item=>{
          if (item._id !== record._id) {
            return item
          }
          return {
            ...item,
            label: record.label
          }
        })
      },
      [GROUP_MUTATIONS.NEED_UPDATE_RECORD_LIST] (state) {
        state.needRecordListUpdate = true
      },
      [GROUP_MUTATIONS.NEED_UPDATE_GROUP_LIST] (state) {
        state.needGroupListUpdate = true
      },
      [GROUP_MUTATIONS.NEED_UPDATE_RECORD] (state) {
        state.needRecordUpdate = true
      }

    }
  })
}

export default createStore



