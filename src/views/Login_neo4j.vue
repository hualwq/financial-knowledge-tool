<template>
  <el-container>
    <el-header>
      <h1>登录</h1>
    </el-header>
    <el-main>
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username" :rules="rules.username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="rules.password">
          <el-input type="password" @keyup.enter="handleLogin" v-model="form.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      const locktoken = 'token1'
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.form.username === 'neo4j' && this.form.password === 'neo4j6008') {
            // 登录成功，保存 token
            localStorage.setItem('token', locktoken); // 替换为实际 token
            console.log('登录成功');
            this.$router.push('/home');
          } else {
            // 登录失败
            console.log('用户名或密码错误');
            this.$message.error('用户名或密码错误');
          }
        } else {
          console.log('确认失败');
        }
      });
    }
  }
};
</script>

<style scoped>
el-header {
  text-align: center;
}
</style>
