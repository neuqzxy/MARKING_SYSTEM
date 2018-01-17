// import Immutable from 'immutable'
const state = {
  doingMarks: [],
  doneMarks: []
}

const mutations = {
  setDoingMarks (state, payload) {
    state.doingMarks = payload.doingMarks
  },
  setDoneMarks (state, payload) {
    state.doneMarks = payload.doneMarks
  }
}

const getters = {
  getDoingMarks (state) {
    return state.doingMarks
  },
  getDoneMarks (state) {
    return state.doneMarks
  }
}

export default {
  state,
  mutations,
  getters
}
