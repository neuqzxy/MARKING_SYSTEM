import Vue from 'vue'
import Vuex from 'vuex'
console.log('a')

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    userInfo: {}
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload.userInfo
    }
  },
  getters: {
    getUserInfo (state) {
      return state.userInfo
    }
  }
})

export default store
