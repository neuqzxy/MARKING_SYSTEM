// import Immutable from 'immutable'
const state = {
  onLine: false,
  downloading: true
}

const mutations = {
  setOnLineState (state, payload) {
    // Immutable.fromJS(state).set('onLine', payload.onLine).toJS()
    state.onLine = payload.onLine
  },
  setDownloadingState (state, payload) {
    // Immutable.fromJS(state).set('downloading', payload.downloading).toJS()
    state.downloading = payload.downloading
  }
}

const getters = {
  getOnLine (state) {
    return state.onLine
  },
  getDownloading (state) {
    return state.downloading
  }
}

export default {
  state,
  mutations,
  getters
}
