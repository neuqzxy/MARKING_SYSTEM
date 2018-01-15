import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/v0'
    },
    {
      path: '/v0',
      name: 'landing-page',
      component: require('@/pages/Login').default
    },
    {
      path: '/v0/login',
      name: 'login',
      component: require('@/pages/Login').default
    },
    {
      path: '/v0/register',
      name: 'register',
      component: require('@/pages/Register').default
    },
    {
      path: '*',
      component: require('@/pages/Page404').default
    }
  ]
})
