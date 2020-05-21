<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card :body-style="{ padding: '0px' }">
      <!-- 警告提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cat_opp">
        <el-col>
          <span class="cat_opt">选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- selectedCateKeys为选中的id -->
          <!-- catesProps级联配置对象 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectedCateKeys"
            :options="paramsList"
            :props="catesProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="addDialogVisible=true" :disabled="isDisable">添加参数</el-button>
          <el-table :data="manyDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handClosed( scope.row,i)"
                >{{item}}</el-tag>
                  <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisable" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i" @close="handClosed(scope.row,i)">{{item}}</el-tag>
                 <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClosed"
    >
      <el-form ref="addformRefs" :rules="addformRules" :model="addForm" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="ediDialogVisible"
      width="50%"
      @close="ediClosed"
    >
      <el-form ref="ediformRefs" :rules="ediformRules" :model="ediForm" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="ediForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ediDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  data () {
    return {
      paramsList: [],
      catesProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyDate: [],
      onlyDate: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addformRules: {
        attr_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      ediDialogVisible: false,
      ediForm: {
        attr_name: ''
      },
      ediformRules: {
        attr_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getParamsList()
  },
  computed: {
    isDisable () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cataId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      this.paramsList = res.data
    },
    handleChange () {
      this.paramsDate()
    },
    // 点击tab选项触发的事件
    handleTabClick () {
      this.paramsDate()
    },
    async paramsDate () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyDate = []
        this.onlyDate = []
      } else {
        // console.log(this.selectedCateKeys)
        const { data: res } = await this.$http.get(
          'categories/' + this.cataId + '/attributes',
          { params: { sel: this.activeName } }
        )

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyDate = res.data
        }
        if (this.activeName === 'only') {
          this.onlyDate = res.data
        }
        console.log(res)
      }
    },
    addClosed () {
      this.$refs.addformRefs.resetFields()
    },
    addParams () {
      this.$refs.addformRefs.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories/' + this.cataId + '/attributes',
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          )
          this.addDialogVisible = false
          this.paramsDate()
          console.log(res)
        }
      })
    },
    ediClosed () {
      this.$refs.ediformRefs.resetFields()
    },
    async showDialog (id) {
      // 查询当前修改的信息

      const { data: res } = await this.$http.get(
        'categories/' + this.cataId + '/attributes/' + id,
        { params: { attr_sel: this.activeName } }
      )
      this.ediForm = res.data
      this.ediDialogVisible = true
    },
    ediParams () {
      this.$refs.ediformRefs.validate(async valid => {
        const { data: res } = await this.$http.put(
          'categories/' + this.cataId + '/attributes/' + this.ediForm.attr_id,
          { attr_name: this.ediForm.attr_name, attr_sel: this.activeName }
        )
        this.paramsDate()
        this.ediDialogVisible = false
      })
    },
    // 删除分类操作
    deleteParams (id) {
      this.$confirm('提示', '确认删除分类吗', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'categories/' + this.cataId + '/attributes/' + id,
            { params: {} }
          )
          this.paramsDate()
        })
        .catch(() => {})
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put('categories/' + this.cataId + '/attributes/' + row.attr_id, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
    },
    // handleInputConfirm (row) {

    // },
    handleInputConfirm: _.debounce(function (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      this.saveAttrVals(row)
    }, 500, true),
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // 让文本框自动获得焦点
        // 当页面渲染完毕再执行回调函数
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handClosed (row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.attr_vals.splice(index, 1)
        this.saveAttrVals(row)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opp {
  margin: 15px 0;
}

.cat_opt {
  margin: 0 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
