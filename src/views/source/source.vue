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
				<el-date-picker v-model="formInline.dateBegin" @change="getSubjectType"  placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="考试结束时间:"  prop="dateEnd">
				<el-date-picker v-model="formInline.dateEnd" @change="getSubjectType" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="list" icon="el-icon-search" size="mini">搜索</el-button>
				<!-- <el-button type="primary" @click="addrouter" icon="el-icon-edit" size="mini">添加</el-button> -->
			</el-form-item>
			</div>
		</el-form>
		
		<el-table v-if="tableRefresh" :data="tableData" style="width: 100%" border class="table-box"
		 row-key="key"  :height="tableH">
		 <el-table-column :show-overflow-tooltip="true" prop="Name" label="姓名" sortable></el-table-column>
		 <el-table-column :show-overflow-tooltip="true" prop="Department" label="部门" sortable></el-table-column>
		 <el-table-column :show-overflow-tooltip="true" prop="Duty" label="职务" sortable></el-table-column>
			<el-table-column v-for="item in columnList" width="130" sortable :show-overflow-tooltip="true" :prop="item.prop" :label="item.label"></el-table-column>
			
		</el-table>
		<!-- 分页tableData.slice((currentPage-1)*pageSize,currentPage*pageSize) -->
		<!--< div class="block pagination">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" background
			 layout="total, prev, pager, next, jumper" :total="tableData.length" :current-page.sync="currentPage"></el-pagination>
		</div> -->

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
				columnList:[],
				tableH:'400',
				formInline:{
					Name:"",
					dateBegin: new Date(),
					dateEnd: new Date(),
					subject:""
				},
				Subject:[],
				// 默认显示第几页
				tableData:[],
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 默认每页显示的条数（可修改）
				pageSize: 20,
				pageCount: 5,
				pages: {}, // 结构树分页数据
				value: "",
				tableRefresh:true
			};
		},
		methods: {
			getSubjectType(guid){
				//debugger;
				// this.$forceUpdate();
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
				// this.formInline.dateBegin= new Date('2020-01-01')
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
				this.tableRefresh = false;
				this.$nextTick(()=>{
					this.tableRefresh = true;
					this.tableH = document.documentElement.clientHeight - 80 -this.$refs.searchDiv.$el.clientHeight-90;
				})
				if(!this.formInline.dateBegin ||!this.formInline.dateEnd){
						this.$message({
							message: "请先选择考试时间！",
							type: "warning"
						});
						return;
				}
				let data = {
					pid: "",
					name: this.formInline.name,
					department: this.formInline.department,
					subject: this.formInline.subject,
					dateBegin: this.formInline.dateBegin,
					dateEnd: this.formInline.dateEnd,
				};
				this.$api.getScroces(data).then(res => {
					this.tableData = [];
					this.columnList = [];
					for(var i=0;i<res.length;i++){
						var dataObj = res[i].Name;
						for(var j=0;j<res[i].Value.length;j++){
							if(i == 0){
							var obj = {
								prop:'Date'+j,
								label:res[i].Value[j].Date.split("T")[0],
								}
							this.columnList.push(obj);
							}
							dataObj['Date'+j] = res[i].Value[j].Score;
						}
						this.tableData.push(dataObj);
					}
				}).catch(err => {
					console.log(err);
				})
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
		},
		mounted() {
			this.getSubject();
		}
	};
</script>
<style lang="scss">
	// .bgBian:hover {
	//   background: #ccc;
	// }

	// .bgBian {
	//   padding-left: 10px;
	//   cursor: pointer;
	// }
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
