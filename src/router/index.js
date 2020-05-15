import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/rights'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights }]

  }

]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to去往哪个路径
  // from来自哪个路径
  // next同行
  // if (to.path === '/login') return next()
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (tokenstr) {
    next()
  } else {
    next('/login')
  }
})
export default router
