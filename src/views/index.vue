<template>
  <div class="home">
    <el-container>
      <el-header height="80px">
        <!-- 头部 组件-->
        <header-top v-if="isNew"></header-top>
      </el-header>
      <el-container>
        <!-- 左侧菜单 组件-->
        <!-- <aside-menu></aside-menu> -->
        <!-- 右侧内容 组件-->
        <el-main id="scaleing">
          <router-view class="main-view"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import header from "@/components/header.vue";
 import jsadmin from "@/views/personal/jsadmin.vue";
export default {
  data() {
    return {
      menuList: [],
      crumb: "",
      arrCrumb: [],
      isNew: true
    };
  },
  components: {
    "header-top": header,
    jsadmin: jsadmin,
  },
  methods: {
  },
  created () {
  }
};
</script>
<style lang="scss" scoped>
.home {
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
  height: 100%;
  background: linear-gradient(
    #004ea2 0%,
    #004ea2 20%,
    #edf2f8 20%,
    #edf2f8 100%
  );
  .el-main {
    // margin: 0 30px 80px 0;
	padding: 0;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .main-view {
      margin: 20px;
      height: 100%;
    }
  }
  .el-header {
    background: #0f1a4a;
    padding: 0;
    overflow: hidden;
    color: #fff;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background: #eef1f6;
  }
  .menu {
    .title {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background: #d7ddeb;
    }
    li {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
  }
  .el-row {
    position: relative;
  }
  #scaleing {
    overflow: hidden!important;
  }
}
</style>
