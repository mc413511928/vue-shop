import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/css/global.css'
import './assets/fonts/iconfont.css'
// import TreeTable from 'tree-table-vue'
import axios from 'axios'
import TreeTable from 'tree-table-vue'
import moment from 'moment'
// 引富文本
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  // 为请求头对象，添加token验证的Authorization字段
  return config
})
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

Vue.filter('dateFormat', function () {
  return moment().format(' YYYY-MM-DD hh: mm:ss')
})
Vue.filter('upl', function (value) {
  return 'http://127.0.0.1:8888/' + value
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
