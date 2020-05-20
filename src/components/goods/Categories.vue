<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card :body-style="{ padding: '0px' }">
      <el-row>
        <el-col>
          <el-button type="primary" @click="shOWCatClass">添加分类</el-button>
        </el-col>
        <tree-table
          :data="cateList"
          :columns="columns"
          border
          :selectable="false"
          :expand-type="false"
          show-index
          index-text="#"
          :show-row-hover="false"
        >
          <template slot="isOk" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <template slot="oder" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="opt" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
        <!-- 编辑修改作用域插槽 -->

        <!-- 操作 -->
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog title="新建分类" :visible.sync="addCatlogVisible" @closed="closeCate" width="50%">
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRefs"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="cat_pid">
            <el-cascader
              expandTrigger="hover"
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <el-button @click="addCatlogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },

      addCatlogVisible: false,
      total: 0,
      columns: [
        { title: '分类名称', key: 'cat_name' },
        {
          title: '是否有效',

          type: 'template',
          template: 'isOk'
        },
        {
          title: '排序',

          type: 'template',
          template: 'oder'
        },
        {
          title: '是否有效',

          type: 'template',
          template: 'opt'
        }
      ],
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        // 添加分类的等级，0则表示添加一级分类
        cat_level: 0
      },
      addCateFormRules: {
        // 验证规则
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      parentCateList: [],
      // 绑定用户选择的分类值
      selectedKeys: []
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    async getCategories () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 分页功能
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // 再次渲染数据
      this.getCategories()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategories()
    },
    shOWCatClass () {
      this.getParentCateList()
      this.addCatlogVisible = true
    },
    handelAdd () {
      this.addCatlogVisible = false
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      this.parentCateList = res.data
    },

    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    closeCate () {
      this.$refs.addCateFormRefs.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
      this.$refs.addCateFormRefs.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.addCateForm)

          this.$message.success('添加分类成功')
          this.getCategories()

          this.addCatlogVisible = false
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
