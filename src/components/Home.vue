<template>

  <el-container class="homecontainer">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
            <el-button type="info" @click="handelLoginout">退出123</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
         <el-menu  background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item  :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
          </template></el-menu-item>
        </el-submenu>
    </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: null,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    handelLoginout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
        console.log(res)
      }
    }
  }
}
</script>
<style lang="less" scope>
.homecontainer{
  height: 100%;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside{
  background-color:#333744
}
.el-main{
  background-color:#eaedf1;
}
</style>
