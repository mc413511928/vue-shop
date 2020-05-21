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
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品的参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品的图片"></el-step>
        <el-step title="商品的内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品的价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品的重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品的数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expandTrigger="hover"
                v-model="addForm.goods_cat"
                :options="catList"
                :props="catProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品的参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item, i) in manyList" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cd" v-for="(cd, k) in item.attr_vals" :key="k" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item, i) in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品的图片" name="3">
            <el-upload
              :action="UrlUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm. goods_introduce"></quill-editor>
            <el-button>添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片 -->
    <el-dialog
      title="提示"
      :visible.sync="previewdialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <img :src="previewPath|upl" alt />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      catList: [],
      activeIndex: '0',
      UrlUpload: 'http://127.0.0.1:8888/api/private/v1/upload',
      previewdialogVisible: false,
      addFormrules: {
        goods_price: [
          {
            type: 'number',
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '商品价格是数字',
            trigger: 'blur'
          }
        ],
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名称在3~10个字符之间',
            trigger: 'blur'
          }
        ],

        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          },
          {
            message: '商品数量不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          },
          {
            message: '商品重量不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        goods_introduce: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名称在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [1, 2, 5],

        goods_introduce: '',
        pics: []
      },

      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyList: [],
      onlyList: [],
      // 上传图片的列表
      fileList: [],
      // 图片上传组件的headers请求头
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      previewPath: ''
    }
  },
  created () {
    this.getCatList()
  },
  computed: {
    cataId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    // 获取所有商品分类
    async getCatList () {
      const { data: res } = await this.$http.get('categories')
      this.catList = res.data
    },
    // 级联选择器选中项发生变化，会触发这个函数
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // activeName即将进去的标签页面
    // oldActiveName即将离开的标签页面
    beforeLeaveTab (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        return false
      }
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          'categories/' + this.cataId + '/attributes/',
          { params: { sel: 'many' } }
        )
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyList = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          'categories/' + this.cataId + '/attributes/',
          { params: { sel: 'only' } }
        )
        this.onlyList = res.data
      }
    },
    handlePreview (file) {
      console.log(file)
      // this.previewPath = file.response.data.url
      this.previewPath = file.response.data.tmp_path

      this.previewdialogVisible = true

      // 处理图片预览效果
    },
    handleRemove (file) {
      // 处理移出图片的操作
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(t => t.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功
    handleSuccess (response) {
      const obj = { pic: response.data.tmp_path }
      this.addForm.pics.push(obj)
    },
    handleClose () {
      this.previewdialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 3px;
}
.el-button {
  margin-top: 15px;
}
</style>
