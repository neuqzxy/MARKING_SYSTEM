// import Immutable from 'immutable'
const state = {
  username: ''
}

const mutations = {
  setUsername (state, payload) {
    state.username = payload.username
  }
}

const getters = {
  getUsername (state) {
    return state.username
  }
}

export default {
  state,
  mutations,
  getters
}
