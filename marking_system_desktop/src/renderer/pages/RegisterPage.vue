<template>
    <div class="register">
        <h1 class="title">R e g i s t e r</h1>
        <el-form :model="ruleForm" :rules="rules" ref="registerForm" label-width="100px" class="Form" status-icon>
            <el-form-item class="form-item" label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="重复密码" prop="rePassword">
                <el-input v-model="ruleForm.rePassword"></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="验证码" prop="authCode">
                <div class="double-item">
                    <el-input v-model="ruleForm.authCode" style="flex-grow: 1;"></el-input>
                    <el-button style="width: 140px; margin-left: 10px;" type="primary" :loading="getAuthCodeLoading" @click="getAuthCode('registerForm')">{{getAuthCodeText}}</el-button>
                </div>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button style="float: left;" type="primary" :loading="registerLoading" @click="submitForm('registerForm')">立即注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import axios from 'axios'
  import api from '../config/api.config'

  export default {
    data () {
      // 保证两次密码相同
      const checkPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      // 检测验证码是否正确
      const checkAuthCode = (rule, value, callback) => {
        axios.post(`${api.basePath}/api/register/check/authcode`, {
          authCode: value
        }).then(res => {
          if (res.data.code === 1000) {
            callback()
          } else if (res.data.code === 1001) {
            callback(new Error('验证码错误'))
          } else if (res.data.code === 1005) {
            callback(new Error('表单有误'))
          } else {
            callback(new Error('请求出错'))
          }
        })
      }
      const checkUsername = (rule, value, callback) => {
        this.check('用户名', callback, `/api/register/check/username?username=${value}`)
      }
      const checkEmail = (rule, value, callback) => {
        this.check('邮箱', callback, `/api/register/check/email?email=${value}`)
      }
      return {
        getAuthCodeText: '获取验证码',
        getAuthCodeLoading: false,
        registerLoading: false,
        ruleForm: {
          username: '',
          password: '',
          rePassword: '',
          email: '',
          authCode: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'},
            {validator: checkUsername, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
          ],
          rePassword: [
            {required: true, message: '请重复密码', trigger: 'blur'},
            {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'},
            {validator: checkPassword, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          authCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 4, max: 6, message: '长度不符合规范', trigger: 'blur'},
            {validator: checkAuthCode, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 注册
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.registerLoading = true
            const {username, password, email, authCode} = this.ruleForm
            axios.post(`${api.basePath}/api/register`, {
              username,
              password,
              email,
              authCode
            }).then(res => {
              this.registerLoading = false
              switch (res.data.code) {
                case 1000:
                  this.$message.success('注册成功')
                  break
                case 1004:
                  this.$message.error('请求出现未知错误')
                  break
                case 1006:
                  this.$message.warning('请不要临时修改邮箱，现在请您重新获取验证码')
                  break
                case 1005:
                  this.$message.warning('表单填写不完整')
                  break
                case 1007:
                  this.$message.error('存储表单时发生错误')
                  break
                case 1008:
                  this.$message.warning('请勿重复提交表单')
                  break
                default:
                  this.$message.error('发生未知错误')
              }
            })
          } else {
            return false
          }
        })
      },
      // 获取验证码
      getAuthCode (formName) {
        this.$refs[formName].validateField('email', (valid) => {
          if (!valid) {
            (function a (sec) {
              this.getAuthCodeText = `${sec}s后重新获取`
              if (sec > 0) {
                this.getAuthCodeLoading = true
                setTimeout(() => {
                  a.call(this, sec - 1)
                }, 1000)
              } else {
                this.getAuthCodeLoading = false
                this.getAuthCodeText = '获取验证码'
              }
            }).call(this, 60)
            axios.get(`${api.basePath}/api/register/authcode`, {
              params: {
                email: this.ruleForm.email
              }
            }).then(res => {
              if (res.data.code === 1000) {
                this.$message.success('验证码已成功发送至您的邮箱')
              } else if (res.data.code === 1002) {
                this.$message.error('验证码发送失败，请检查您的邮箱')
              }
            })
          }
        })
      },
      check (type, callback, url) {
        axios.get(`${api.basePath}${url}`).then(res => {
          switch (res.data.code) {
            case 1000:
              callback()
              break
            case 3001:
              callback(new Error(`${type}重复`))
              break
            case 3002:
              callback(new Error('出现未知错误'))
              break
            case 3003:
              callback(new Error('表单填写有误'))
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .register {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        align-items: center;
        .title {
            height: 30px;
        }
        .Form {
            flex-grow: 1;
            width: 70%;
            .form-item {
                margin-top: 35px;
            }
            .double-item {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
            }
        }
    }

    @media screen and (max-width: 600px) {
        .register {
            .Form {
                width: 100%;
                margin-left: -20px;
                margin-right: -20px;
            }
        }
    }

    @media screen and (min-height: 650px) {
        .register {
            .Form {
                .form-item {
                    margin-top: 50px;
                }
            }
        }
    }

    @media screen and (max-height: 590px) {
        .register {
            .Form {
                .form-item {
                    margin-top: 25px;
                }
            }
        }
    }

    @media screen and (max-height: 530px) {
        .register {
            .Form {
                .form-item {
                    margin-top: 10px;
                }
            }
        }
    }
</style>
