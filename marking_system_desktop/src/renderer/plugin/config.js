export default {
  install (vue, options = {version: 'v0'}) {
    /* eslint-disable */
    vue.prototype.$myVersion = options.version
    /* eslint-enable */
  }
}
