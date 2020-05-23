<template>
	<div class="jsadmin">
		<!-- 搜索条件 -->
		<el-form ref="searchDiv" :inline="true"  class="demo-form-inline">
			<el-form-item label="姓名:" prop="Name">
				<el-input readonly="readonly" placeholder="请选择人员..." v-model="Name" @focus="addrouter"></el-input>
			</el-form-item>
		</el-form>
		<div class="main">
			<div class="top">
				<div>个人军事训练成绩分析表</div>
			</div>
			<div class="middle">
				<div class="middle-l">
					<div class="middle-l-t boxall">
						<div class="personal-info">
							<ul class="clearfix">
								<li>
									<div class="til">姓名</div>
									<div class="tir">{{data.pInfo.Name}}</div>
								</li>
								<li>
									<div class="til">职务</div>
									<div class="tir">{{data.pInfo.Duty}}</div>
								</li>
								<li>
									<div class="til">部职别</div>
									<div class="tir">{{data.pInfo.Department}}</div>
								</li>
								<li>
									<div class="til">军衔</div>
									<div class="tir">{{data.pInfo.Level}}</div>
								</li>
								<li>
									<div class="til">年龄</div>
									<div class="tir">{{data.pInfo.Age}}</div>
								</li>
								<li>
									<div class="til">速度</div>
									<div class="tir">{{data.speed}}</div>
								</li>
								<li>
									<div class="til">耐力</div>
									<div class="tir">{{data.endurance}}</div>
								</li>
								<li>
									<div class="til">力量</div>
									<div class="tir">{{data.power}}</div>
								</li>
								<li>
									<div class="til">柔韧性</div>
									<div class="tir">{{data.flexibility}}</div>
								</li>
								<li class="wid75">
									<div class="til">灵敏度</div>
									<div class="tir">{{data.sensitivity}}</div>
								</li>
								<li class="wid100">
									<div class="til">身体数据</div>
								</li>
								<li>
									<div class="til">身高</div>
									<div class="tir">{{data.pInfo.Height}}</div>
								</li>
								<li>
									<div class="til">体重</div>
									<div class="tir">{{data.pInfo.Weight}}</div>
								</li>
								<li>
									<div class="til">胸围</div>
									<div class="tir">{{data.pInfo.Bust}}</div>
								</li>
								<li>
									<div class="til">腰围</div>
									<div class="tir">{{data.pInfo.Waist}}</div>
								</li>
								<li>
									<div class="til">BMI</div>
									<div class="tir">{{data.pInfo.BMI}}</div>
								</li>
								<li class="wid75">
									<div class="til">PBF</div>
									<div class="tir">{{data.pInfo.PBF}}</div>
								</li>
							</ul>
						</div>

						<div class="boxfoot"></div>
					</div>
					<div class="middle-l-m boxall">
						<div id="zhsl"></div>
						<div class="boxfoot"></div>
					</div>
					<div class="middle-l-b boxall">
						<div class="personal-info">
							<ul class="clearfix">
								<li>
									<div class="til">连综合排名</div>
									<div class="tir">{{dataPM.EvenRank}}</div>
								</li>
								<li>
									<div class="til">营综合排名</div>
									<div class="tir">{{dataPM.CampRank}}</div>
								</li>
								<li>
									<div class="til">旅综合排名</div>
									<div class="tir">{{dataPM.BrigadeRank}}</div>
								</li>
								<li>
									<div class="til">等级</div>
									<div class="tir">{{dataPM.Level}}</div>
								</li>
								<li>
									<div class="til">个人最佳成绩</div>
									<div class="tir">{{dataPM.maxScore}}</div>
								</li>
								<li>
									<div class="til">个人弱项科目</div>
									<div class="tir">{{dataPM.weakSubject}}</div>
								</li>
								<li class="wid100-a" style="height:35px;">
									<div class="til" style="width: 32%;text-align: left;">个人弱科项目均分</div>
									<div class="tir">{{dataPM.weakScore}}</div>
								</li>
								<li class="wid100-a">
									<div class="til">运动建议</div>
									<div class="tir asd">{{dataPM.sportSuggest}}</div>
								</li>
								<li class="wid100-a">
									<div class="til">饮食建议</div>
									<div class="tir asd">{{dataPM.eatSuggest}}</div>
								</li>
							</ul>
						</div>

						<div class="boxfoot"></div>
					</div>
				</div>
				<div class="middle-c">
					<div class="middle-c-t boxall">
						<div class="kemsz">
							<el-form style="position: static;margin-top: 8px;">
								<el-form-item label="科目:" prop="subject" style="margin-bottom: 8px;">
									<el-select
										style="display: inline-block;width: 202px"
										class="yanshiZiJi"
										@change="getSubjectType"
										v-model="SubjectGuid"
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
							</el-form>
							<table width="100%" border="0" class="table" cellpadding="0" cellspacing="0">
								<tr>
									<th class="th_border">日期</th>
									<th class="th_border">成绩</th>
									<th class="th_border">评定</th>
									<th class="th_border">排名</th>
									<th class="th_border">单次进步分数</th>
									<th class="th_border">单次进步名次</th>
									<th class="th_border">年度进步分数</th>
									<th class="">年度进步名次</th>
								</tr>
								<tr v-for="(item,index) in dataSport" :key="index">
									<td>{{item.AchieveDate?item.AchieveDate.split("T")[0]:""}}</td>
									<td>{{item.Score}}</td>
									<td>{{item.Evaluate}}</td>
									<td>{{item.Rank}}</td>
									<td>{{item.CurrentProScore}}</td>
									<td>{{item.CurrentProRank}}</td>
									<td>{{item.YearProScore}}</td>
									<td>{{item.YearProRank}}</td>
								</tr>
							</table>
						</div>
						
						<div class="boxfoot"></div>
					</div>
					<div class="middle-c-m boxall">
						<div id="khcj"></div>
						<div class="boxfoot"></div>

					</div>
					<div class="middle-c-b boxall">
						<div id="khmc"></div>
						<div class="boxfoot"></div>
					</div>
				</div>
				<div class="middle-r">
					<div class="middle-r-t boxall">
						<div id="zdlz"></div>
						<div class="boxfoot"></div>
					</div>
					<div class="middle-r-b boxall">
						<div id="dkmcj"></div>
						<div class="boxfoot"></div>
					</div>

				</div>
			</div>
		</div>
		<!-- 选择人员 -->
		<el-dialog title="选择人员" top="10vh" append-to-body :visible.sync="selectP" width="50%" class="add-Equip">
			<select-user @getEquipList="getEquipList"></select-user>
		</el-dialog>
	</div>
