const state = {
  onLine: false
}

const mutations = {
  setOnLineState (state, payload) {
    state = {...state, ...payload}
  }
}

export default {
  state,
  mutations
}
