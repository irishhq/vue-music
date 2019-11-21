import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import Lazyload from 'vue-lazyload'

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(Lazyload, {
  preLoad: 1.3, /* 预载高度比 */
  error: require('common/image/img-down-err.png'),
  loading: require('common/image/default.png'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
