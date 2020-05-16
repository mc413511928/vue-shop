<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <!-- 获取权限列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 数据的渲染 -->
          <template slot-scope="scope">
            <!-- {{scope.row.children}} -->
            <el-row
              :class="['dbbottom',i1===0? 'dbtop':'']"
              v-for="(item1, i1) in scope.row.children "
              :key="item1.id"
            >
              <!-- 渲染第一级 -->
              <el-col :span="5">
                <el-tag>
                  {{item1.authName}}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <el-col :span="19">
                <!-- 二级渲染 -->
                <el-row
                  :class="[i2===0 ? '':'dbtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">
                      {{item2.authName}}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                      <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id">
             {{item3.authName}}
                      </el-tag>

                  </el-col>

                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
       <el-dialog title="添加" :visible.sync="addRolesVisible" @closed="handleRoles" width="50%">
      <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRefs" label-width="100px">
        <el-form-item label="角色名称" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
          <el-form-item label="角色描述" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      addRolesVisible: false,
      addRolesForm: {
        roleDesc: '',
        roleName: ''
      },
      addRolesFormRules: {},
      addRolesFormRefs: {
        roleDesc: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      this.rolesList = res.data
      console.log(res)
    },
    addRoles () {
      this.addRolesVisible = true
    },
    handleRoles () {
      this.$refs.addRolesFormRefs.resetFields()
    },
    addForm () {
      this.$refs.addRolesFormRefs.validate(async valid => {
        if (valid) {
          await this.$http.post('roles', this.addRolesForm)
          this.getRolesList()
          this.$message.success('添加用户成功')
          this.addRolesVisible = false
        }
      })
    }
  }

}
</script>
<style lang="less" scope>
.el-row {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #ccc;
}
.dbbottom {
  border-bottom: 1px solid #ccc;
}
</style>
