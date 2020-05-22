<template>
  <div class="login">
    <div class="middle-wrapper">
      <div class="login-form clearfix">
        <div class="login-left">
          <img src="@/assets/images/login-logo.png"
               alt="">
        </div>
        <div class="login-right">
          <el-form ref="loginForm"
                   :model="form"
                   :rules="rules">
            <el-form-item>
              <h3 class="til">用户名登录</h3>
            </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="form.username"
                        placeholder="请输入账号">
                <i slot="prefix"
                   class="iconfont icon-yonghuming"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input :type="passwordType"
                        v-model="form.password"
                        placeholder="请输入密码">
                <i slot="prefix"
                   class="iconfont icon-mima1"></i>
                <i slot="suffix"
                   class="el-input__icon el-icon-view toggle-see"
                   @click="togglePasswordType"></i>
              </el-input>
              <p v-if="isTips"
                 class="tips">{{tips}}</p>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
              <el-col>
                <el-form-item>
                  <el-button type="primary"
                             class="login-btn"
                             @click="login('loginForm')">
                    登录
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from '../../router/index'
export default {
  data () {
    return {
      passwordType: 'password',
      isTips: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      tips: '账户或密码错误!'
    }
  },
  created: function () {
    var that = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key == 13) {
        that.login('loginForm')
      }
    }
  },
  methods: {
    // 密码明文切换
    togglePasswordType () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    // 登录
    login (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$router.push({ path: '/home' }) // 测试
          // 登录接口
          // const loading = this.$loading({
          //   lock: true,
          //   text: '正在登录，请稍后...',
          //   background: 'rgba(0, 0, 0, 0.7)'
          // });
		  var data = {
            userName: this.form.username,
            password: this.form.password,
		  }
		this.$api.getToken(data).then(res => {
			if(res){
				var data = {
				    token:res
				  }
				localStorage.setItem('token', res);
				this.$api.getUserInfo(data).then(res => {
					if(res){
						localStorage.setItem('user', JSON.stringify(res));
						router.push('/index');
					}
				}).catch(err => {
					console.log(err);
				})
			}else{
				this.$message.warning('用户名密码错误！')
			}
		}).catch(err => {
			console.log(err);
		})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  /deep/ .el-input__prefix {
    left: 5px;
    right: auto;
  }

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(../../assets/images/login-bg.png);
  .login-form {
    background: #fff;
    border-radius: 14px;
    width: 700px !important;
    padding: 0 !important;
    display: flex;
    .login-left {
      text-align: center;
      padding-top: 50px;
      box-sizing: border-box;
      background: url(../../assets/images/login-pic.png) no-repeat bottom
        #3aa6ff;
      background-size: 300px;
      width: 350px;
      height: 400px;
      border-radius: 5px 0 0 5px;
    }
    .login-right {
      flex: 1;
      box-sizing: border-box;
      justify-content: center;
      align-items: center;
      display: flex;
    }
    .el-form-item {
      margin-bottom: 25px;
    }
    .iconfont {
      font-size: 20px;
      // color: #004EA2;
    }
    .toggle-see {
      cursor: pointer;
    }
    .til {
      font-size: 20px;
      color: #333;
      font-weight: 400;
      text-align: center;
    }
    .tips {
      color: red;
      font-size: 12px;
      position: absolute;
      line-height: 22px;
    }
  }
  .middle-wrapper {
    position: fixed;
    width: 100%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-60%);
    .login-form {
      position: relative;
      margin: 0 auto;
      width: 520px;
      padding: 30px 50px;
      box-sizing: border-box;
      border-radius: 5px;
      background-color: #ffffff;

      .el-form-item__content {
        &:last-child {
          margin-bottom: 0;
        }

        .login-btn {
          width: 100%;
          font-size: 16px;
          background: #df8715;
          border-color: #df8715;
        }
      }
      .check-code-wrapper {
        display: flex;
        justify-content: space-between;
        height: 40px;
        .yanzhengma-wrapper {
          flex: 0 1 auto;
        }
        .validate-code-wrapper {
          flex: 0 0 160px;
        }
      }
    }
  }
}
</style>
