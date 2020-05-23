<template>
	<div class="internal-change common-table">
		<!-- 搜索条件 -->
		<el-form ref="searchDiv":inline="true" :model="formInline" class="demo-form-inline">
			<div>
				<el-form-item label="名称" label-width="75px">
					<el-input v-model="formInline.name"></el-input>
				</el-form-item>
				<el-form-item label="机构">
					<el-input v-model="formInline.department"></el-input>
				</el-form-item>
				<el-form-item label="科目:" prop="subject">
					<el-select
						style="display: inline-block;width: 202px"
						class="yanshiZiJi"
						@change="getSubjectType"
						v-model="formInline.subject"
						filterable
						placeholder="请选择"
					  >
						<el-option
						  v-for="item in Subject"
						  :key="item.Guid"
						  :label="item.SubjectName"
						  :value="item.Guid"
						></el-option>
					  </el-select>
				</el-form-item>
			<el-form-item label="考试开始时间:" prop="dateBegin">
				<el-date-picker v-model="formInline.dateBegin" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="考试结束时间:"  prop="dateEnd">
				<el-date-picker v-model="formInline.dateEnd" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="list" icon="el-icon-search" size="mini">搜索</el-button>
				<el-button type="primary" @click="addrouter" icon="el-icon-edit" size="mini">添加</el-button>
			</el-form-item>
			</div>
			<div>
				<el-form-item label="选择文件" class="select-file">
					<el-upload ref="template" class="upload-demo" :before-upload="beforeTemplateUpload" :action="importTemplateUrl"
					 :on-preview="handleTemplatePreview" :on-remove="handleTemplateRemove" :before-remove="templatebeforeRemove"
					 :file-list="formData.file" :on-success="templateImportSuccess" :on-error="templateImportError" :limit="1"
					 :on-exceed="handleTemplateExceed" :on-change="handleTemplatechange" :headers="headers" accept=".xls,.xlsx"
					 :disabled="callFlag" :auto-upload="false">
						<el-button slot="trigger" size="small" height="28px" class="primary-btn" :disabled="callFlag || importFlag">浏览
						</el-button>
						
						<el-button size="small" height="28px" class="primary-btn template-upload" @click="submitTemplateUpload"
						 :disabled="callFlag || importFlag">导入
						</el-button>
						<el-button size="small" @click="downloadDoc" :disabled="callFlag" class="download">下载模板
						</el-button>
					</el-upload>
				</el-form-item>
			</div>
		</el-form>
		
		<el-table :data="tableData" style="width: 100%" border class="table-box"
		 row-key="key" v-loading="loading" :height="tableH"  @sort-change="sortChange">
			<el-table-column :show-overflow-tooltip="true" prop="Name" label="姓名" sortable="custom"></el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="Subject" label="科目" sortable="custom"></el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="SubjectType" label="科目类型" sortable="custom"></el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="AchieveDate" label="考试时间" sortable="custom">
				<template slot-scope="scope">
					<span>{{scope.row.AchieveDate?scope.row.AchieveDate.split('T')[0]:""}}</span>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="Score" label="得分" sortable="custom"></el-table-column>
		
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="mini" @click.native="editSource(scope.row)">修改</el-button>
					<el-button size="mini" @click="deleteSource(scope.row.Guid, scope.$index)" type="danger">删除</el-button>
					<!-- <el-button size="mini"  @click="jurisdiction(scope.row.id)" type="primary" plain>权限配置</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="block pagination">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" background
			 layout="total, prev, pager, next, jumper" :total="totalCount" :current-page.sync="currentPage"></el-pagination>
		</div>

		<!-- 添加成绩 -->
		<el-dialog :title="action+'成绩'" top="30vh" append-to-body :visible.sync="equipDialog" width="1000px" class="add-Equip">
			<add-source @source="source" :guid="guid"></add-source>
		</el-dialog>
	</div>
