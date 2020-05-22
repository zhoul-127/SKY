<template>
    <div>
      <div class="crumb">
        <ul class="clearfix">
          <li v-for="(item,index) in arrCrumb" :key="index" v-html="item">{{item}}</li>
          <!-- <router-link to="/" tag="li" v-for="(item,index) in arrCrumb" :key="index">{{item}}</router-link> -->
        </ul>
      </div>
    </div>
</template>
<script>
import { constApi } from "@/api/index.js"
export default {
  data() {
    return {
      crumb: '',
      arrCrumb: []
    }
  },
  created() {
    // 面包屑内容获取
    let menus = this.$store.state.menus.data
    // console.log(menus)
    if (menus) {
      menus.forEach (v1 => {
        if (v1.childMenu.length < 1) {
          if ('/' + v1.apiUrl === this.$route.path) {
            this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>`
          }
        }
        v1.childMenu.forEach(v2 => {
          if (v2.childMenu) {
            v2.childMenu.forEach(v3 => {
              if (v3.childMenu) {
                // v3.childMenu.forEach(v4 => {
                  // if (v4.childMenu) {
                    if (this.$route.path.indexOf(v1.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>`
                    } else if (this.$route.path.indexOf(v2.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>` + '-' +  `${v2.name}`
                    } else if (this.$route.path.indexOf(v3.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>` + '-' + `${v2.name}` + '-' + `<a href="#/${v3.apiUrl}">${v3.name}</a>`
                    }
                  // }
                // })
              }
            })
          }
        })
      })
    }
    this.arrCrumb = this.crumb.split('-')
  },
  watch: {
    // 监听路由获取面包屑内容
    '$route.path':function(newVal) {
      let menus = this.$store.state.menus.data
      menus.forEach(v1 => {
        if (v1.childMenu.length < 1) {
          if ('/' + v1.apiUrl === this.$route.path) {
            this.crumb = v1.name
          }
        }
        v1.childMenu.forEach(v2 => {
          if (v2.childMenu) {
            v2.childMenu.forEach(v3 => {
              if (v3.childMenu) {
                // console.log(v3.apiUrl)
                // v3.childMenu.forEach(v4 => {
                  // if (v4.childMenu) {
                    // if ('/' + v1.apiUrl === this.$route.path) {
                    //   this.crumb = v1.name
                    // } else if ('/' + v2.apiUrl === this.$route.path) {
                    //   this.crumb = v1.name + '>>' + v2.name
                    // } else if ('/' + v3.apiUrl === this.$route.path) {
                    //   this.crumb = v1.name + '>>' + v2.name + '>>' + v3.name
                    // }
                    if (this.$route.path.indexOf(v1.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>`
                    } else if (this.$route.path.indexOf(v2.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>` + '-' +  `${v2.name}`
                    } else if (this.$route.path.indexOf(v3.apiUrl) != -1) {
                      this.crumb = `<a href="#/${v1.apiUrl}">${v1.name}</a>` + '-' + `${v2.name}` + '-' + `<a href="#/${v3.apiUrl}">${v3.name}</a>`
                    }
                  // }
                // })
              }
            })
          }
        })
      })
      this.arrCrumb = this.crumb.split('-')
    }
  }
}
</script>
<style lang="scss">
  // 面包屑
  .crumb {
    // margin-bottom: 20px;
    padding: 0 20px;
    background: #ECEFF4;
    line-height: 40px;
    
    li {
      display: inline-block;
      padding-right: 10px;
      font-size: 14px;
      color: #999;
      background: url('../assets/images/arrow-icon.png') no-repeat right;
      padding: 0 20px 0 10px;
      a {
        color: #999;
      }
    }
    // li:last-of-type{
    //   background: none;
    // }
  }
</style>
