<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

#app{
  height: 100%;
}
// 折叠面板
.common-collapse {
  .el-collapse-item__header {
    background: #eff2f9;
    padding-left: 8px;
    height: 30px;
    line-height: 30px;
  }
  .collapse-title {
    font-weight: 600;
  }
  .el-collapse-item__content {
    padding: 20px 0 20px;
  }
  .el-collapse-item__wrap {
    border-bottom-color: transparent;
  }
}
</style>
