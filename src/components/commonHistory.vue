<template>
  <div>
  <div class="query-title">审批历史</div>
    <el-table
      :data="approveHistory"
      tooltip-effect="dark"
      border
      style="width: 100%"
      class="history"
    >
      <el-table-column width="100">
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
      <el-table-column prop="name" label="节点" width="180"></el-table-column>
      <el-table-column prop="assigneeName" label="操作人" width="130"></el-table-column>
      <el-table-column prop="formKey" label="操作" width="130"></el-table-column>
      <el-table-column prop="endTime" label="操作时间" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="审批意见">
        <template slot-scope="scope">
          <div v-if="!scope.row.mapVOS[0].approvalOpinion && scope.row.formKey!='待审批'">— —</div>
          <a
            v-else
            :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion"
          >{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  props: ["childId"],
  filters: {
    ellipsis(value) {
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
  watch: {
    childId: {
      immediate: true,
      handler(val) {
        this.getApprovalHistory();
      }
    }
  },
  methods: {
    getApprovalHistory() {
      axiosGet(
        "approvalHistoryController/history?applicationNum=" + this.childId
      ).then(result => {
        this.approveHistory = result.data;
      });
    }
  }
};
</script>
<style lang="">
</style>
