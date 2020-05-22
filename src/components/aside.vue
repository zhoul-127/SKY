<template>
  <div :id="isCollapse?'leftCaiDan':'leftCaiDans'">
    <div v-if="isShow">
      <div :class="!isCollapse ? 'aside1' : 'aside'">
        <!-- 首页home-左菜单 -->
        <!-- 收缩按钮-左菜单 -->
        <div @click="isCollapse=!isCollapse" class="shrink clearfix">
          <h6>菜单</h6>
          <i v-if="isCollapse" class="iconfont icon-doublearrowleft-copy-copy"></i>
          <i v-else class="iconfont icon-shuangjiantou-copy"></i>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#eef1f6"
          text-color="#333"
          active-text-color="#1d73b5"
          :default-openeds="openeds"
          :unique-opened="false"
          :collapse="!isCollapse"
          width="264px">
          <el-submenu :index="'/'+item.apiUrl" v-for="(item,index) in asideMenus" :key="index">
            <template slot="title">
              <i class="iconfont icon" :class="item.cssClass"></i>
              <span class="font">{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/'+list.apiUrl" v-for="(list,key) in item.childMenu" :key="key">
                <router-link :to="list.apiUrl">{{list.name}}</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <!-- 首页 -->
    <div v-if="!isShow">
      <div :class="!isCollapse ? 'aside1' : 'aside'">
        <!-- 首页home-左菜单 -->
        <!-- 收缩按钮-左菜单 -->
        <div @click="isCollapse=!isCollapse" class="shrink clearfix">
          <h6>菜单</h6>
          <i v-if="isCollapse" class="iconfont icon-doublearrowleft-copy-copy"></i>
          <i v-else class="iconfont icon-shuangjiantou-copy"></i>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#eef1f6"
          text-color="#333"
          active-text-color="#1d73b5"
          :default-openeds="openeds"
          :unique-opened="false"
          :collapse="!isCollapse"
          width="264px">
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-chakan2"></i>
              <span>最近查看</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/' + item.apiUrl" v-for="(item,index) in seeData" :key="index">
              <router-link :to="item.apiUrl">{{item.name}}</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="iconfont icon-shoucang"></i>
              <span>我的收藏</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/' + item.apiUrl" v-for="(item,index) in collData" :key="index">
                <router-link :to="item.apiUrl">{{item.name}}</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data () {
    return {
      isShow: true,
      openeds: ['1', '2'], // 默认展开菜单序号
      asideMenus: [], // 左侧菜单
      isCollapse: true, // 菜单收缩状态
      seeData: [],
      collData: []
    }
  },
  created () {
    // 获取菜单
    let menus = this.$store.state.menus.data
    if (menus) {
      menus.forEach(item => {
        // console.log(item.apiUrl)
        item.childMenu.forEach(v2 => {
          // 默认菜单展开匹配
          let path = v2.apiUrl.split('?')
          this.openeds.push('/' + path[0])
          v2.childMenu.forEach(v3 => {
            if (v3.childMenu.length > 0) {
              // console.log('aaa')
              v3.childMenu.forEach(v4 => {
                if ('/' + item.apiUrl === this.$route.path || '/' + v2.apiUrl === this.$route.path || '/' + v3.apiUrl === this.$route.path || '/' + v4.apiUrl === this.$route.path) {
                  this.asideMenus = item.childMenu
                }
              })
            } else {
              // console.log('bbb')
              if ('/' + item.apiUrl === this.$route.path || '/' + v2.apiUrl === this.$route.path || '/' + v3.apiUrl === this.$route.path) {
                this.asideMenus = item.childMenu
              }
            }
          })
        })
      })
    }
    if (this.$route.path === '/' + 'home' || this.$route.path === '/' + 'seeDetails' || this.$route.path === '/' + 'collDetails') {
      this.isShow = false
    } else {
      this.isShow = true
    }
    this.dataList()
  },
  computed: {
    sortMenus:function () {
      return sortByKey(this.asideMenus, 'id')
    }
  },
  methods: {
    handleOpen (key, keyPath) {
    // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    // 获取查看和收藏列表
    dataList () {
      axiosGet('base/api/getViewCollect').then(res => {
        if (res.code === 200) {
          // this.$set(this,"seeData",res.data.viewList);
          // this.$set(this,"collData",res.data.collectList);
          this.seeData = res.data.viewList
          this.collData = res.data.collectList
          // localStorage.setItem('collData', JSON.stringify(res.data.collectList))
          // this.collData = JSON.parse(localStorage.getItem('collData'))
        }
      })
    },
  },
  watch: { // 监听路由获取菜单
    '$route.path': function (newVal) {
      this.dataList()
      let menus = this.$store.state.menus.data
      menus.forEach(item => {
        item.childMenu.forEach(v2 => {
          v2.childMenu.forEach(v3 => {
            if (v3.childMenu.length > 0) {
              v3.childMenu.forEach(v4 => {
                if ('/' + item.apiUrl === this.$route.path || '/' + v2.apiUrl === this.$route.path || '/' + v3.apiUrl === this.$route.path || '/' + v4.apiUrl === this.$route.path) {
                  this.asideMenus = item.childMenu
                }
              })
            } else {
              // console.log('bbb')
              if ('/' + item.apiUrl === this.$route.path || '/' + v2.apiUrl === this.$route.path || '/' + v3.apiUrl === this.$route.path) {
                this.asideMenus = item.childMenu
              }
            }
          })
        })
      })
      if (this.$route.path === '/' + 'home' || this.$route.path === '/' + 'seeDetails' || this.$route.path === '/' + 'collDetails') {
        this.isShow = false
      } else {
        this.isShow = true
      }
    }
    // collData(newVal, oldVal) {
    //   console.log(newVal, oldVal)
    // }
  }
}
// 菜单排序
function sortByKey (array, key) {
  return array.sort(function(a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : (x > y) ? 1 : 0)
  })
}
</script>
<style lang="scss">
  .home .el-main{
    height: 100% !important;
  }
  .is-vertical .el-container{
    height: 90% !important;
  }
  #leftCaiDan{
    min-width: 260px;
    overflow: hidden;
    height: 100%;
    width: 260px !important;
  }
  #leftCaiDan>div{
    overflow-y: scroll;
    overflow-x: hidden;
    height: 95%;
    width: 280px;
  }

  #leftCaiDans{
      overflow: hidden;
      height: 100%;
  }
  #leftCaiDans>div{
      overflow-x: hidden;
      height: 95%;
  }

