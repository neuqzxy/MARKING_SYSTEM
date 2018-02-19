<template>
    <div class="login">
        <a @click="goGithub" href="https://github.com/neuqzxy/MARKING_SYSTEM.git"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/c6625ac1f3ee0a12250227cf83ce904423abf351/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_gray_6d6d6d.png"></a>
        <h1 class="title">实 时 评 分 系 统</h1>
        <hr>
        <el-form :model="ruleForm" :rules="rules" ref="loginForm" label-width="100px" class="Form">
            <el-form-item label="用户名" prop="username" class="form-item">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="form-item">
                <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button :disabled="downloading" class="btn" type="primary" @click="submitForm('loginForm')">立即登录</el-button>
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
  import { mapGetters, mapMutations } from 'vuex'
  import {MarkingSystem} from '~src/db/index'
  import electron from 'electron'
  import api from '../config/api.config'

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
            {min: 3, max: 6, message: '用户名长度在 2 到 6 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 15, message: '密码长度在 5 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        online: 'getOnLine',
        downloading: 'getDownloading'
      })
    },
    created () {
      this.initLoginForm()
    },
    methods: {
      ...mapMutations({
        changeOnLineState: 'setOnLineState',
        setUsername: 'setUsername'
      }),
      goGithub (e) {
        e.preventDefault()
        electron.shell.openExternal('https://github.com/neuqzxy/MARKING_SYSTEM.git')
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.info('正在连接...')
            this.storeToLocal()
            this.doLogin(this.ruleForm.username, this.ruleForm.password)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeRemember (remember) {
        remember || this.$confirm('您的密码将经过加密处理，如果不记住密码，断线后需要您手动输入密码', '提示', {
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
      },
      initLoginForm () {
        const {username, password} = MarkingSystem.get('User').value()
        this.ruleForm.username = username
        this.ruleForm.password = password
        /* this.ruleForm.username = localStorage.getItem('username')
        this.ruleForm.password = localStorage.getItem('password') */
      },
      storeToLocal () {
        if (this.ruleForm.remember) {
          MarkingSystem.set('User.username', this.ruleForm.username).set('User.password', this.ruleForm.password).write()
          /* localStorage.setItem('username', this.ruleForm.username)
          localStorage.setItem('password', this.ruleForm.password) */
        } else {
          MarkingSystem.set('User.username', '').set('User.password', '').write()
        }
      },
      doLogin (username, password) {
        // this.$socket = this.$io.connect(`${api.basePath}`)
        if (window.$socket) {
          window.$socket.destroy()
        }
        window.$socket = this.$io.connect(`${api.basePath}`, {
          reconnection: true,
          reconnectionDelay: 200,
          reconnectionAttempts: 5,
          reconnectionDelayMax: 3000
        })
        window.$socket.on('connect', () => {
          window.$socket.emit('authentication', {username: username, password: password})
          window.$socket.on('authenticated', () => {
            this.$message.success('连接成功')
            this.changeOnLineState({onLine: true})
            this.$router.push(`/v0/hall?username=${username}`)
            this.setUsername({username})
            electron.ipcRenderer.send('login-success')
          })
          window.$socket.on('unauthorized', (err) => {
            err = parseInt(err.message)
            switch (err) {
              case 4001:
                this.$message.error('发生未知错误')
                break
              case 4002:
              case 4003:
                this.$message.warning('用户名或密码错误')
            }
          })
          window.$socket.on('disconnect', () => {
            this.$message.error('断开连接')
            if (!window.$socket.connected) {
              this.changeOnLineState({onLine: false})
            }
          })
          window.$socket.on('reconnecting', (attemptNumber) => {
            this.$message.info(`正在为您进行第${attemptNumber}次重连`)
          })
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