</template>
<script>
	import {
		getTime
	} from "../../common/until";
	import addSource from "./addSource";


	export default {
		props: {
			paramList: {
				type: Object
			}
		},
		components: {
			addSource,
		},
		data() {
			return {
				action:"添加",
				guid:"",
				tableH:'',
				formInline:{
					Name:"",
				},
				Subject:[],
				loadingTrue: "", // loading框
				fileList: [], // 选中的模板  是个数组
				mokuaiRen: [], // 选择模块 => 下面的人集合
				data: [], // 选择模块的组织架构
				defaultProp: {
					children: "children",
					label: "displayName"
				},
				isModule: false, // 是否存在模块  初始化给的
				BGJingLi: {}, // 变更经理
				innerVisible: false, // 使用人选择弹出显示
				callFlag: false, // 提交之后 所有按钮不可点
				addFlag: false, // 新增 （新增和导入互斥）
				importFlag: false, // 导入 （新增和导入互斥）
				innerVisible: false, // 使用人选择弹出显示
				submitFlag: true,
				submitSuccessId: "",
				currentCollapse: ["1", "2", "3", "4"],
				headers: {
					token: localStorage.getItem("token")
				},
				equipArr: [],
				isHistory: false,
				isTodo: false,
				childId: "",
				approveHistory: [],
				formData: {
					processId: "", //
					status: "",
					applyDate: "",
					subject: "",
					applicant: "",
					telephone: "",
					order: "",
					file: [],
					uploadFile: [],
					participation: "",
					planTime: "",
					provider: "", //
					projectNum: "", //
					projectName: "" //
				},
				fileRefIds: [],
				arr: [],
				defaultExpandAll: true,
				defaultJoinId: [],
				joinUser: [],
				checkedtemplates: [],
				submitTemplate: [],
				mainTemplatecachedId: "",
				equipDialog: false,
				purchaseOrder: [],
				templateList: [],
				tableData: [],
				loading: false,
				participantList: [],
				emptyText: "正在加载...",
				defaultProps: {
					children: "children",
					label: "name"
				},
				nowUsingMan: [],
				userData: [],
				selectedUser: [], //当前选中的
				prevSelectedUser: [], //记录上次选中的
				numPrevCode: 0, //记录是不是第一次点击
				allSelectedUser: [], //
				MarkCurrentFlag: true,
				cancelSelectedUser: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 默认每页显示的条数（可修改）
				pageSize: 20,
				pageCount: 5,
				pages: {}, // 结构树分页数据
				deptNum: 0,
				positionCode: [],
				value: "",
				importTemplateUrl: this.$api.url+"/api/Personalscroce/ImportPersonalScoreExcel",
				sord:""
			};
		},
		methods: {
			getSubjectType(guid){
				this.$forceUpdate();
			},
			//获取科目信息
			getSubject(){
				this.$api.getSubject("").then(res => {
					if (res&&res.length>0) {
						this.Subject = res;
						this.formInline.subject = res[0].Guid;
						this.getLasted();
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			//获取最新考试时间
			getLasted(){
				this.$api.getLatesd("").then(res => {
					if (res) {
						this.formInline.dateEnd = res;
						this.formInline.dateBegin = res.substring(0,4)+"-01-01";
						this.list();
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			//获取成绩信息
			list() {
				let data = {
					pid: "",
					name: this.formInline.name,
					department: this.formInline.department,
					subject: this.formInline.subject,
					dateBegin: this.formInline.dateBegin,
					dateEnd: this.formInline.dateEnd,
					'pageModel.pageIndex': this.currentPage,
					'pageModel.pageSize': this.pageSize,
					orderby:this.sord?this.sord:"",
				};
				this.$api.getPageScroces(data).then(res => {
					this.tableData = res.data;
					this.totalCount = res.pageModel.PageCount;
				}).catch(err => {
					console.log(err);
				})
			},
			source(){
				this.list();
				this.equipDialog = false;
			},
			//下载模板
			downloadDoc(){
				const url = this.$api.url+'/template/成绩录入模板.xlsx';
				const link = document.createElement('a');
				let fname = '成绩录入模板';
				link.href = url;
				link.setAttribute('download', fname);
				document.body.appendChild(link);
				link.click();
			},
			// 点击导入浏览
			getTemplate() {
				this.$refs.template.clearFiles()
				this.tableData = []
				this.formData.file = []
			},


			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
			},

			// 选择模板
			handleCheckedTemplates(value) {
				var _this = this;
				_this.checkedtemplates = value;
			},

			// 选择单个模板进行下载
			getClickedTemplate(value) {
				var _this = this;
				if (_this.templateList.length > 0) {
					var url = _this.templateList[0].url;
				}
				var loading = this.$loading({
					lock: true,
					text: "下载中，请稍后...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				axiosGet(url).then(result => {
					if (result.code == 200) {
						window.location.href = _this.constApi + result.data;
						loading.close();
					}
				});
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
					text: "正在导入，请稍后...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				this.tableData = [];
			},

			// 导入模板成功
			templateImportSuccess(response, file, filelist) {
				this.loadingTrue.close();
				var _this = this;
				if (response.code === 200) {
					_this.$message({
						message: "导入成功",
						type: "success"
					});
					_this.formData.file = filelist;
					_this.mainTemplatecachedId = response.data.cacheId;
					_this.tableData = response.data.data;
					_this.totalCount = _this.tableData.length;
					this.$refs.ruleForm.clearValidate("file");
					this.addFlag = true;
				} else {
					_this.$message.error(response.data);
				}
			},

			templateImportError(response, file, filelist) {
				this.loadingTrue.close();
				this.$message.error(response.message);
			},

			templatebeforeRemove(file, fileList) {
				var _this = this;
				this.addFlag = false;
				return this.$confirm(`确定移除 ${file.name}？`, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				});
			},

			handleTemplateRemove(file, fileList) {
				this.tableData = [];
			},

			handleTemplateExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`);
			},

			// 你所选中文件的信息
			handleTemplatechange(file, fileList) {
				this.fileList = fileList;
			},
			// 新增按钮跳转
			addrouter() {
				this.action = "添加";
				this.guid = "";
				this.equipDialog = true;
			},
			editSource(row) {
				this.action = "修改";
				this.equipDialog = true;
				this.$nextTick(function(){
					this.guid = row.Guid;
				})
			},
			// 删除成绩
			deleteSource(id, index) {
				this.$confirm('确认删除？')
					.then(_ => {
						this.$api.deleteScroces({guid:id}).then(res => {
							if (res) {
								this.$message.success('删除成功！')
								this.list();
							} else {
								this.$message.warning('删除失败')
							}
						}).catch(err => {
							console.log(err);
						})
					})
					.catch(_ => {})
			},
			//自定义排序
			sortChange(column, prop, order) {
				if(column.order == 'ascending'){
					this.sord = column.prop+' asc';
				}else if(column.order == 'descending'){
					this.sord = column.prop+' desc';
				}
				this.list();
			},
		},
		mounted() {
			this.getSubject();
			this.$nextTick(()=>{
				this.tableH = document.documentElement.clientHeight - 80 -this.$refs.searchDiv.$el.clientHeight-130;
			})
		}
	};
</script>
<style lang="scss">
	
	.common-table{
			padding:20px 15px;
		}

	.internal-change {
		.add-Equip /deep/ .el-input__inner {
			width: 202px;
		}

		.collapse-title {
			flex: 1 0 90%;
			order: 1;
		}


		.row-list {
			.el-form-item__content {
				width: 180px;
			}

			.el-form--inline .el-form-item__content,
			.el-date-editor.el-input,
			.el-date-editor.el-input__inner {
				width: 100% !important;
			}
		}

		.el-date-editor.el-input {
			width: 180px;
		}

		.el-pagination__editor.el-input .el-input__inner {
			width: 40px !important;
		}

		.btn-group {
			display: block;
			text-align: center;
			padding: 20px 0;

			.el-button.is-disabled {
				opacity: 0.6;
			}
		}

		.el-input__icon {
			height: 30px;
			line-height: 30px !important;
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

		.pagination {
			text-align: center;
			margin: 10px 0 10px;
		}

		.pop-participation {
			.el-dialog {
				width: 1000px;
				height: 615px;

				.p-heading {
					.el-col-8 {
						padding-left: 5px;
						box-sizing: border-box;
					}
				}

				.participation-info {
					>div {
						height: 445px;
						box-sizing: border-box;
						border-left: 2px solid #eee;
						overflow: auto;
					}
				}
			}

			.sb-join {
				position: absolute;
				left: 50%;
				bottom: 30px;
				transform: translateX(-50%);
			}
		}

		/deep/ .el-collapse {
			border-bottom-color: #fff;
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

		.el-tree__empty-text {
			left: 0;
			top: 0;
			transform: translate(0, 0);
			color: #606266;
		}

		.el-table--fit {
			border: 1px solid #fff;
			width: 100%;
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

		.el-table__body-wrapper {
			overflow-y: auto;
		}

		.ment-input {
			width: 90%;
			height: 30px;
			position: absolute;
			top: 10px;
		}
	}
	.el-dialog__body {
		padding: 40px 20px !important;
	}
	.el-input{
		width:180px !important;
	}
</style>
