<!--
 * @Description: 选择部门公共组件
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-23 13:51:20
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 11:09:33
 -->
<template>
  <div class="selectDept">
    <el-dialog top="4vh"
               title="选择部门"
               width="50%"
               height="100%"
               :visible.sync="dialogShow"
               :before-close="beforeClose">
      <el-row>
        <el-col :span="12"><b>部门架构</b></el-col>
        <el-col :span="12"
                class="pl10"><b>当前选中部门</b></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
                class="sb-el-tree">
          <el-tree :data="deptList"
                   show-checkbox
                   :default-expand-all="defaultExpandAll"
                   :default-expanded-keys="[2]"
                   highlight-current
                   node-key="id"
                   :props="defaultProps"
                   ref="tree"
                   class="tree"
                   @check="handleNodeClick"
                   :filter-node-method="filterNode"></el-tree>
        </el-col>
        <el-col :span="12"
                class="tree">
          <div class=" pl10"
               v-for="(item,index) in currentDepartment"
               :key="index">&emsp;{{item.name}}</div>
        </el-col>
      </el-row>

      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   @click="dialogShow=false">取 消</el-button>
        <el-button type="primary"
                   @click="getCheckedDept()"
                   size="small">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDeptList } from '@/api/commonApi.js'
export default {

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      deptList: [],
      defaultExpandAll: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentDepartment: []
    }
  },
  computed: {
    dialogShow: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  },
  watch: {
    dialogShow () {
      if (this.dialogShow) {
        this.getDeptList()
      } else {
        this.currentDepartment = []
      }
    }
  },
  methods: {
    // 点击最左侧树结构
    handleNodeClick (data, checked, node) {
      // 如果是父级节点，则全选全部
      if (data.children.length > 0) {
        data.children.forEach(data => {
          // 判断是否重复
          if (this.currentDepartment.findIndex(e => e.id === data.id) > -1) {
            this.currentDepartment = this.currentDepartment.filter(e => e.id !== data.id)
            return
          }

          this.currentDepartment.push(data)
        })

        return
      }
      // 如果是子集节点
      // 判断是否重复
      if (this.currentDepartment.findIndex(e => e.id === data.id) > -1) {
        this.currentDepartment = this.currentDepartment.filter(e => e.id !== data.id)
        return
      }

      this.currentDepartment.push(data)
    },
    // 树形结构节点过滤
    filterNode: function (value, data) {
      if (value) return true
    },
    // 获取树列表
    getDeptList () {
      getDeptList().then((res) => {
        if (res.code === 200) {
          this.deptList = res.data
        }
      })
    },
    beforeClose () {
      this.dialogShow = false
    },
    getCheckedDept () {
      this.dialogShow = false
      this.$emit('getCheckedDept', this.currentDepartment)
    }
  }
}
</script>

<style lang="scss" scoped>
.selectDept {
  .tree {
    height: 500px;
    overflow: hidden;
    overflow-y: scroll;
  }

  /deep/ .el-tree-node__label {
    margin-left: 5px;
  }
}
</style>
