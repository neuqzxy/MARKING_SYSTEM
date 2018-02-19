import {fromJS} from 'immutable'
const state = {
  checkedMarksData: fromJS([]),
  calculatedScores: fromJS([])
}

const mutations = {
  setCheckedMarksData (state, payload) {
    state.checkedMarksData = payload.checkedMarksData
  },
  setCalculatedScores (state, payload) {
    state.calculatedScores = payload.calculatedScores
  }
}

const getters = {
  getCheckedMarksData (state) {
    return state.checkedMarksData.toJS()
  },
  getCalculatedScores (state) {
    return state.calculatedScores.toJS()
  }
}

export default {
  state,
  mutations,
  getters,
  namespaced: true
}
