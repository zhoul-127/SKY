<template>
  <div class="equipment">
    <!-- <div class="form-title"><i class="icon"></i>设备查询</div> -->
    <!-- 查询条件 -->
    <!-- <div class="query-title">查询条件</div> -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名" label-width="80px">
        <el-input v-model="formInline.user" style="margin-right: 20px;"></el-input>
		<el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">搜 索</el-button>
		
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
        ref="multipleTableing"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 99.9%;"
        border
        :header-cell-style="{
      'font-size':'14px',
      'padding': '8px 0',
      'font-family':'Microsoft YaHei'}"
        :cell-style="{
       'height': '45px',
       'line-height':'45px',
       'overflow':'hidden',
        'text-overflow':'ellipsis',
        'white-space':'nowrap',
        'padding':'0',
        'font-family':'Microsoft YaHei',
        'font-size':'12px'
      }"
        :row-key="getQuipRowKeys"
        @select="handleChange"
		:row-class-name="tableRowClassName"
        class="tableHei"
    >
      <el-table-column
          :show-overflow-tooltip='true'
          type="selection"
          :reserve-selection="true"
          width="45">
      </el-table-column>
      <el-table-column
          width="55"
          :show-overflow-tooltip='true'
          type="index"
          label="序号">
      </el-table-column>
     <el-table-column prop="Name" label="姓名" sortable>
     </el-table-column>
     <el-table-column prop="Company" label="公司" sortable width="120">
     </el-table-column>
     <el-table-column prop="Department" label="单位" sortable>
     </el-table-column>
     <el-table-column prop="Level" label="级别" sortable>
     </el-table-column>
     <el-table-column prop="BrithDate" label="出生年月" width="120" sortable>
     	<template slot-scope="scope">
     		<span>{{scope.row.BrithDate?scope.row.BrithDate.split('T')[0]:""}}</span>
     	</template>
     </el-table-column>
     <el-table-column prop="Age" label="年龄" sortable>
     </el-table-column>
    </el-table>
    <div>已选择： {{selectedNum}}</div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
			 background layout="total, prev, pager, next, jumper" :total="totalCount">
			</el-pagination>
    </div>
    <div class="el-form-item btn-group center">
      <el-button type="primary" @click="routeOk" size="small">添加</el-button>
    </div>
  </div>
</template>
<script>
const user = JSON.parse(localStorage.getItem('user'))

export default {
  props: {
    paramList: Object
  },
  data() {
    return {
      admin: false,
      departmentQuery: '',
      innVVVV: false, // 测试更改
      allOrDanTiao: 0, // 显示添加多少条
      formInline: { // 搜索内容
        ycId: '',
        sbCode: '',
        cgOrder: ''
      },
      selectedNum: "",
      cgOrderId: [], // 使用人ID
      innerVisible: false, // 使用人选择弹出显示
      department: [], // 使用人
      dialogFlag: false, // 使用人弹窗选择判断
      defaultProps: {
        children: "children",
        label: "name"
      },
      disabled: false,
      equipment: [{
        input: ''
      }, {
        input: ''
      }, {
        input: ''
      }, {
        input: ''
      }, {
        input: ''
      }, {
        input: ''
      }, {
        input: ''
      }],
      // rules: {
      //   cgOrder: {
      //     required: true,
      //     message: "使用人不能为空",
      //     trigger: "blur"
      //   }
      // },
      equipList: [],
      checkedList: [],
      multipleSelection: '',
      equipNum: '',
      dialogVisible: false,
      tableData: [],
      peopoData: [],
      arr: [],
      value: true, // 表格-状态
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      flag: false,   // 本登录人角色是否为管理
      isCaoGao: false,
      yeWuN: '',   // 业务模块经理人Name
      yeWuI: '',    // 业务模块Id
      buMenoptions: [],
      isDianJi: false,
    }
  },

  created() {
    	this.onSubmit()
  },
  methods: {
    // 记录当前页是否被选中过
    getQuipRowKeys(row) {
      return row.Name;
    },
	tableRowClassName({row, rowIndex}) {
		row.row_index = rowIndex;
	},
    // 当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
	  this.onSubmit();
    },

    // 勾选的表格
    handleChange(selection, row) {
		this.equipList = selection;
		this.selectedNum = row.Name;
		if(selection.length > 1){
			this.$refs.multipleTableing.clearSelection();
			this.$refs.multipleTableing.toggleRowSelection(row);
		}
    },

    // 查询
    onSubmit() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: '正在加载...',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      let data = {
      	queryJson: JSON.stringify({"Name":this.formInline.user}),
      	'pageModel.pageIndex': this.currentPage,
      	'pageModel.pageSize': this.PageSize,
      };
      this.$api.userList(data).then(res => {
      	this.tableData = res.data;
      	this.totalCount = res.pageModel.PageCount;
				this.$forceUpdate();
      }).catch(err => {
      	console.log(err);
      })
    },
    // 确定跳转申请页
    routeOk() {
      if (this.equipList.length) {
        this.$emit('getEquipList', this.equipList)
      } else {
        this.$message.error('请勾选人员')
      }
      this.$refs.multipleTableing.clearSelection();
    },
  }
}

</script>
<style lang="scss" scoped>
  .inputs {
    margin-bottom: 10px;
  }

  .el-input__inner {
    width: 180px;
  }

  .equipment {
#yangshi .el-input__inner{
  width: 202px;
}
    #yangshi /deep/ .el-form-item__content{
      width: 100%;
    }
    padding-bottom: 10px;

    .el-input .el-input__inner {
      width: 202px;
    }

    .demo-form-inline .el-form-item__content {
      width: 205px;
    }
    .main-left {
      width: 150px;
      float: left;
      border: 1px #ebeef5 solid;
      padding: 10px;
      margin-right: 20px;
    }

    .main-right {
      width: 80%;
      float: left;
    }

    .tableHei {
      .el-table__body-wrapper {
        max-height: 389px;
        overflow-y: auto;
      }
    }

    .allOder {
      padding-left: 10px;
      cursor: pointer;
    }

    .allOder.active {
      color: #409EFF;
    }

    .pop-participation {
      .el-dialog {
        width: 1000px !important;
        height: 615px;

        .divBr {
          height: 445px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          border-left: 2px solid #eee;
          overflow: auto;
          padding: 0 10px;
        }

        .el-table th.is-leaf {
          border-bottom: 1px #999 solid;
        }

        .el-table--border::after, .el-table--group::after, .el-table::before {
          background-color: #fff;
        }

        .el-table th {
          background: #fff;
        }

        .el-table__row:nth-child(2n) {
          background: #fff;
        }
      }
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-textarea {
      position: relative;
      display: inline-block;
      width: 100%;
      vertical-align: bottom;
      font-size: 14px;
    }

    .btn-group {
      display: block;
      text-align: center;
      padding-top: 10px;
    }

    .ment-input {
      width: 200px;
      height: 30px;
      position: absolute;
      top: 0;
    }

    .mbinput {
      margin: 5px 0;
    }

    .el-pagination {
      text-align: center;
    }

    .ment-input {
      width: 100%;
      height: 30px;
      position: absolute;
      top: 0;
    }

    .addDia {
      .el-input {
        display: block;
        width: 230px;
      }

      .el-input__inner {
        margin: 2px 0;
        width: 202px;
      }

      .el-dialog__body {
        height: 330px;
        overflow-y: auto;
      }
    }

    .addInput {
      color: #26a2ff;
      cursor: pointer;
    }

    .el-pagination__editor .el-input__inner {
      width: 50px;
    }
  }
</style>
