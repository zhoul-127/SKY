import router from '@/router'
import store from '@/store'
import {
  getToken
} from './auth'
import { Progress } from 'ant-design-vue'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  Progress.start();
  if (getToken()) {
  
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      Progress.done()
    }
  }
})

router.afterEach(() => {
  Progress.done() // 结束Progress
})
