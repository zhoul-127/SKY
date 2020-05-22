/*
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-26 16:06:52
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-25 16:53:18
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Print from 'vue-print-nb'
import { loadScript } from 'esri-loader'
import api from './api'

// 引入elementui组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$api=api;
import './assets/css/base.scss'
import './assets/iconfont/iconfont.css'
Vue.use(ElementUI)
Vue.use(Print)

Vue.config.productionTip = false


// 引入mockjs
// require('./mock.js')

// const options = {
//   url: 'http://10.40.19.41:7005/arcgis/common/arcgis/3.29/init.js',
//   css: false
// }
// loadScript(options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
