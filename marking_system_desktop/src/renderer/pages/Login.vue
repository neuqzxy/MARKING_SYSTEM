<template>
    <div class="login">
        <h1 class="title">智 能 评 分 系 统</h1>
        <hr>
        <el-form :model="ruleForm" :rules="rules" ref="loginForm" label-width="100px" class="Form">
            <el-form-item label="用户名" prop="username" class="form-item">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="form-item">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button class="btn" type="primary" @click="submitForm('loginForm')">立即登录</el-button>
                <div class="btn" style="margin-left: 10px;">
                    <router-link class="register-text" :to="`/${this.$myVersion}/register`">
                        <el-button type="primary">我要注册</el-button>
                    </router-link>
                </div>
                <el-checkbox @change="changeRemember" class="pwd" v-model="ruleForm.remember">记住密码</el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        ruleForm: {
          username: '',
          password: '',
          remember: true
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 5, message: '用户名长度在 2 到 5 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 15, message: '用户名长度在 5 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeRemember (remember) {
        remember || this.$confirm('如果不记住密码，断线后需要您手动输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '我们将不会记住您的密码'
          })
        }).catch(() => {
          this.ruleForm.remember = true
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .login {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        .Form {
            width: 70%;
            min-width: 300px;
            margin: 0 auto;
            .form-item {
                margin-top: 50px;
                .btn {
                    float: left;
                    .register-text {
                        text-decoration: none;
                        color: #fff;
                        display: block;
                    }
                }
                .pwd {
                    float: right;
                }
            }
        }
    }

    @media screen and (max-width: 600px) {
        .login {
            .Form {
                width: 100%;
                margin-left: -20px;
                margin-right: -20px;
            }
        }
    }

    @media screen and (min-height: 650px) {
        .login {
            .Form {
                .form-item {
                    margin-top: 80px;
                }
            }
        }
    }
</style>
