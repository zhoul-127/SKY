<!--
 * @Description: 选择使用人
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-04 14:07:04
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-20 01:04:49
 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <b>组织人员架构</b>
      </el-col>
      <el-col :span="12"
              class="pl10">
        <el-input placeholder="请输入用户姓名"
                  class="mb10"
                  suffix-icon="el-icon-search"
                  @change="searchNameChange"
                  maxlength="30"
                  v-model="searchName"></el-input>
      </el-col>
      <el-col :span="6"
              class="pl10">
        <b>已选人员</b>
      </el-col>
    </el-row>
    <el-row style="height:480px;"
            class="pop-row">
      <el-col :span="6"
              style="overflow-y: scroll"
              class="sb-el-tree">
        <el-tree :data="manList"
                 :default-expand-all="defaultExpandAll"
                 :default-checked-keys="checkedTree"
                 highlight-current
                 node-key="deptNum"
                 :props="defaultProps"
                 ref="tree"
                 @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="12"
              class="pl10">
        <div style="width: 100%"
             class="man-checkbox">
          <el-table :data="userData"
                    v-loading="userLoad"
                    ref="multipleTable"
                    :row-key="getRowKeys"
                    @selection-change="handleManChange"
                    @current-change="currentChange"
                    style="width: 100%;min-height:450px">
            <el-table-column v-if="!isRadio"
                             type="selection"
                             :reserve-selection="false"
                             width="55"></el-table-column>
            <el-table-column v-if="isRadio"
                             label="选择"
                             width="55"
                             class="dialog-radio">
              <template slot-scope="scope">
                <el-radio v-model="radio"
                          :label="scope.row.usrId">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="usrId"
                             label="用户ID"
                             width="180"></el-table-column>
            <el-table-column prop="name"
                             label="姓名"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="6"
              style="min-width: 160px;">
        <div class="pl10">&emsp;{{selectedManList.join('，')}}</div>
      </el-col>
    </el-row>
    <div class="pagination_bottom">
      <el-pagination background
                     :pager-count="pageCount"
                     layout="total,prev, pager, next,jumper"
                     :page-size="8"
                     @current-change="handleCurrentChangeUser"
                     :total="total"></el-pagination>
      <div class="right">
        <el-button @click="departmentClose"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="departmentOk"
                   size="small">确 定</el-button>
      </div>
    </div>
    <div style="height:30px"></div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from '@/api/index.js'

export default {
  data () {
    return {
      manList: [],
      defaultExpandAll: true,
      checkedTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      userData: [],
      getRowKeys (row) {
        return row.usrId
      },
      selectedManList: [],
      pageCount: 5,
      total: 0,
      manCurrentPage: 1,
      ziZuJianList: [],
      selectUsrId: [],
      radio: '',
      searchName: '',
      userLoad: false
    }
  },
  props: {
    // 是否查询当前人员所有部门 all默认是所有
    queryType: {
      type: String,
      default: 'all'
    },
    // 人员选择是否是单选
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // 新增根据当前登录人查询所在部门
    if (this.queryType === 'all') {
      this.getUsingMan()
    } else if (this.queryType === 'my') {
      this.getMyTree()
      // 验收
    } else if (this.queryType === 'accept') {
      this.handeleAcceptTree()
    } else {
    }
  },
  methods: {
    // 点击最左侧树结构
    handleNodeClick (data) {
      this.radio = ''
      // this.$refs.multipleTable.clearSelection();
      this.userData = []
      this.selectedManList = []
      this.deptNum = data.deptNum
      this.manCurrentPage = 1
      this.judeParamsFn()
    },
    // 搜索
    searchNameChange () {
      this.manCurrentPage = 1
      this.judeParamsFn()
    },
    // 分页
    handleCurrentChangeUser (val) {
      this.manCurrentPage = val
      this.judeParamsFn()
    },
    judeParamsFn () {
      if (this.queryType === 'accept') {
        this.handleAccetptUser()
      } else {
        this.getUserList()
      }
    },
    /**
     * 验收参与人员组织架构树
     */
    handeleAcceptTree () {
      axiosGet('process/acceptance/dept-tree').then(result => {
        if (result.code === 200) {
          if (result.data.length > 0) {
            this.manList = result.data
            this.checkedTree.push(this.manList[0].deptNum)

            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.manList[0].deptNum)

              this.deptNum = this.manList[0].deptNum
              this.handleAccetptUser()
            })
          }
        } else {
          this.$message.error(result.message)
        }
      })
    },

    // 获取使用人
    getUsingMan () {
      this.userLoad = true
      axiosGet('base/dept/tree').then(result => {
        if (result.code === 200) {
          if (result.data.length > 0) {
            this.manList = result.data
            this.checkedTree.push(this.manList[0].deptNum)

            // console.log(this.checkedTree);
          }
          this.userLoad = false
        } else {
          this.userLoad = false

          this.$message.error(result.message)
        }
      })
    },
    // 获取使用人
    getMyTree () {
      axiosGet('base/dept/myTree').then(result => {
        if (result.code === 200) {
          if (result.data.length > 0) {
            this.manList = result.data
            this.checkedTree.push(this.manList[0].deptNum)

            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.manList[0].deptNum)

              this.deptNum = this.manList[0].deptNum
              this.getUserList()
            })
          }
        } else {
          this.$message.error(result.message)
        }
      })
    },
    currentChange (row, oldRow) {
      // this.selectedUser = row;
      if (!row) return
      this.selectUsrId = [row.usrId]
      this.selectId = [row.id]
      this.selectedManList = [row.name]

      let params = {
        name: row.name,
        usrId: row.usrId,
        id: row.id
      }
      this.ziZuJianList = [params]
      this.radio = row.usrId
    },

    // 获取用户列表
    getUserList () {
      this.userLoad = true
      axiosGet(
        'base/user/list?deptNum=' +
        this.deptNum +
        '&current=' +
        this.manCurrentPage +
        '&size=8' +
        '&name=' +
        this.searchName
      ).then(result => {
        if (result.code === 200) {
          this.userData = result.data.records
          this.total = result.data.total
          this.ziZuJianList = []
        } else {
          this.$message.error(result.message)
        }
        this.userLoad = false
      })
    },
    /**
     * 获取验收用户列表
     */
    handleAccetptUser () {
      var _this = this
      _this.userLoad = true
      axiosGet(
        'process/acceptance/dept-member?deptId=' +
        _this.deptNum +
        '&current=' +
        _this.manCurrentPage +
        '&size=8' +
        '&name=' +
        this.searchName
      ).then(result => {
        if (result.code === 200) {
          this.userData = result.data.records
          this.total = result.data.total
          this.ziZuJianList = []
        } else {
          this.$message.error(result.message)
        }
        _this.userLoad = false
      })
    },
    handleManChange (rows) {
      console.log(rows)
      this.ziZuJianList = rows
      let newArr = []
      rows.forEach(item => {
        newArr.push(item.name)
      })
      this.selectedManList = newArr
      this.selectUsrId = []
      this.selectId = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selectUsrId.push(row.usrId)
            this.selectId.push(row.id)
          }
        })
      }
    },

    getCheckedMan () {
      // this.formInline.usingMan = this.selectedManList.join(',');
      console.log(this.selectedManList)
      this.dialogMan = false
    },

    // set => 父组件传值  确定按钮
    departmentOk () {
      this.$emit('childByValue', this.ziZuJianList)
    },

    // 选择使用人-取消
    departmentClose () {
      this.selectedManList = []
      this.$emit('childByValue', '0')
    }
  }
}
</script>

