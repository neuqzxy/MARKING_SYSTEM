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
      redirect: '/v0/login'
    },
    {
      path: '/v0/login',
      name: 'login',
      component: require('@/pages/LoginPage').default
    },
    {
      path: '/v0/register',
      name: 'register',
      component: require('@/pages/RegisterPage').default
    },
    {
      path: '/v0/hall',
      name: 'hall',
      component: require('@/pages/HallPage').default
    },
    {
      path: '/v0/mark',
      name: 'mark',
      component: require('@/pages/MarkPage').default
    },
    {
      path: '/v0/user/:username',
      name: 'userPage',
      component: require('@/pages/UserPage').default
    },
    {
      path: '/v0/biglist/:id',
      name: 'bigList',
      meta: {keepAlive: true},
      component: require('@/pages/BigListPage').default
    },
    {
      path: '*',
      component: require('@/pages/Page404').default
    }
  ]
})
