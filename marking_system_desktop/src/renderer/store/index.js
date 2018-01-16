import Vue from 'vue'
import Vuex from 'vuex'
import Socket from '../plugin/socket'
import api from '../config/api.config'

import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

Vue.use(Socket, {basePath: api.basePath, store})

export default store