</template>
<script>
	import selectUser from "../source/selectUser.vue";
	export default {
		data() {
			return {
				selectP: false, // 选择用户弹窗控制
				Name: '', // 搜索内容
				PGuid: "",
				data: {pInfo:{}},
				zhslChart: "",
				khcjChart: "",
				khmcChart: "",
				zdlzChart: "",
				dataPM:{},
				Subject:[],
				SubjectGuid:"",
				dataSport:[]
			}
		},
		created() {
			this.GetRandomPersonalfile();
		},
		components: {
			'select-user': selectUser,
		},
		methods: {
			getAll(){
				this.getSubject();
				this.getPersonAnalysisInfo();
				this.GetLatesRank();
				this.GetSubjectAchive();
			},
			//获取科目列表
			getSubject(){
				this.$api.getSubject("").then(res => {
					if (res&&res.length>0) {
						this.Subject = res;
						this.SubjectGuid = res[0].Guid;
						this.GetSportRecord();
					} 
				}).catch(err => {
					console.log(err);
				})
			},
			//选择科目
			getSubjectType(guid){
				this.$forceUpdate();
				this.GetSportRecord();
			},
			// 初始化人员
			GetRandomPersonalfile() {
				this.$api.GetRandomPersonalfile({}).then(res => {
					if(res){
						this.Name = res.Name;
						this.PGuid = res.Guid;
						this.getAll();
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 成绩分析
			getPersonAnalysisInfo() {
				let data = {
					pguid: this.PGuid,
				};
				this.$api.getPersonAnalysisInfo(data).then(res => {
					this.data = res;
					var zdlzData = [res.fightCapacity,res.grow,res.insis,res.promoteCapacity];
					this.getZDLZ(zdlzData);
					var ldtData = [res.speed,res.power,res.endurance,res.flexibility,res.sensitivity];
					this.getZHSL(ldtData);
				}).catch(err => {
					console.log(err);
				})
			},
			// 近10次运动记录
			GetSportRecord() {
				let data = {
					pguid: this.PGuid,
					subguid:this.SubjectGuid
				};
				this.$api.GetSportRecord(data).then(res => {
					this.dataSport = res;
					var dataAX = [],dataAY = [],dataBY = [];
					if(res&&res.length>0){
						for(var i=0;i<res.length;i++){
							res[i].AchieveDate = res[i].AchieveDate?res[i].AchieveDate.split("T")[0]:"";
							dataAX.push(res[i].AchieveDate);
							dataAY.push(res[i].Score);
							dataBY.push(res[i].Rank);
						}
					}
					this.getKHCJ(dataAX,dataAY);
					this.getKHMC(dataAX,dataBY);
				}).catch(err => {
					console.log(err);
				})
			},
			// 排名
			GetLatesRank() {
				let data = {
					pguid: this.PGuid,
				};
				this.$api.GetLatesRank(data).then(res => {
					this.dataPM = res;
				}).catch(err => {
					console.log(err);
				})
			},
			// 单科成绩
			GetSubjectAchive() {
				let data = {
					pguid: this.PGuid,
				};
				this.$api.GetSubjectAchive(data).then(res => {
					var dataX = [],dataY = [];
					if(res&&res.length>0){
						for(var i=0;i<res.length;i++){
							dataX.push(res[i].Subject);
							dataY.push(res[i].Score);
						}
					}
					this.getDKMCJ(dataX,dataY);
				}).catch(err => {
					console.log(err);
				})
			},
			//综合实力雷达图
			getZHSL(data) {
				this.zhslChart = this.$echarts.init(document.getElementById('zhsl'));
				this.zhslChart.setOption({
					title: {
						text: '综合实力',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					radar: {
						center: ['50%', '58%'],
						name: {
							textStyle: {
								color: '#fff',
								borderRadius: 3,
								padding: [3, 5]
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
							name: '值'
						}, ]
					}]
				});
			},

			//考核成绩
			getKHCJ(dataX,dataY) {
				this.khcjChart = this.$echarts.init(document.getElementById('khcj'));
				this.khcjChart.setOption({
					title: {
						text: '近10次考核成绩变化',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					grid: {
						left: '5%',
						right: '5%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
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
					yAxis: {
						type: 'value',
						min: 0,
					   max: 100,
						splitLine: {
							show: false
						},
						axisLabel: {
							color: '#dedbdb',
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: { //y轴
							show: false
						},
					},
					series: [{
						data: dataY,
						type: 'line',
						smooth: true,
						color: '#f7bb38',
						areaStyle: {
							normal: {
								color: {
									type: 'linear', //设置线性渐变
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#f5aa146e' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#05296133' // 100% 处的颜色
									}],
									globalCoord: false
								},
							}
						}
					}]
				});
			},
			//考核名次
			getKHMC(dataX,dataY) {
				this.khmcChart = this.$echarts.init(document.getElementById('khmc'));
				this.khmcChart.setOption({
					title: {
						text: '近10次考核名次变化',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					grid: {
						left: '5%',
						right: '5%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
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
					yAxis: {
						type: 'value',
						splitLine: {
							show: false
						},
						axisLabel: {
							color: '#dedbdb',
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: { //y轴
							show: false
						},
					},
					series: [{
						data: dataY,
						type: 'line',
						smooth: true,
						color: '#77FBFA',
						areaStyle: {
							normal: {
								color: {
									type: 'linear', //设置线性渐变
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
									offset: 0, color: '#05296133' // 0% 处的颜色
								}, {
									offset: 1, color: '#00ffff33' // 100% 处的颜色
									}],
									globalCoord: false
								},
							}
						}
					}]
				});
			},
			//战斗力值
			getZDLZ(data) {
				this.zdlzChart = this.$echarts.init(document.getElementById('zdlz'));
				this.zdlzChart.setOption({
					color:['#4589cf'],
					title: {
						text: '战斗力值',
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
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						splitLine: {
							show: false
						},
						min: 0,
					   max: 100,
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
						boundaryGap: [0, 0.01],
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
						data: ['塔山战力', '成长值', '坚持指数', '提升潜力']
					},
					series: [{
						name: '2011年',
						type: 'bar',
						barWidth: "20",
						data: data
					}]
				});
			},
			//个人单科目成绩
			getDKMCJ(dataX,dataY) {
				this.dkmcjChart = this.$echarts.init(document.getElementById('dkmcj'));
				this.dkmcjChart.setOption({
					color:['#65d08a'],
					title: {
						text: '个人单科目成绩',
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						padding: [20, 20]
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					// legend: {
					// 	textStyle: {
					// 		color: '#fff',
					// 	},
					// 	x: 'left', //可设定图例在左、右、居中
					// 	y: 'bottom',
					// 	padding: [20, 50],
					// 	data: ['双杆3练习', '单杠3练习', '木马2练习', '爬绳']
					// },
					grid: {
						left: '4%',
						right: '4%',
						bottom: '4%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						axisLine: {
							lineStyle: {
								color: '#dedbdb',
							}
						},
						axisLabel: {
							interval:0,
							formatter: function (value) {
							　　　　　　//x轴的文字改为竖版显示
							　　　　　　var str = value.split("");
							　　　　　　return str.join("\n");
							　　　　},
							textStyle: {
								color: '#dedbdb',
							}
						},
						data: dataX
					}],
					yAxis: [{
						type: 'value',
						min: 0,
					   max: 100,
						axisTick: { //y轴刻度线
							show: false
						},
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
					}],
					series: [{
							name: '分数',
							type: 'bar',
							barWidth: '10',
							stack: '广告',
							data: dataY,
							itemStyle: {
								normal: {
									// 定制显示（按顺序）
									color: function(params) { 
										var colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ]; 
										return colorList[params.dataIndex] 
									}
								},
							},
						}
					]
				});
			},
			// 选择人员跳转
			addrouter() {
				if (!this.guid)
					this.selectP = true;
			},
			getEquipList(item) {
				if (item.length > 0) {
					this.selectP = false;
					this.Name = item[0].Name;
					this.PGuid = item[0].Guid;
					this.getAll();
				}
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
			font-size: 32px;
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

					.personal-info {
						border-top: 0;
						margin: 8px;
						height: calc(100% - 16px);
						overflow-y: auto;

						ul {
							width: 100%;
						}

						li {
							width: 25%;
							float: left;
							text-align: center;
							line-height: 35px;
							border-bottom: 1px dashed #183569;

							.til {
								width: 40%;
								float: left;
								color: #dedbdb;

								.iconfont {
									margin-right: 10px;
									font-size: 25px;
									vertical-align: middle;
								}
							}

							.tir {
								width: 60%;
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
					height: calc(33.33% - 10px);

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

							.til {
								width: 40%;
								float: left;
								color: #dedbdb;

								.iconfont {
									margin-right: 10px;
									font-size: 25px;
									vertical-align: middle;
								}
							}

							.tir {
								width: 60%;
								float: left;
								color: #4d9ae6;
							}
						}

						.wid75 {
							width: 75%;
							text-align: left;
						}

						.wid100-a {
							width: 100%;
							height: auto;

							.til {
								width: 20%;
							}

							.tir {
								text-align: left;
							}
							.asd{
								width: 80%;
								line-height: 24px;
							}
						}
					}
				}
			}

			.middle-c {
				width: 36%;

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
				height: calc(100% + 2px);

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
