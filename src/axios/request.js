import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '../router/index'
import {
    getToken
} from './auth'
// 创建axios 实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // timeout: 10000, // 请求超时时间
  headers: {
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

// request 拦截器
service.interceptors.request.use(
    config => {
        let url = config.url;
        // console.log(url);
        // console.log(url.indexOf("SSOAuth")=='-1')
        if (url.indexOf("SSOAuth")=='-1') {
            let tokeid = window.localStorage.getItem('token');
            config.headers.common['Authorization'] = tokeid;
            config.headers.common['appkey'] = "_0HpusonrxaXfR3HbRU11On-z_xGglq1ykIHxudI6KxmVBoZRfu2XuVlB0qA";
			
		}
        if (config.method=='post'){
			config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; 
            config.data = qs.stringify(config.params);
        }
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    if(error.response.status){
    // console.log(JSON.parse(JSON.stringify(error)))
    if (error.response.status == 401 || error.response.status == 403) {
      // message.error('token信息过期请重新登陆', 3)
      window.localStorage.removeItem('token');
      router.push('/login')
    }
    }else{
      console.log('Response未返回状态信息');
    }
    // 这里处理一些response 出错时的逻辑
    return Promise.reject(error)
  }
)
export default service