<style lang="scss" scope>
.pop-row {
  > .el-col:first-child {
    height: 480px;
    overflow: auto;
  }
}

.pagination_bottom {
  display: flex;
  justify-content: center;
  position: relative;

  .right {
    position: absolute;
    right: 40px;
    top: 20px;
  }
}
.el-pagination__jump
  .el-input.el-pagination__editor.is-in-pagination
  .el-input__inner {
  width: 50px;
}
/*.el-input .el-input__inner {*/
/*  width: 202px;*/
/*}*/

.demo-form-inline .el-form-item__content {
  width: 205px;
}

.allOder {
  padding-left: 10px;
  cursor: pointer;
}

.allOder.active {
  color: #409eff;
}

.addInput {
  color: #26a2ff;
  cursor: pointer;
}

.allot-query {
  .sb-el-tree {
    // min-width: 240px;
    // max-width: 300px;
    height: 425px;
    overflow: auto;
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

  .el-table {
    max-height: 530px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .el-dialog {
    width: 30%;
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

  .el-form--inline {
    .btn-group {
      display: block;
      text-align: center;
      margin-top: 20px;
    }
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

  .man-checkbox {
    .el-checkbox-group {
      width: 100%;
      box-sizing: border-box;

      .el-checkbox {
        width: 100%;
      }
    }

    .userId {
      display: inline-block;
      width: 50%;
      height: 48px;
      line-height: 48px;
    }

    .name {
      width: 33%;
    }

    .el-checkbox__input {
      width: 23%;
    }
  }

  .head {
    span {
      display: inline-block;
      width: 33%;
      text-align: left;
    }
  }

  .el-checkbox {
    display: block;
    width: 100%;
  }

  .el-checkbox__label {
    display: inline-block;
    width: 77%;
  }

  .sb-join {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  .small {
    padding: 8px 14px;
    font-size: 12px;
  }

  .addDia .el-input {
    display: block;
  }

  .man-checkbox .el-table__header {
    border-bottom: 1px #999 solid;
  }

  .man-checkbox .el-table th {
    background: #fff;
  }

  .all-people {
    color: blue;
    cursor: pointer;
  }

  .text-right {
    text-align: right;
    display: inline-block;
    margin-bottom: 9px;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
  }

  .flex-box {
    display: flex;
    justify-content: space-around;
  }

  .el-icon-circle-plus {
    font-size: 20px;
  }

  .el-table::before {
    height: 0px;
  }

  .special {
    .el-input {
      width: auto;
    }
  }

  .search_name {
    display: flex;
    justify-content: center;
  }
}
</style>
