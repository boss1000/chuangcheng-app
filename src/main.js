// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
import VueTouch from 'vue-touch'
import './icons' // icon

Vue.prototype.$cdn = $cdn

import '@vant/touch-emulator';
// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
import '@/assets/css/base.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// filters
import './filters'
Vue.config.productionTip = false
Vue.use(VueTouch, { name: 'v-touch' })
Vue.use(Element, {
  size: 'small' // set element-ui default size
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
