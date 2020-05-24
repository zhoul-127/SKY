<template>
	<div class="internal-change jsadmin">
		<!-- 搜索条件 -->
		<el-form ref="searchDiv" :inline="true" :model="formInline" class="demo-form-inline">
			<div>
				<el-form-item label="名称" label-width="75px">
					<el-input v-model="formInline.user"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="roleList" icon="el-icon-search" size="mini">搜索</el-button>
					<el-button type="primary" @click.native="addRoleForm" icon="el-icon-edit" size="mini">添加</el-button>
				</el-form-item>
			</div>
			<div>
				<el-form-item label="选择文件" class="select-file">
					<el-upload ref="template" class="upload-demo" :before-upload="beforeTemplateUpload" :action="importTemplateUrl"
					 :on-preview="handleTemplatePreview" :on-remove="handleTemplateRemove" :before-remove="templatebeforeRemove"
					 :file-list="formData.file" :on-success="templateImportSuccess" :on-error="templateImportError" :limit="1"
					 :on-exceed="handleTemplateExceed" :on-change="handleTemplatechange" :headers="headers" accept=".xls,.xlsx"
					  :auto-upload="false">
						<el-button slot="trigger" size="small" height="28px" class="primary-btn" >浏览
						</el-button>
						
						<el-button size="small" height="28px" class="primary-btn template-upload" @click="submitTemplateUpload"
						 >导入
						</el-button>
						<el-button size="small" @click="downloadDoc"  class="download">下载模板
						</el-button>
					</el-upload>
				</el-form-item>
			</div>
		</el-form>
		<!-- 用户添加 -->
		<add-rolefrom :dialogAddUser.sync="addVisible" :userId="userId"></add-rolefrom>
		<!-- 表格 -->
		<el-table ref="multipleTable" v-if="tableRefresh" :data="tableData"  border  :height="tableH" @sort-change="sortChange">
			<el-table-column prop="Name" label="姓名" sortable="custom">
			</el-table-column>
			<el-table-column prop="Company" label="公司" sortable="custom" width="150">
			</el-table-column>
			<el-table-column prop="Department" label="单位" sortable="custom">
			</el-table-column>
			<el-table-column prop="Duty" label="职务" sortable="custom">
			</el-table-column>
			<el-table-column prop="Level" label="级别" sortable="custom">
			</el-table-column>
			<el-table-column prop="BrithDate" label="出生年月" width="110" sortable="custom">
				<template slot-scope="scope">
					<span>{{scope.row.BrithDate?scope.row.BrithDate.split('T')[0]:""}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Age" label="年龄" sortable="custom">
			</el-table-column>
			<el-table-column prop="EnlistedDate" label="入伍年月" width="110" sortable="custom">
				<template slot-scope="scope">
					<span>{{scope.row.EnlistedDate?scope.row.EnlistedDate.split('T')[0]:""}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="PoliticalFace" label="政治面貌" width="110" sortable="custom">
			</el-table-column>
			<el-table-column prop="Education" label="文化程度" width="110" sortable="custom">
			</el-table-column>
			<el-table-column prop="Nation" label="民族" sortable="custom">
			</el-table-column>
			<el-table-column prop="NavtivePlace" label="籍贯" sortable="custom">
			</el-table-column>
			<el-table-column prop="Height" label="身高" sortable="custom">
			</el-table-column>
			<el-table-column prop="Weight" label="体重" sortable="custom">
			</el-table-column>
			<el-table-column prop="Bust" label="胸围" sortable="custom">
			</el-table-column>
			<el-table-column prop="Waist" label="腰围" sortable="custom">
			</el-table-column>
			<el-table-column prop="BMI" label="BMI" sortable="custom">
			</el-table-column>
			<el-table-column prop="PBF" label="PBF" sortable="custom">
			</el-table-column>

			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="mini" @click.native="editRoleForm(scope.row)">修改</el-button>
					<el-button size="mini" @click="deleteRole(scope.row.Guid, scope.$index)" type="danger">删除</el-button>
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
				tableH:'400',
				sord:'',
				tableRefresh:true,
				//导入 下载
				loadingTrue: "", // loading框
				fileList: [], // 选中的模板  是个数组
				submitFlag: true,
				headers: {
					token: localStorage.getItem("token")
				},
				formData: {
					file: [],
				},
				checkedtemplates: [],
				submitTemplate: [],
				equipDialog: false,
				purchaseOrder: [],
				templateList: [],
				importTemplateUrl: this.$api.url+"/api/Personalfiles/ImportPersonalfileExcel",
			}
		},
		created() {
			this.roleList();
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
				this.tableRefresh = false;
				this.$nextTick(()=>{
					this.tableRefresh = true;
					this.tableH = document.documentElement.clientHeight - 80 -this.$refs.searchDiv.$el.clientHeight-130;
				})
				let data = {
					queryJson: JSON.stringify({
						"Name": this.formInline.user
					}),
					orderby:this.sord?this.sord:"",
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
						this.$api.deleteUser({guid:id}).then(res => {
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
			//自定义排序
			sortChange(column, prop, order) {
				if(column.order == 'ascending'){
					this.sord = column.prop+' asc';
				}else if(column.order == 'descending'){
					this.sord = column.prop+' desc';
				}
				this.roleList();
			},

			handleTemplatePreview(file) {

			},
			// 导入模板 点击导入
			submitTemplateUpload() {
				if (this.fileList && this.fileList[0] && this.fileList[0].name) {
					this.$refs.template.submit();
				} else {
					this.$message({
						message: "请选择导入文件！",
						type: "warning"
					});
				}
			},

			// 上传模板之前
			beforeTemplateUpload(file) {
				this.loadingTrue = this.$loading({
					lock: true,
					text: "正在导入，请稍候...",
					background: "rgba(0, 0, 0, 0.7)"
				});
			},

			// 导入模板成功
			templateImportSuccess(response, file, filelist) {
				this.loadingTrue.close();
				var _this = this;
				if (response&&response.Message) {
					_this.$message({
						message: response.Message,
						type: "success"
					});
					_this.roleList();
				} else {
					_this.$message.error(response.Error);
				}
			},

			templateImportError(response, file, filelist) {
				this.loadingTrue.close();
				this.$message.error(response.Error);
			},

			templatebeforeRemove(file, fileList) {
				var _this = this;
				return this.$confirm(`确定移除 ${file.name}？`, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				});
			},

			handleTemplateRemove(file, fileList) {
				
			},

			handleTemplateExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`);
			},

			// 你所选中文件的信息
			handleTemplatechange(file, fileList) {
				this.fileList = fileList;
			},
			
			//下载模板
			downloadDoc(){
				const url = this.$api.url+'/template/人员导入模板.xlsx';
				const link = document.createElement('a');
				let fname = '人员导入模板';
				link.href = url;
				link.setAttribute('download', fname);
				document.body.appendChild(link);
				link.click();
			},
		}
	}
</script>
<style lang="scss" scoped>
	.jsadmin{
		padding:20px 15px;
	}
	.jur-dialog /deep/ .el-dialog__body {
  height: 450px;
  overflow: auto;
}

.el-form-item {
  margin-bottom: 15px;
}
.primary-btn.el-button {
			background: #3a8eff;
			color: #fff;
			border-color: #fff !important;
			height: 36px;
		}

		.primary-btn.el-button.is-disabled,
		.download.el-button.is-disabled {
			opacity: 0.6;
		}

		// .primary-btn > span {
		//   pointer-events: none!important;
		// }

		.download.el-button,
		.submit-btn.el-button {
			background: #004ea2;
			color: #fff;
			height:36px;
		}

		.upload-btn.el-button {
			background: #df8715;
			color: #fff;
			outline: none;
			border-color: #fff !important;
			margin-left: 20px;
		}

		.save-btn.el-button {
			background: #2fce6a;
			color: #fff;
		}

		.template-upload {
			height: 36px;
			margin-left: 18px;
		}

		.select-file {
			height: 30px;
			margin-right: 20px;

			.el-form--inline {
				.el-form-item__content {
					width: 400px !important;
				}
			}

			.el-upload {
				margin-left: 20px;

				&:focus {
					border-color: #fff;
				}
			}

			.el-upload-list__item.is-success .el-upload-list__item-name:focus {
				border-color: #fff !important;
				outline-width: 0px !important;
			}

			.upload-demo {
				height: 28px;
				line-height: 28px !important;
				display: flex;
				flex-direction: row;

				.el-upload-list {
					order: -1;
					padding-right: 10px;
					border: 1px solid #dcdfe6;
					height: 28px;
					line-height: 28px;
					position: relative;
					border-radius: 4px;
					width: 298px;
					overflow: hidden !important;

					.el-upload-list__item:first-child {
						margin-top: 0px;
						height: 28px !important;
					}

					.el-upload-list__item:hover {
						background: #fff;
					}
				}
			}
		}
		.download.el-button {
			background: #004ea2;
			color: #fff;
		}
		
		.upload-btn.el-button {
			background: #df8715;
			color: #fff;
			outline: none;
			border-color: #fff !important;
		}
		
		.impor-file {
			margin-right: 20px;
		
			.el-input__inner {
				width: 298px !important;
			}
		
			.el-form--inline .el-form-item__content {
				width: 298px;
			}
		}
		
		.import-file {
			border-bottom: 1px solid #eee;
			padding-left: 7px;
			height: 30px;
			position: relative;
		
			.empty-des {
				padding-top: 40px;
				color: #666;
				text-align: center;
		
				>div:first-child {
					font-size: 20px;
				}
			}
		
			.file-header {
				position: absolute;
				left: 0;
				top: 0;
			}
		
			.el-upload {
				width: 100%;
			}
		
			.el-form-item {
				width: 100%;
				position: relative;
			}
		
			.el-form-item__label {
				width: 98%;
				text-align: left;
			}
		
			.el-form-item__content {
				position: none;
				width: 100%;
			}
		
			.el-icon-plus {
				position: absolute;
				right: 0;
				top: 8px;
			}
		
			.el-upload-dragger {
				width: 100%;
				border-color: transparent;
				// display: none;
			}
		}
		.el-input {
		    width: 306px !important;
		    margin-right: 14px;
		}
</style>