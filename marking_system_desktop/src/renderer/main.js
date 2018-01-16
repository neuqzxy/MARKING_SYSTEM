import Vue from 'vue'
import axios from 'axios'
// import Socket from './plugin/socket'
import ConfigPlugin from './plugin/config'
import {version} from './config/default'
import App from './App'
import router from './router'
import store from './store'
// import api from './config/api.config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.withCredentials = true

Vue.use(ElementUI)
// Vue.use(Socket, {basePath: api.basePath})
Vue.use(ConfigPlugin, {version})
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
