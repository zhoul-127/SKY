<template>
	<div class="jsadmin">
		<!-- 搜索条件 -->
		<el-form ref="searchDiv" :inline="true"  class="demo-form-inline">
			<el-form-item label="部门:"  style="margin-bottom: 8px;">
				<el-select
					style="display: inline-block;width: 202px"
					class="yanshiZiJi"
					@change="GetLevelByDepartment"
					v-model="department"
					filterable
					placeholder="请选择"
				  >
					<el-option
					  v-for="item in departmentAry"
					  :key="item"
					  :label="item"
					  :value="item"
					></el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="人员类别:"  style="margin-bottom: 8px;">
				<el-select
					style="display: inline-block;width: 202px"
					class="yanshiZiJi"
					@change="GetLevelChange"
					v-model="Level"
					filterable
					placeholder="请选择"
				  >
					<el-option
					  v-for="item in LevelAry"
					  :key="item"
					  :label="item"
					  :value="item"
					></el-option>
				  </el-select>
			</el-form-item>
		</el-form>
		<div class="main">
			<div class="top">
				<div>体能分析表</div>
			</div>
			<div class="middle">
				<div class="middle-l">
					<div class="middle-l-t boxall">
						<div class="personal-info" style="width:55%">
							<ul class="clearfix">
								<li>
									<div class="til">单位</div>
									<div class="tir">{{department}}</div>
								</li>
								<li>
									<div class="til">人员类别</div>
									<div class="tir">{{Level}}类</div>
								</li>
								<li>
									<div class="til">连长</div>
									<div class="tir"></div>
								</li>
								<li>
									<div class="til">速度</div>
									<div class="tir">{{data.speed}}</div>
								</li>
								<li>
									<div class="til">力量</div>
									<div class="tir">{{data.power}}</div>
								</li>
								<li>
									<div class="til">灵敏度</div>
									<div class="tir">{{data.sensitivity}}</div>
								</li>
								<li>
									<div class="til">耐力</div>
									<div class="tir">{{data.endurance}}</div>
								</li>
								<li>
									<div class="til">柔韧性</div>
									<div class="tir">{{data.flexibility}}</div>
								</li>
								<li>
									<div class="til">优势科目</div>
									<div class="tir">{{data.advanceSubject}}</div>
								</li>
								<li>
									<div class="til">劣势科目</div>
									<div class="tir">{{data.weakSubject}}</div>
								</li>
							</ul>
						</div>

						<div id="zhsl"  style="width:45%"></div>
						<div class="boxfoot"></div>
					</div>
					
					<div class="middle-l-b boxall">
						<div style="width:100%;height:100%;overflow: auto;">
							
							<table width="100%" border="0" class="table" cellpadding="0" cellspacing="0">
								<tr>
									<th class="th_border" style="width:60px;">类别</th>
									<th class="th_border" style="width:133px;">科目</th>
									<th class="th_border" style="width:55px;">平均值</th>
									<th class="th_border" style="width:46px;">最低分</th>
									<th class="th_border" style="width:46px;">最高分</th>
									<th class="th_border slh" style="width:60px;">最高者</th>
									<th class="th_border slh" style="width:60px;">历史记录</th>
									<th class="slh" style="width:80px;">保持记录者</th>
								</tr>
								<tr v-for="(item,index) in dataSport" :key="index">
									<td style="width:40px;" v-if="item.count" :rowspan="item.count">{{item.SubjectType}}</td>
									<td style="width:133px;">{{item.Subject}}</td>
									<td style="width:55px;">{{item.ScoreAvg}}</td>
									<td style="width:46px;">{{item.ScoreMin}}</td>
									<td style="width:46px;">{{item.ScoreMax}}</td>
									<td class="slh" style="width:50px;" :title="item.maxScoreName">{{item.maxScoreName}}</td>
									<td class="slh" style="width:50px;" :title="item.maxHistoryScore">{{item.maxHistoryScore}}</td>
									<td class="slh"  :title="item.maxHistoryScoreName">{{item.maxHistoryScoreName}}</td>
								</tr>
							</table>
						</div>
						<div class="boxfoot"></div>
					</div>
				</div>
				<div class="middle-c boxall">
					<div id="zdlz"></div>
					<div class="boxfoot"></div>
				</div>
				<div class="middle-r boxall">
					<div id="dkmcj"></div>
					<div class="boxfoot"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				selectP: false, // 选择用户弹窗控制
				departmentAry: '', // 搜索内容
				department: '', // 搜索内容
				LevelAry: "",
				Level: "",
				data: {pInfo:{}},
				zhslChart: "",
				zdlzChart: "",
				dkmcjChart:"",
				dataPM:{},
				Subject:[],
				SubjectGuid:"",
				dataSport:[]
			}
		},
		created() {
			var that = this;
			this.GetDepartList();
			window.onresize = () => {
			return (() => {
				that.zhslChart.resize();
				that.zdlzChart.resize();
				that.dkmcjChart.resize();
			})()
			}
		},
		methods: {
			getAll(){
				this.GetDepartmentAnalysisInfo();
				this.GetSubjectDistribution();
				this.GetLatesSubjectScore();
			},
			//初始化部门
			GetDepartList(){
				this.$api.GetDepartList({}).then(res => {
					if (res&&res.length>0) {
						var r = res.filter(function (s) {
						   return s && s.trim();
						});
						this.departmentAry = r;
						this.department = r[0];
						this.GetLevelByDepartment(r[0]);
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			//获取级别列表
			GetLevelByDepartment(name){
				this.$api.GetLevelByDepartment({department:name}).then(res => {
					if (res&&res.length>0) {
						this.LevelAry = res;
						this.Level = res[0];
						this.getAll();
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			//级别变化查询
			GetLevelChange(name){
				this.$forceUpdate();
				this.getAll();
			},
			// 部门综合指标
			GetDepartmentAnalysisInfo() {
				var loading = this.$loading({
					lock: true,
					text: "分析中，请稍候...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				let data = {
					department: this.department,
					Level:this.Level
				};
				this.$api.GetDepartmentAnalysisInfo(data).then(res => {
					this.data = res;
					//合并操作
					var count = 0;
					for(var i=0;i<res.data.length;i++){
						if(i<res.data.length-1){
							if(res.data[i].SubjectType == res.data[i+1].SubjectType){
								count ++;
							}else{
								res.data[i-count].count = count+1;
								count = 0;
							}
						}else{
							if(res.data[i-1].SubjectType == res.data[i].SubjectType){
								count ++;
							}
							res.data[i-count+1].count = count;
							count = 0;
						}
					}
					this.dataSport = res.data;
					var ldtData = [res.speed,res.power,res.endurance,res.flexibility,res.sensitivity];
					this.getZHSL(ldtData);
					loading.close();
				}).catch(err => {
					console.log(err);
					loading.close();
				})
			},
			// 科目人员分布
			GetSubjectDistribution() {
				let data = {
					department: this.department,
					Level:this.Level
				};
				this.$api.GetSubjectDistribution(data).then(res => {
					var dataX=[],dataY =[],legend = [];
					for(var i=0;i<res.length;i++){
						var ary = {
								name: '',
								type: 'bar',
								barWidth: "12",
								stack: '总量',
								data: []
							}
						if(res[i].X === 0){
							ary.name = '0-60'
							legend.push(ary.name)
						}else if(res[i].X === 1){
							ary.name = '60-70'
							legend.push(ary.name)
						}else if(res[i].X === 2){
							ary.name = '70-80'
							legend.push(ary.name)
						}else if(res[i].X === 3){
							ary.name = '80-90'
							legend.push(ary.name)
						}else if(res[i].X === 4){
							ary.name = '90-100'
							legend.push(ary.name)
						}
						for(var j=0;j<res[i].Y.length;j++){
							if(i==0){
								dataX.push(res[i].Y[j].SubjectName);
							}
							ary.data.push(res[i].Y[j].Count);
						}
						dataY.push(ary);
					}
					this.getZDLZ(dataX,dataY,legend);
				}).catch(err => {
					console.log(err);
				})
			},
			// 最近一次科目平均成绩
			GetLatesSubjectScore() {
				let data = {
					department: this.department,
					Level:this.Level
				};
				this.$api.GetLatesSubjectScore(data).then(res => {
					var dataAX = [],dataAY = [];
					if(res&&res.length>0){
						for(var i=0;i<res.length;i++){
							dataAX.push(res[i].SubjectName);
							dataAY.push(res[i].Avg);
						}
					}
					this.getDKMCJ(dataAX,dataAY);
				}).catch(err => {
					console.log(err);
				})
			},
			//综合实力雷达图
			getZHSL(data) {
				this.zhslChart = this.$echarts.init(document.getElementById('zhsl'));
				this.zhslChart.setOption({
					color:['#00f9f9'],
					title: {
						text: '',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					radar: {
						center: ['50%', '58%'],
						radius: 60,
						name: {
							textStyle: {
								color: '#fff',
								borderRadius: 3,
								padding: [0,0]
							}
						},
						indicator: [{
								name: '速度',
								max: 100
							},
							{
								name: '力量',
								max: 100
							},
							{
								name: '耐力',
								max: 100
							},
							{
								name: '柔韧性',
								max: 100
							},
							{
								name: '灵敏度',
								max: 100
							},
						]
					},
					series: [{
						type: 'radar',
						data: [{
							value: data,
							name: '值',
							areaStyle: {
									normal: {
										color: 'rgba(0, 255, 255, 0.8)' // 选择区域颜色
									}
								}
						}, ]
					}]
				});
			},

			//科目人员分布
			getZDLZ(dataX,dataY,legend) {
				this.zdlzChart = this.$echarts.init(document.getElementById('zdlz'));
				this.zdlzChart.setOption({
					color:['#4f81bd','#c0504d','#9bbb59','#8064a2','#4bacc6'],
					title: {
						text: '科目人员分布',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						textStyle: {
							color: '#fff',
						},
						x: 'left', //可设定图例在左、右、居中
						y: 'bottom',
						padding: [20, 50],
						data: legend
					},
					grid: {
						left: '3%',
						right: '4%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						splitLine: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#dedbdb',
							}
						},
						axisLabel: {
							textStyle: {
								color: '#dedbdb',
							}
						},
					},
					yAxis: {
						type: 'category',
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#dedbdb',
							}
						},
						axisLabel: {
							textStyle: {
								color: '#dedbdb',
							}
						},
						data: dataX
					},
					series: dataY
				});
			},
			//最近一次科目平均成绩
			getDKMCJ(dataX,dataY) {
				this.dkmcjChart = this.$echarts.init(document.getElementById('dkmcj'));
				this.dkmcjChart.setOption({
					color:['#4589cf'],
					title: {
						text: '最近一次科目平均成绩',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						min:0,
						max:100,
						splitLine: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#dedbdb',
							}
						},
						axisLabel: {
							textStyle: {
								color: '#dedbdb',
							}
						},
					},
					yAxis: {
						type: 'category',
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#dedbdb',
							}
						},
						axisLabel: {
							textStyle: {
								color: '#dedbdb',
							}
						},
						data: dataX
					},
					series: [{
								name: '分数',
								type: 'bar',
								barWidth: "12",
								data: dataY
							}]
				});
			},
			
			
		}
	}
</script>
<style lang="scss" scoped>
	.el-main {
		padding: 0 !important;
	}

	.jsadmin {
		margin: 0 !important;
		width: 100%;
		height: 100%;
		background: url('../../assets/images/bg.jpg') no-repeat 100%;
		background-size: cover;
	}

	.el-form {
		position: absolute;
		top: 2%;
	}

	.main {
		height: calc(100% - 20px);
		width: 100%;

		.top {
			height: 12%;
			background: url('../../assets/images/head_bg.png') no-repeat 100%;
			background-size: cover;
			color: #fff;
			font-size: 30px;
			letter-spacing: 4px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.middle {
			height: 88%;
			display: flex;

			.middle-l {
				margin: 0 10px 0 20px;
				width: calc(32% - 30px);

				.middle-l-t {
					height: calc(33.33% - 10px);
					margin: 0 0 10px;
					display: flex;

					.personal-info {
						border-top: 0;
						margin: 8px;
						height: calc(100% - 16px);
						overflow-y: auto;

						ul {
							width: 100%;
						}

						li {
							width: 50%;
							float: left;
							text-align: center;
							line-height: 35px;
							border-bottom: 1px dashed #183569;
							display: flex;
							.til {
								float: left;
								color: #dedbdb;
								padding-right: 10px;
								.iconfont {
									margin-right: 10px;
									font-size: 25px;
									vertical-align: middle;
								}
							}

							.tir {
								float: left;
								color: #4d9ae6;
							}
						}

						.wid75 {
							width: 75%;
							text-align: left;
							.til{
								width: 20%;
							}
						}

						.wid100 {
							width: 100%;
							text-align: left;
						}
					}
				}

				.middle-l-m {
					height: calc(33.33%);
					margin: 0 0 10px;
				}

				.middle-l-b {
					height:calc(66.66%);;
					.table {
						border-collapse: collapse;
						font-size: 13px;
						height: 30px;
						line-height: 30px;
						color: #09F;
						text-align: center;
						table-layout: fixed;
					}

					.table tr th {
						background: #13258c;
						color: #eceaea;
						font-size: 13px;
						height: 30px;
						line-height: 30px;
					}
					.table .slh{
						overflow: hidden;
						white-space:nowrap;
						word-break: break-all;
						text-overflow: ellipsis;
					}

					.table tr th.th_border {
						border-right: solid 1px #254b80;
						border-left: solid 1px #254b80;
					}

					.table tr td {
						border: solid 1px #254b80;
					}
				
					}
			}

			.middle-c {
				width: 36%;
				height: calc(100% + 4px);

				.middle-c-t {
					height: calc(33.33% - 10px);
					margin: 0 0 10px;
					.kemsz{
						height:100%;
						overflow-y: auto;
						overflow-x: hidden;
					}
					.table {
						border-collapse: collapse;
						font-size: 13px;
						height: 30px;
						line-height: 30px;
						color: #09F;
						text-align: center;
					}

					.table tr th {
						background: #13258c;
						color: #eceaea;
						font-size: 13px;
						height: 30px;
						line-height: 30px;
					}

					.table tr th.th_border {
						border-right: solid 1px #254b80;
						border-left: solid 1px #254b80;
					}

					.table tr td {
						border: solid 1px #254b80;
					}
				}

				.middle-c-m {
					height: calc(33.33%);
					margin: 0 0 10px;
				}

				.middle-c-b {
					height: calc(33.33% - 10px);
					margin: 0;
				}
			}

			.middle-r {
				margin: 0 20px 0 10px;
				width: calc(32% - 30px);
				height: calc(100% + 4px);

				.middle-r-t {
					height: calc(33.33% - 10px);
					margin: 0 0 10px;
				}

				.middle-r-b {
					height: calc(66.66%);
					margin: 0;
				}
			}
		}
	}

	@media (max-width: 1500px) {
		.main{
			font-size:10px;
		}
	}
	.boxall {
		position: relative;
		border: 1px solid rgba(37, 232, 175, 0.17);
	}

	.boxfoot {
		position: absolute;
		bottom: 0;
		width: 100%;
		left: 0;
	}

	.boxall:after,
	.boxfoot:after {
		border-right: 2px solid #02a6b5;
		right: 0;
	}

	.boxall:before,
	.boxfoot:before {
		border-left: 2px solid #02a6b5;
		left: 0;
	}

	.boxall:before,
	.boxall:after {
		position: absolute;
		width: 10px;
		height: 10px;
		content: "";
		border-top: 2px solid #02a6b5;
		top: 0;
	}

	.boxfoot:before,
	.boxfoot:after {
		position: absolute;
		width: 10px;
		height: 10px;
		content: "";
		border-bottom: 2px solid #02a6b5;
		bottom: 0;
	}



	#zhsl,
	#khcj,
	#khmc,
	#zdlz,
	#dkmcj {
		height: 100%;
		width: 100%;
	}
	.el-form{
		padding-left: 40px;
	}
	/deep/.el-form-item__label {
    color: #fff;
}
	.el-input{
		/deep/.el-input__inner{
			background-color: #0d1649 !important;
			color: #fff;
		}
	}
	/deep/.el-input--suffix .el-input__inner {
	    background-color: #0d1649 !important;
	    color: #fff;
	}
</style>
