import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import FastClick from "fastclick";
// 瀑布流
import waterfall from "vue-waterfall2";
// 全局引入UI库 vant
import "@/plugins/vant";
//  全局引入 过滤器
import "@/config/filter";
// import './assets/iconfont/iconfont.css'
import "./icons"; // icon
import "./assets/scss/base.scss";
import "./assets/scss/pcBase.scss";
// 全局引入rem
// import '@/config/rem'
// 移动端适配
import "lib-flexible/flexible.js";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import BaiduMap from "vue-baidu-map";
Vue.use(Element, {
  size: "small", // set element-ui default size
});
Vue.config.productionTip = false;

// 解决移动端点击延迟200ms的问题
if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      FastClick.attach(document.body);
    },
    false
  );
}

FastClick.prototype.focus = function(targetElement) {
  var length;
  if (
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month"
  ) {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

Vue.use(BaiduMap, {
  ak: "1ba5c792d7a80dcda3b617dceb7012f7",
});

Vue.use(waterfall);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
