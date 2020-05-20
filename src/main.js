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

// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.use(moment)

Vue.component('tree-table', TreeTable)
// Vue.use(TreeTable)
Vue.config.productionTip = false
Vue.filter('dateFormat', function (originVal) {
  // const dt = new Date(originVal)
  // const y = dt.getFullYear()
  // const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // const d = (dt.getDate() + '').padStart(2, '0')

  // const hh = (dt.getHours() + '').padStart(2, '0')
  // const mm = (dt.getMinutes() + '').padStart(2, '0')
  // const ss = (dt.getSeconds() + '').padStart(2, '0')

  // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  return moment().format(' YYYY MM DD hh: mm')
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
