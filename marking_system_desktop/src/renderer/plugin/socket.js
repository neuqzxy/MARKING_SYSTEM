export default {
  install (vue, options = {basePath: 'http://127.0.0.1:3000'}) {
    /* eslint-disable */
    let head= document.getElementsByTagName('head')[0];
    let script= document.createElement('script')
    script.type= 'text/javascript'
    script.src= `${options.basePath}/socket.io/socket.io.js`;
    head.appendChild(script);
    script.onload= function(){
      vue.prototype.$io = io
      options.store.commit('setDownloadingState', {downloading: false})
    }
    /* eslint-enable */
  }
}
