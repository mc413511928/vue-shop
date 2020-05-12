<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
                 <el-form-item prop="username">
                <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                 <!-- 密码 -->
                    <el-form-item prop="password">
                <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"  show-password></el-input>
                </el-form-item>
                    <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
         <el-button type="info" @click="restLoginForm">重置</el-button>
                    </el-form-item>
            </el-form>
            <!-- 密码 -->
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单验证规则每一个属性都是一个规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [{ require: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11个字符', trigger: 'blur' }],
        // 验证密码是否合法
        password: [{ require: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 8 到 16个字符', trigger: 'blur' }]

      }
    }
  },
  methods: {
    // 表单的重置
    restLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单的 预验证
    async login () {
      // 方式一回调函数
      // this.$refs.loginFormRef.validate(valited => {
      //   console.log(valited)

      // })
      // 方式二传统promise
      // 异步函数
      try {
        await this.$refs.loginFormRef.validate()
        // 发送请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)

        if (res.meta.status === 200) {
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('home')
        } else {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
        }
      } catch (error) {

      }
    }
  }

}
</script>
<style lang="less" scope>
.login_container{
background-color:#2b4b6b;
height:100%;
}
.login_box{
 width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form{
      position:absolute;
      bottom: 0;
       width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  }
.btns {
  display: flex;
  justify-content: flex-end;
}

}
</style>
