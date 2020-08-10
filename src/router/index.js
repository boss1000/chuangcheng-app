import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import { constantRouterMap } from './router.config.js'
import { IsLogin } from '@/api/user.js'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.getters.token) {
      IsLogin()
        .then(data => {
          if (data.code === 1) {
            store.dispatch('user/setLoginData', data.object)
            next()
          } else {
            next({
              path: '/login'
            })
          }
        })
        .catch(error => {
          next({
            path: '/login'
          })
          console.log(error)
        })
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
