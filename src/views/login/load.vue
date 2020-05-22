<template>
  <div class="loading">
	<!-- <img src="@/assets/images/loading.gif" width="60" alt=""> -->

  </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
    data() {
		return {

		}
    },
  	created() {
  		//从OA过来自动登陆
  		this.autoLogin();
  	},
    methods: {
	  	autoLogin() {
		  	const loading = this.$loading({
		        lock: true,
		        text: '正在登陆',
		        background: 'rgba(0, 0, 0, 0.7)'
		    });
		    console.log(this.$route.query)
		  	axiosPost('/auth/oalogin', {
			    username: this.$route.query.username,
			    randomkey: this.$route.query.randomkey,
			    token: this.$route.query.token
		  	}).then(result => {
		  	    if (result.code === 200) {
			      // 菜单接口 vuex
				    this.$store.dispatch('getMenus')
			      	axiosGet('base/user/getUser', { showLoading: true, loginFlag: 'login' }).then(result => {
			        // 本地存储用户信息
			        	localStorage.setItem('user', JSON.stringify(result.data))
			        	localStorage.setItem('reloadNum', '0')
			      	})

			        // 本地存储token
			        localStorage.setItem('token', result.data.token)
			        // 本地存储
			        localStorage.setItem('firstLogin', JSON.stringify(result.data.firstLogin))
		  	    } else {
		  	  		this.$message.warning(result.message);
		  	    }
		  	    loading.close();
		  	})  		
	  	}
    }
}
</script>
<style lang="scss" scoped>
.loading {
  background: #eee;
  background: url(../../assets/images/login-bg.png);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
