<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- k卡片视区 -->
    <el-card :body-style="{ padding: '0px' }">
      <el-alert title="消息提示的文案" type="info" center></el-alert>
      <el-steps :space="200" :active="activeIndex" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品的参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品的图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title=""></el-step>
      </el-steps>
      <el-tabs :tab-position="'left'" style="height: 200px;">
        <el-tab-pane label="商品信息">商品信息</el-tab-pane>
        <el-tab-pane label="商品的参数">商品的参数</el-tab-pane>
        <el-tab-pane label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane label="商品的图片">商品的图片</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
</style>
