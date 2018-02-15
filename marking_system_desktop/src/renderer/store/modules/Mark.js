import {fromJS} from 'immutable'
const state = {
  doingMarks: [],
  doneMarks: [],
  joiningMarks: [],
  searchedMarks: [],
  myMarks: [],
  tableData: fromJS({})
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
  },
  setSearchedMarks (state, payload) {
    state.searchedMarks = payload.searchedMarks
  },
  setMyMarks (state, payload) {
    state.myMarks = payload.myMarks
  },
  setTableData (state, payload) {
    state.tableData = payload.tableData
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
  },
  getSearchedMarks (state) {
    return state.searchedMarks
  },
  getMyMarks (state) {
    return state.myMarks
  },
  getTableData (state) {
    return state.tableData.toJS()
  }
}

export default {
  state,
  mutations,
  getters
}
