<template>
	<div class="header">
		<div class="top-login">
			<div class="headLeft">
				<h1 class="logo">
					<img src="@/assets/images/login-logo.png" alt="">
				</h1>
				<el-menu :default-active="activeIndex" class="el-menu-demo header-menu" mode="horizontal">

					<template v-for="(item,index) in headerMenus" >
						<el-menu-item :index="''+ ++index" v-if="!item.hasChildren" @click="toPath(item.apiUrl)">
							{{item.name}}
						</el-menu-item>
						<el-submenu :index="''+ ++index" v-if="item.hasChildren">
							<template slot="title">{{item.name}}</template>
							<el-menu-item  :index="''+ ++index+'-'+index2" v-for="(item2, index2) in item.children"  @click="toPath(item2.apiUrl)">
								{{item2.name}}
							</el-menu-item>
						</el-submenu>
					</template>

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
					name: "用户管理",
					hasChildren:false,
					children: [],
				}, {
					apiUrl: "",
					name: "成绩管理",
					hasChildren:true,
					children: [
						{
							apiUrl: "sourceAdd",
							name: "成绩录入",
							hasChildren:false,
							children: [],
						},
						{
							apiUrl: "source",
							name: "成绩汇总",
							hasChildren:false,
							children: [],
						}
					],
				},{
					apiUrl: "scoreAnalysis",
					name: "成绩分析",
					hasChildren:false,
					children: [],
				},{
					apiUrl: "fitnessAnalysis",
					name: "体能分析",
					hasChildren:false,
					children: [],
				}],
				activeIndex: "1",
				username: null,
				dialogVisible: false,
				user: {
					UserName: ""
				}
			}
		},
		created() {
			if (localStorage.getItem('user')) {
				this.user = JSON.parse(localStorage.getItem('user'));
			} else {
				router.push('/login')
			}
		},
		mounted(){
			var self = this;
			let menus = this.headerMenus;
			if (menus&&menus.length>0) {
			  menus.forEach((item, index) => {
			    if (item.hasChildren) {
			      item.children.forEach(v2 => {
			        if ('/' + item.apiUrl === self.$route.path || '/' + v2.apiUrl === self.$route.path) {
			          self.activeIndex = index+ 1+"";
			        }
			      })
			    }else{
					if ('/' + item.apiUrl === self.$route.path ) {
					  self.activeIndex = index+ 1+"";
					}
				}
			  })
			}
		},
		watch: {
		  '$route.path': function (newVal) {
			  
		  }
		},
		methods: {
			loginout() {
				this.dialogVisible = false
				// 1. 清除登录状态，即删除保存在localStorage中的token
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				localStorage.removeItem('routes')
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
		.el-submenu.is-active .el-submenu__title {
			border-bottom: 4px #DF8003 solid !important;
		}
	.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
	.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
		color: #fff !important;
	}


	.header-menu {
		.el-menu-item,.el-submenu__title {
			padding: 0 !important;
			margin: 0 20px !important;
			font-size: 16px !important;
			background: #0f1a4a !important;
			color: #fff !important;
			height: 80px !important;
			line-height: 80px !important;
			box-shadow: none !important;
		}
	}
	.el-submenu__title i {
	    color: #fff !important;
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
