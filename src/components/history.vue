<template>
  <el-table :data="approveHistory" tooltip-effect="dark" style="width: 100%" class="history">
    <el-table-column width="120">
      <template slot-scope="scope">
        <i class="el-icon-s-help" v-if="scope.row.formKey=='已提交'"></i>
        <i
          v-else-if="scope.row.formKey=='已审批' || scope.row.formKey=='审批完成'"
          class="el-icon-success"
        ></i>
        <i v-else-if="scope.row.formKey=='驳回'" class="el-icon-error"></i>
        <i v-else></i>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="节点" width="120"></el-table-column>
    <el-table-column prop="assigneeName" label="操作人" width="140"></el-table-column>
    <el-table-column prop="formKey" label="操作" width="120"></el-table-column>
    <el-table-column prop="endTime" label="操作时间" show-overflow-tooltip></el-table-column>
    <el-table-column label="审批意见">
      <template slot-scope="scope">
        <a
          :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion"
        >{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  props: ['childId'],
  filters: {
    ellipsis(value) {
      console.log(value);
      if (!value) return "";
      if (value.length <= 60) {
        return value;
      } else {
        return value.slice(0, 60) + "...";
      }
    }
  },
  data() {
    return {
      approveHistory: []
    };
  },
  created() {
    console.log(this.childId);
    axiosPost("approval/history", {
      id: this.childId
    }).then(result => {
      console.log("审批历史——————————————————————————");
      console.log(result.data);
      this.approveHistory = result.data;
    });
  }
};
</script>
<style lang="">
</style>