.shrink {
  line-height: 40px;
  font-size: 14px;
  color: #999;
  padding: 0 15px;
  h6 {
    float: left;
    font-size: 16px;
    font-weight: normal;
  }
  .iconfont {
    font-size: 18px;
    color: #333;
    float: right;
  }
}
.el-menu-vertical-demo {
  background: transparent!important;
}
.el-menu {
  border:0;
}
.el-menu-item-group__title {
  display: none;
}
.el-menu-item:hover {
  background: #c2cad4!important;
}
.el-submenu__title {
  // background: transparent!important;
  background: #DF8715!important;
  padding: 0 12px!important;
  color: #fff!important;
  font-size: 15px;
  margin-bottom: 3px;
  height: 44px;
  line-height: 44px;
  box-shadow: -16px -2px 15px -16px orange inset!important;
  // border-bottom: 1px #E1E6ED solid;
  .iconfont {
    color: #fff;
    margin-right: 13px;
    font-size: 16px;
    border: 1px #fff solid;
    padding: 5px;
    border-radius: 50%;
  }
  i {
    color: #fff;
  }
}
.el-submenu.is-active {
    .el-submenu__title {
    border-bottom: 1px #DF8715 solid;
  }
}
.aside {
  min-width: 220px;
  // overflow: hidden;
  background: #EDF2F8;
  .el-menu-item {
    background: #EDF2F8!important;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    padding: 0!important;
    box-shadow: -16px -2px 15px -16px #ddd inset!important;
    a {
      color: #666;
      padding: 0 20px 0 50px;
      display: block;
    }
  }
  .el-menu-item.is-active a{
    color: #330300;
    background: #E0E0E0;
    display: block;
  }
  .el-submenu__icon-arrow {
    right: 15px;
  }
}
.aside1 {
  width: 60px;
  background: url('../assets/images/aside-bg.jpg') repeat-y right;
  .shrink {
    float: left;
  }
  h6 {
    display: none;
  }
  .font {
    display: none;
  }
  .el-menu--collapse {
    width: 60px;
    overflow: hidden;
    .el-submenu__icon-arrow {
      display: none;
    }
  }
  .el-menu-item-group {
    ul {
      display: none;
    }
  }
  .el-submenu__icon-arrow {
    display: none;
  }
}
</style>
