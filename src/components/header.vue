<template>
	<div class="header">
		<div class="top-login">
			<div class="headLeft">
				<h1 class="logo">
					<img src="@/assets/images/login-logo.png" alt="">
				</h1>
				<el-menu :default-active="activeIndex" class="el-menu-demo header-menu" mode="horizontal">
					<el-menu-item :index="''+ ++index" v-for="(item,index) in headerMenus" :key="index" @click="toPath(item.apiUrl)">
						{{item.name}}
					</el-menu-item>
				</el-menu>
			</div>
			<ul class="operation">
				<li>
					<img src="@/assets/images/head-img.png" alt="" class="pic">
					欢迎,{{user.UserName}}
				</li>
				<li class="line"></li>
				<!-- <li>
          <i class="iconfont icon-xiugai1"></i>
          <router-link to="/changePassword">修改密码</router-link>
        </li> -->
				<li class="line"></li>
				<li @click="dialogVisible = true">
					<div class="loginout">
						<i class="iconfont icon-zhuxiao"></i>
						注销
					</div>
				</li>
			</ul>
			<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<span>是否确定退出系统！</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false" size="small">取 消</el-button>
					<el-button type="primary" @click="loginout" size="small">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import router from '../router/index'
	export default {
		data() {
			return {
				headerMenus: [{
					apiUrl: "jsadmin",
					childMenu: [],
					createTime: "2019-07-10T15:15:57",
					cssClass: "el-icon-notebook-2",
					id: "ASSET1E0-0002-0001-0001-000100000000",
					isMenu: false,
					name: "用户管理",
					parentId: "ASSET1E0-0002-0001-0001-000000000000",
					sortNum: 1,
					status: 1
				}, {
					apiUrl: "source",
					childMenu: [],
					createTime: "2019-07-10T15:15:57",
					cssClass: "el-icon-notebook-2",
					id: "ASSET1E0-0002-0001-0001-000100000000",
					name: "成绩管理",
					parentId: "ASSET1E0-0002-0001-0001-000000000000",
					sortNum: 1,
					status: 1
				}],
				activeIndex: '1',
				username: null,
				dialogVisible: false,
				user:{
					UserName:""
				}
			}
		},
		created() {
			if(localStorage.getItem('user')){
				this.user = JSON.parse(localStorage.getItem('user'));
			}else{
				router.push('/login')
			}
		},
		methods: {
			loginout() {
				this.dialogVisible = false
				// 1. 清除登录状态，即删除保存在localStorage中的token
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				localStorage.removeItem('routes')
				localStorage.removeItem('menus')
				localStorage.removeItem('jurisd')
				localStorage.removeItem('firstLogin')
				// 2. 跳转到登录页面
				this.$router.push({
					path: '/login'
				})
			},
			toPath(url) {
				this.$router.push({
					path: url
				})
			},
			// 取消按钮关闭弹窗
			handleClose() {
				this.dialogVisible = false
			}
		},
	}

</script>

<style lang="scss">
	.headLeft {
		display: flex;
	}

	.el-menu {
		background: none !important;
		border-bottom: none !important;
	}

	.el-menu--horizontal>.el-menu-item.is-active {
		border-bottom: 4px solid #DF8003 !important;
		color: #fff !important;
	}

	.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
	.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
		color: #fff !important;
	}

	.el-menu--horizontal>.el-menu-item {
		height: 80px !important;
		line-height: 80px !important;
	}

	.header-menu {
		.el-menu-item {
			padding: 0 !important;
			margin: 0 20px !important;
			font-size: 16px !important;
			background: #3b93ec !important;
			color: #fff !important;
		}
	}

	.top-login {
		height: 80px;
		line-height: 80px;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		padding: 0 30px;

		.logo {
			display: flex;
			align-items: center;
			margin: 0 40px 0 20px;

			img {
				width: 124px;
				height: 60px;
			}
		}

		.operation {
			a {
				color: #fff;
			}

			i {
				margin-right: 10px;
			}

			.pic {
				margin-right: 10px;
				width: 40px;
				height: 40px;
			}

			li {
				float: left;
				color: #fff;
				font-size: 14px;
			}

			.line {
				margin: 0 14px;
				width: 1px;
				height: 18px;
				background: #ccc;
				margin-top: 32px;
				opacity: .3;
			}

			.loginout {
				background: #EE5050;
				height: 26px;
				line-height: 26px;
				padding: 0 10px;
				margin-top: 28px;
				font-size: 14px;
				border-radius: 3px;
				cursor: pointer;

				i {
					margin-right: 0;
					font-size: 16px;
				}
			}
		}

		h1 {
			color: #666;
		}
	}

	.el-menu.el-menu--horizontal {
		border: 0;
	}

	.el-dialog__header,
	.el-dialog__body,
	.el-dialog__footer {
		line-height: 30px;
	}
</style>
