
export const state = () => ({
  groupId: null
})

// reusable aliases for mutations
export const GROUP_MUTATIONS = {
  SET_GROUP_ID: 'SET_GROUP_ID'
}

export const mutations = {
  // store the logged in user in the state
  [GROUP_MUTATIONS.SET_GROUP_ID] (state, { id }) {
    state.groupId = true
  }
}
