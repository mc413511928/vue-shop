<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card :body-style="{ padding: '0px' }">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品描述" width="180"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">{{scope.row.add_time| dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="ediGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGodds(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsList: [],
      activeIndex: 1,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10

      },

      total: 0,
      addGoodslogVisible: false,
      goodsFormRefs: {}
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    addGoods () {
      this.$router.push('/goods/add')
    },
    ediGoods () {},
    changeState () {},
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    handelGoods () {},
    addGoddsSend () {},
    removeGodds (id) {
      this.$confirm('确认删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('goods/' + id)
        this.getGoodsList()
      }).catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
</style>
