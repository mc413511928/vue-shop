<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单展示 -->
      <el-table :data="odersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
     <el-dialog title="修改用户" :visible.sync="edilogVisible" width="50%" @close="ediCloseForm">
      <el-form ref="ediformRef" :rules="ediformRules" :model="ediForm" label-width="80px">
      <el-form-item label="省市区县" prop="address1">
            <el-cascader :options="cityData" v-model="ediForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="ediForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
    <!-- 物流进度信息 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
  <el-timeline>
    <el-timeline-item
      v-for="(item, i) in progressInfo"
      :key="i"
      :timestamp="item.ftime">
      {{item.context}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      odersList: [],
      total: 0,
      edilogVisible: false,
      ediForm: {
        address1: [],
        address2: ''
      },
      cityData,

      ediformRules: {
        address1: [
          { required: true, message: '请选择城市', trigger: 'blur' },
          {

            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          {
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOdersList()
  },
  methods: {
    async getOdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      this.odersList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newPages) {
      this.queryInfo.pagenum = newPages
      this.getOdersList()
    },
    handleCurrentChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOdersList()
    },
    showBox () {
      this.edilogVisible = true
    },
    ediCloseForm () {
      this.$refs.ediformRef.resetFields()
    },
    editEnter () {

    },
    async showProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      this.progressVisible = true
      this.progressInfo = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
