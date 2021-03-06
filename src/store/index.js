// 1. 导入vuex包
import Vuex from 'vuex'
import Vue from 'vue'
import { axiosGet } from '@/api/index.js'

// import { getMenus } from '@/api'

import router from '@/router'
import menu from '@/assets/menu.json'

// 2. 使用Vue.use()安装vuex这个插件
Vue.use(Vuex)

// 3. 创建一个store实例
const store = new Vuex.Store({
  state: {
    // 用于存放权限菜单列表
    menus: JSON.parse(localStorage.getItem('menus')) || [],
    // menus: menu, // 模拟菜单数据
    // 用于存放组装好的路由规则
    routes: JSON.parse(localStorage.getItem('routes')) || [],
    firstLogin: JSON.parse(localStorage.getItem('firstLogin')),
    unsealSubject:"启封 主题", //启封 主题
    unsealDetailList :[] //封存 选择list
  },
  mutations: {
    initroutes (state, routes) {
      state.routes = routes
    },
    initmenus (state, list) {
      state.menus = list
      // 数据保存成功后再跳转页面
      if (state.firstLogin === false) {
        console.log('a')
        router.push('/changePassword')
      } else {
        router.push('/task')
      }
    },
    handleUnsealSubject(state,params){
      state.unsealSubject=params;
      console.log(state);
    },
    handleUnsealDetail(state,params){
      state.unsealDetailList=params;
    }
  },
  actions: {
    getMenus (context, arg) {
      // 执行异步操作
      axiosGet('base/api/getMenu').then(res => {
        if (res.code === 200) {
          console.log(res.data)
          // Loading.service(options)
          localStorage.setItem('menus', JSON.stringify(res))
          localStorage.setItem('routes', JSON.stringify(res))
          localStorage.setItem('reloadNum', '0')
          context.commit('initmenus', res)
        }
      })
    },
    handleUnsealSubject({commit},params){
      commit('handleUnsealSubject',params);
    },
    handleUnsealDetail({commit},params){
      // 启封list
      commit('handleUnsealDetail',params);
    }
  }
})
// 4. 将store实例挂载到vue实例上

export default store
