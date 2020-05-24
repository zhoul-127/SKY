import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

import jsadmin from '@/views/personal/jsadmin.vue'
import login from '@/views/login/login.vue'
import index from '@/views/index.vue'
import source from '@/views/source/source.vue'
import sourceAdd from '@/views/source/sourceAdd.vue'
import scoreAnalysis from '@/views/scoreAnalysis/scoreAnalysis.vue'
import fitnessAnalysis from '@/views/fitnessAnalysis/fitnessAnalysis.vue'
Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index' // 路由重定向
    },
	  {
		path: '/login',
		name: 'login',
		component: login
	  },
    {
      path: '/index',
      name: 'index',
	  redirect:'jsadmin',
      component: index,
	  children:[
		  {
		    path: '/jsadmin',
		    name: 'jsadmin',
		    component: jsadmin
		  },
		  {
		    path: '/source',
		    name: 'source',
		    component: source
		  },
		  {
		    path: '/sourceAdd',
		    name: 'sourceAdd',
		    component: sourceAdd
		  },
		  {
		    path: '/scoreAnalysis',
		    name: 'scoreAnalysis',
		    component: scoreAnalysis
		  },
		  {
		    path: '/fitnessAnalysis',
		    name: 'fitnessAnalysis',
		    component: fitnessAnalysis
		  }
	  ]
    },
  ]
})
export default router
