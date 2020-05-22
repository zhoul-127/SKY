<template>
	<div>
		<!-- 添加用户-弹窗Form -->
			<el-form :model="addRoleForm" :rules="rules" ref="addRoleForm">
				<div>
					<el-form-item label="姓名:" :label-width="formLabelWidth" prop="Name">
						<el-input readonly="readonly" placeholder="请选择..." v-model="addRoleForm.Name" @focus="addrouter"></el-input>
					
					</el-form-item>
					<el-form-item label="科目:" :label-width="formLabelWidth" prop="Subject">
						<el-select
							style="display: inline-block;width: 202px"
							class="yanshiZiJi"
							@change="getSubjectType"
							v-model="addRoleForm.Subject"
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
					<el-form-item label="科目类型:" :label-width="formLabelWidth" prop="SubjectType">
						<el-input readonly="readonly"  v-model="addRoleForm.SubjectType" ></el-input>
					</el-form-item>
					<!-- <el-form-item label="科目类型:" :label-width="formLabelWidth" prop="SubjectType">
						<el-select
							style="display: inline-block;width: 202px"
							class="yanshiZiJi"
							v-model="addRoleForm.SubjectType"
							filterable
							placeholder="请选择"
						  >
							<el-option
							  v-for="item in SubjectType"
							  :key="item.Guid"
							  :label="item.SubjectName"
							  :value="item.SubjectName"
							></el-option>
						  </el-select>
					</el-form-item> -->
				</div>
				<div>
					<el-form-item label="考试时间:" :label-width="formLabelWidth" prop="AchieveDate">
						<el-date-picker v-model="addRoleForm.AchieveDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="得分:" :label-width="formLabelWidth" prop="Score">
						<el-input v-model="addRoleForm.Score"></el-input>
					</el-form-item>
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="hidePanel" size="small">取 消</el-button>
				<el-button type="primary" @click="addRoleSave('addRoleForm')" size="small">确 定</el-button>
			</div>
			<!-- 选择人员 -->
			<el-dialog title="选择人员" top="10vh" append-to-body :visible.sync="selectP" width="50%" class="add-Equip">
				<select-user @getEquipList = "getEquipList"></select-user>
			</el-dialog>
	</div>
</template>
<script>
	import selectUser from "./selectUser";
	import until from "../../common/until.js";
	export default {
		components: {
			selectUser,
		},
		props: { // 弹窗显示
			dialogAddUser: {
				type: Boolean,
				default: false
			},
			userId: {
				type: String,
				default: ""
			}
		},
		watch: {
			userId(val) {
				if (val) {
					let data = {
						'Guid': val
					};
					this.action = '修改'
					this.$api.getUserId(data).then(res => {
						this.addRoleForm = res;
					}).catch(err => {
						console.log(err);
					})
				}else{
					this.action = '添加'
					this.addRoleForm = {};
				}
			}
		},
		data() {
			// 验证表单
			var validateRoleName = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('输入不能为空'))
				} else {
					// if (value !== '') {
					// 	var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,18}$/
					// 	if (!reg.test(value)) {
					// 		callback(new Error('角色长度为2-18位'))
					// 	}
					// }
					callback()
				}
			}
			var validateRoleFlag = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('输入不能为空'))
				} else {
					if (value !== '') {
						var reg = /^\d+$|^\d+[.]?\d+$/
						if (!reg.test(value)) {
							callback(new Error('只能输入数字'))
						}
					}
					callback()
				}
			}

			return {
				addRoleForm: { // 添加用户表单输入

				},
				rules: { // 添加用户验证
					//Name: [{ required: true, message: '请选择科目', trigger: 'change' }],
					Subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
					SubjectType: [{ required: true, message: '请选择科目类型', trigger: 'change' }],
					AchieveDate: [{ required: true, message: '请选择考试时间', trigger: 'change' }],
					Score: [{
						required: true,
						validator: validateRoleFlag,
						trigger: 'blur'
					}]
				},
				formLabelWidth: '100px', // 添加用户输入框宽度
				action:'添加',
				selectP:false,
				Subject:[],
				SubjectType:[]
			}
		},
		mounted() {
			this.getSubject();
		},
		methods: {
			getSubject(){
				this.$api.getSubject("").then(res => {
					if (res) {
						// let resNew = []
						// let obj = {}
						// for (let i = 0; i < res.length; i++) {
						//   if (!obj[res[i].SubType]) { // name  对应数组中的name
						//     resNew.push(res[i])
						//     obj[res[i].SubType] = true
						//   }
						// }
						this.Subject = res;
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			getSubjectType(guid){
				var val = {};
				this.Subject.forEach(item=>{
					if(item.Guid == guid)
					val = item
				})
				this.addRoleForm.Subject = val.SubjectName;
				this.addRoleForm.SubjectType = val.SubType;
				this.addRoleForm.SubjectGuid = val.Guid;
				
				// this.$api.getSubjectType({type:val}).then(res => {
				// 	if (res) {
				// 		this.SubjectType = res;
				// 	} 
				// }).catch(err => {
				// 	console.log(err);
				// })
			},
			getEquipList(item){
				if(item.length>0){
					this.selectP = false;
					this.addRoleForm.Name = item[0].Name;
					this.addRoleForm.PGuid = item[0].Guid;
				}
			},
			// 选择人员跳转
			addrouter() {
				this.selectP = true;
			},
			// 添加角色确定
			addRoleSave(addRoleForm) {
				var that = this;
				this.$refs[addRoleForm].validate(valid => {
					if (valid) {
						that.$api.saveSource(that.addRoleForm).then(res => {
							if (res == true) {
								that.$message.success(that.action+'成功！')
								that.hidePanel()
							} else {
								that.$message.warning(that.action+'失败')
							}
						}).catch(err => {
							console.log(err);
						})
					}
				})
			},
			// 取消按钮关闭弹窗
			hidePanel() {
				this.$emit('source')
			}
		}
	}
</script>
<style lang="scss" scoped>

	.el-input {
		width: 200px !important;
	}

	.ment-input {
		width: 150px;
		height: 30px;
		position: absolute;
		top: 0;
	}

	.el-form-item {
		display: inline-block;
	}
	.dialog-footer{
		text-align: right;
	}
</style>
