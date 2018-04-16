import {fromJS} from 'immutable'
const state = {
  doingMarks: [],
  doneMarks: [],
  // 加入的评分组
  joiningMarks: fromJS([]),
  // 搜索出来的评分组
  searchedMarks: [],
  // 个人信息中的评分组，包括匿名评分
  myMarks: [],
  tableData: fromJS({}),
  socketState: fromJS({
    markPage: false
  })
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
  },
  setSocketState (state, payload) {
    state.socketState = payload.socketState
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
    return state.joiningMarks.toJS()
  },
  getSearchedMarks (state) {
    return state.searchedMarks
  },
  getMyMarks (state) {
    return state.myMarks
  },
  getTableData (state) {
    return state.tableData
  },
  getSocketState (state) {
    return state.socketState
  }
}

export default {
  state,
  mutations,
  getters
}
