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
              :class="['dbbottom',i1===0? 'dbtop':'','vcenter']"
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
                  :class="[i2===0 ? '':'dbtop','vcenter']"
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
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRoles(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
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
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加" :visible.sync="addRolesVisible" @closed="handleRoles" width="50%">
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRefs"
        label-width="100px"
      >
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
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRolesVisible" width="50%" closed="setTestClose">
 <el-tree :data="rolesList" :props="treeProps" ref="treesRefs" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      setRolesVisible: false,
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
      },
      defKeys: [],
      roleId: '',
      treeProps: {
        // 通过label设置树形节点文本展示authName
        label: 'authName',
        // 设置通过children属性展示子节点信息
        children: 'children'
      }
      // 设置树形控件中默认选中的内容

      // 保存正在操作的角色id

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      this.rolesList = res.data
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
    },
    async removeRoles (role, id) {
      await this.$confirm('删除权限', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'roles/' + role.id + '/rights/' + id
          )
          //   获取最细 数据不需要重新渲染页面
          role.children = res.data
        //   console.log(res.data)
        })
        .catch(() => {})
    },
    async showSetDialog (row) {
      const { data: res } = await this.$http.get('rights/tree')
      this.setRolesVisible = true
      this.rightsList = res.data
      this.roleId = row.id
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defKeys.push(item3.id)
          })
        })
      })
    },
    setTestClose () {
      this.defKeys = []
    },
    async allotRights () {
      // 当用户在树形权限对话框中点击确定，将用户选择的
      // 权限发送请求进行更新

      // 获取所有选中及半选的内容
      const keys = [
        //   若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treesRefs.getCheckedKeys(),
        // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.treesRefs.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)
      // 当确定时候发送ajax请求
      await this.$http.post('roles/' + this.roleId + '/rights', { rids: idStr })
      //   重新渲染页面
      this.getRolesList()
      //   让对话框消失
      this.setRolesVisible = false
    }
  }
}
</script>
<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
