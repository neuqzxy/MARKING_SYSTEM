// import Immutable from 'immutable'
const state = {
  doingMarks: [],
  doneMarks: [],
  joiningMarks: []
}

const mutations = {
  setDoingMarks (state, payload) {
    state.doingMarks = payload.doingMarks
  },
  setDoneMarks (state, payload) {
    state.doneMarks = payload.doneMarks
  },
  setJoiningMarks (state, payload) {
    state.joiningMarks = payload.joiningMarks
  }
}

const getters = {
  getDoingMarks (state) {
    return state.doingMarks
  },
  getDoneMarks (state) {
    return state.doneMarks
  },
  getJoiningMarks (state) {
    return state.joiningMarks
  }
}

export default {
  state,
  mutations,
  getters
}
