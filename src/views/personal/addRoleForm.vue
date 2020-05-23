<template>
	<div>
		<!-- 添加用户-弹窗Form -->
		<el-dialog :title="action+'用户'" :visible.sync="dialogAddUser" :before-close="hidePanel" width="1000px">
			<el-form :model="addRoleForm" :rules="rules" ref="addRoleForm">
				<div>
					<el-form-item label="姓名:" :label-width="formLabelWidth" prop="Name">
						<el-input v-model="addRoleForm.Name"></el-input>
					</el-form-item>
					<el-form-item label="公司:" :label-width="formLabelWidth" prop="Company">
						<el-input v-model="addRoleForm.Company"></el-input>
					</el-form-item>
					<el-form-item label="单位:" :label-width="formLabelWidth" prop="Department">
						<el-input v-model="addRoleForm.Department"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="级别:" :label-width="formLabelWidth" prop="Level">
						<el-input v-model="addRoleForm.Level"></el-input>
					</el-form-item>
					<el-form-item label="出生年月:" :label-width="formLabelWidth" prop="BrithDate">
						<el-date-picker v-model="addRoleForm.BrithDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="年龄:" :label-width="formLabelWidth" prop="Age">
						<el-input v-model="addRoleForm.Age"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="入伍年月:" :label-width="formLabelWidth" prop="EnlistedDate">
						<el-date-picker v-model="addRoleForm.EnlistedDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="政治面貌:" :label-width="formLabelWidth" prop="PoliticalFace">
						<el-input v-model="addRoleForm.PoliticalFace"></el-input>
					</el-form-item>
					<el-form-item label="文化程度:" :label-width="formLabelWidth" prop="Education">
						<el-input v-model="addRoleForm.Education"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="民族:" :label-width="formLabelWidth" prop="Nation">
						<el-input v-model="addRoleForm.Nation"></el-input>
					</el-form-item>
					<el-form-item label="籍贯:" :label-width="formLabelWidth" prop="NavtivePlace">
						<el-input v-model="addRoleForm.NavtivePlace"></el-input>
					</el-form-item>
					<el-form-item label="身高:" :label-width="formLabelWidth" prop="Height">
						<el-input v-model="addRoleForm.Height"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="体重:" :label-width="formLabelWidth" prop="Weight">
						<el-input v-model="addRoleForm.Weight"></el-input>
					</el-form-item>
					<el-form-item label="胸围:" :label-width="formLabelWidth" prop="Bust">
						<el-input v-model="addRoleForm.Bust"></el-input>
					</el-form-item>
					<el-form-item label="腰围:" :label-width="formLabelWidth" prop="Waist">
						<el-input v-model="addRoleForm.Waist"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="BMI:" :label-width="formLabelWidth" prop="BMI">
						<el-input v-model="addRoleForm.BMI"></el-input>
					</el-form-item>
					<el-form-item label="PBF:" :label-width="formLabelWidth" prop="PBF">
						<el-input v-model="addRoleForm.PBF"></el-input>
					</el-form-item>
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="hidePanel" size="small">取 消</el-button>
				<el-button type="primary" @click="addRoleSave('addRoleForm')" size="small">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
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
					// 		callback(new Error('长度为2-18位'))
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
					Name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					Age: [{
						required: true,
						validator: validateRoleFlag,
						trigger: 'blur'
					}]
				},
				formLabelWidth: '100px', // 添加用户输入框宽度
				action:'添加'
			}
		},
		methods: {
			// 添加用户确定
			addRoleSave(addRoleForm) {
				var that = this;
				this.$refs[addRoleForm].validate(valid => {
					if (valid) {
						that.$api.saveUser(that.addRoleForm).then(res => {
							if (res) {
								that.$message.success(that.action+'成功！')
								that.hidePanel()
								that.$parent.roleList();
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
				this.$emit('update:dialogAddUser', false)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog__body {
		padding: 20px 30px;
	}

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
</style>
