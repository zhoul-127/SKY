<style lang="scss" scoped>
	.jur-dialog /deep/ .el-dialog__body {
  height: 450px;
  overflow: auto;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
<template>
	<div class="jsadmin">
		<!-- 搜索条件 -->
		<el-form ref="searchDiv" :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="名称">
				<el-input v-model="formInline.user"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="roleList" icon="el-icon-search" size="mini">搜索</el-button>
				<el-button type="primary" @click.native="addRoleForm" icon="el-icon-edit" size="mini">添加</el-button>
			</el-form-item>
			<el-form-item style="float:right">
				<!-- <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button> -->
			</el-form-item>
		</el-form>
		<!-- 用户添加 -->
		<add-rolefrom :dialogAddUser.sync="addVisible" :userId="userId"></add-rolefrom>
		<!-- 表格 -->
		<el-table ref="multipleTable" :data="tableData"  border  :height="tableH">
			<el-table-column prop="Name" label="姓名" sortable>
			</el-table-column>
			<el-table-column prop="Company" label="公司" sortable width="150">
			</el-table-column>
			<el-table-column prop="Department" label="单位" sortable>
			</el-table-column>
			<el-table-column prop="Level" label="级别" sortable>
			</el-table-column>
			<el-table-column prop="BrithDate" label="出生年月" width="110" sortable>
				<template slot-scope="scope">
					<span>{{scope.row.BrithDate?scope.row.BrithDate.split('T')[0]:""}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Age" label="年龄" sortable>
			</el-table-column>
			<el-table-column prop="EnlistedDate" label="入伍年月" width="110" sortable>
				<template slot-scope="scope">
					<span>{{scope.row.EnlistedDate?scope.row.EnlistedDate.split('T')[0]:""}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="PoliticalFace" label="政治面貌" width="110" sortable>
			</el-table-column>
			<el-table-column prop="Education" label="文化程度" width="110" sortable>
			</el-table-column>
			<el-table-column prop="Nation" label="民族" sortable>
			</el-table-column>
			<el-table-column prop="NavtivePlace" label="籍贯" sortable>
			</el-table-column>
			<el-table-column prop="Height" label="身高" sortable>
			</el-table-column>
			<el-table-column prop="Weight" label="体重" sortable>
			</el-table-column>
			<el-table-column prop="Bust" label="胸围" sortable>
			</el-table-column>
			<el-table-column prop="Waist" label="腰围" sortable>
			</el-table-column>
			<el-table-column prop="BMI" label="BMI" sortable>
			</el-table-column>
			<el-table-column prop="PBF" label="PBF" sortable>
			</el-table-column>

			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="mini" @click.native="editRoleForm(scope.row)">修改</el-button>
					<el-button size="mini" @click="deleteRole(scope.row.Guid, scope.$index)" type="danger">删除</el-button>
					<!-- <el-button size="mini"  @click="jurisdiction(scope.row.id)" type="primary" plain>权限配置</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="text-center">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
			 background layout="total, prev, pager, next, jumper" :total="totalCount">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import addRoleForm from './addRoleForm.vue'
	export default {
		data() {
			return {
				addVisible: false, // 添加用户弹窗控制
				formInline: { // 搜索内容
					user: '',
				},
				userId: '', // 组件传参
				tableData: [],
				value: true, // 表格-状态
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 个数选择器（可修改）
				pageSizes: [10, 20, 30, 40],
				// 默认每页显示的条数（可修改）
				PageSize: 10,
				data: [],
				tableH:''
			}
		},
		created() {
			this.roleList();
			this.$nextTick(()=>{
				this.tableH = document.documentElement.clientHeight - 80 -this.$refs.searchDiv.$el.clientHeight-130;
			})
		},
		components: {
			'add-rolefrom': addRoleForm,
		},
		methods: {
			// 当前页码
			handleCurrentChange(val) {
				// 改变默认的页数
				this.currentPage = val;
				this.roleList()
			},
			// 角色列表
			roleList() {
				let data = {
					queryJson: JSON.stringify({
						"Name": this.formInline.user
					}),
					'pageModel.pageIndex': this.currentPage,
					'pageModel.pageSize': this.PageSize,
				};
				this.$api.userList(data).then(res => {
					this.tableData = res.data
					this.totalCount = res.pageModel.PageCount
				}).catch(err => {
					console.log(err);
				})
			},
			// 删除用户
			deleteRole(id, index) {
				this.$confirm('确认删除？')
					.then(_ => {
						this.$api.saveUser({guid:id}).then(res => {
							if (res) {
								this.$message.success('删除成功！')
								this.roleList();
							} else {
								this.$message.warning('删除失败')
							}
						}).catch(err => {
							console.log(err);
						})
					})
					.catch(_ => {})
			},
			// 导出表格excal
			ExportData() {
				import("@/vendor/Export2Excel").then(excel => {
					// 表格的表头列表
					const tHeader = ["名称", "别名"]
					// 与表头相对应的数据里边的字段
					const filterVal = ['roleName', 'roleFlag']
					const list = this.tableData
					const data = this.formatJson(filterVal, list)
					// 这里还是使用export_json_to_excel方法比较好，方便操作数据
					excel.export_json_to_excel(tHeader, data, '角色管理')
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					if (j === 'timestamp') {
						return parseTime(v[j])
					} else {
						return v[j]
					}
				}))
			},
			addRoleForm: function() {
				this.userId = "";
				this.addVisible = true
			},
			editRoleForm: function(row) {
				this.userId = row.Guid;
				this.addVisible = true
			},
			// 关闭弹窗
			hidePanel() {
				this.dialogVisible = false
			},
			// 请求接口，获取权限结构数据
			getMenus(context, arg) {
				axiosGet('base/api/getRoleApiMenu').then(res => {
					if (res.code === 200) {
						this.department = res.data
						// console.log(res.data)
					}
				})
			},
			// 获取已勾选权限
			jurisdiction(id) {
				var _this = this;
				this.data = []
				this.roleId = id
				this.dialogVisible = true;
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys([]);
				})

				axiosGet('base/role/getRoleApi?roleId=' + this.roleId).then(res => {
					if (res.code === 200) {
						let arr = []
						if (res.data.length > 0) {
							res.data.forEach(item => {
								arr.push(item.apiId)
							})
						}
						setTimeout(function() {
							arr.forEach(item => {
								_this.$refs.tree.setChecked(item, true, false);
							})

						}, 500)
						// this.$refs.tree.setCheckedNodes(arr);
						// this.$refs.tree.setCheckedKeys(arr, false)
					}
				})
			},
			// 选择权限-确定
			departmentOk() {
				this.jurisd = [];
				// console.log(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
				let selectedNodes = this.$refs.tree.getCheckedKeys();
				let halfSelectedNodes = this.$refs.tree.getHalfCheckedKeys();
				this.jurisd = [...selectedNodes, ...halfSelectedNodes]
				if (!this.jurisd.length) {
					this.$message.warning('至少需要一个配置项');
					return;
				}
				axiosPost('base/role/add-apis', {
					roleId: this.roleId,
					apiIds: this.jurisd
				}).then(result => {
					if (result.code === 200) {
						this.$message('配置成功')
						// 关闭弹窗
						this.hidePanel()
					} else {
						result.data.length > 0 ? this.$message.warning(result.data[0]) : this.$message.warning(result.message)
					}
				})
			}
		}
	}
</script>
