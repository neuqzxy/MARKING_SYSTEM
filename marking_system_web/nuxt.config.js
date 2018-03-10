const QiniuPlugin = require('qiniu-webpack-plugin')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '实时评分系统',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: '评分系统web模块' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /**
   * 配置全局css
   */
  /**
   * 配置插件
   */
  plugins: ['~/plugins/vue-element'],
  /*
  ** Build configuration
  */
  /**
   * 配置服务器路由
   */
  env: {
    baseUrl: 'http://127.0.0.1:3000'
  },
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new QiniuPlugin({
          ACCESS_KEY: process.env.ACCESS_KEY,
          SECRET_KEY: process.env.SECRET_KEY,
          bucket: 'person-project',
          path: 'fe/'
        })
      )
    },
    babel: {
      "plugins": [["component", {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
      ]]
    },
    'publicPath': 'http://person.project.cdn.xinzai.site/fe/',
    vendor: ['axios']
  }
}
