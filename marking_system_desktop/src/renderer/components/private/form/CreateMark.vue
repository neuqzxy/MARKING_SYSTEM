<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="创建新评分" :visible.sync="creatingWork" :before-close="beforeClose">
            <el-form status-icon :model="createMarkForm" :rules="rules" ref="createMarkForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="管理员" prop="owner">
                    <el-input v-model="createMarkForm.owner" disabled></el-input>
                </el-form-item>
                <el-form-item label="评分名" prop="markName">
                    <el-input v-model="createMarkForm.markName"></el-input>
                </el-form-item>
                <el-form-item label="安全设置" prop="encrypt">
                    <el-radio-group v-model="createMarkForm.encrypt">
                        <el-radio :label="true">加密</el-radio>
                        <el-radio :label="false">不加密</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="createMarkForm.encrypt">
                    <el-input type="password" v-model="createMarkForm.password"></el-input>
                </el-form-item>
                <el-form-item label="权限设置" prop="encrypt">
                    <el-radio-group v-model="createMarkForm.auth">
                        <el-radio :label="true">实名评分</el-radio>
                        <el-radio :label="false">匿名评分</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="保密设置" prop="encrypt">
                    <el-radio-group v-model="createMarkForm.privary">
                        <el-radio :label="true">不公开</el-radio>
                        <el-radio :label="false">公开</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="text-align: left">
                    <el-button type="primary" @click="submitForm('createMarkForm')">立即创建</el-button>
                    <el-button @click="resetForm('createMarkForm')">重置</el-button>
                    <rememder style="margin-left: 10px;" title="提示" content="设置密码后必须填写正确的密码才可进入评分。<br>设置不公开将无法通过评分的名称搜索到这场评分，但是我们会提供一个唯一id用于找到该次评分"></rememder>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        createMarkForm: {
          owner: this.$route.query.username || this.$store.state.UserMessage.username,
          markName: '',
          encrypt: true,
          password: '',
          auth: true,
          privary: false
        },
        rules: {
          markName: [
            { required: true, message: '请输入评分名称', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          encrypt: [
            { required: true, message: '必须选一项', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      'creatingWork': {
        type: Boolean,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'getDoingMarks'
      ])
    },
    created () {
      this.initSocket()
    },
    components: {
      'rememder': () => import('../../common/Reminder.vue')
    },
    methods: {
      ...mapMutations([
        'setDoingMarks'
      ]),
      beforeClose () {
        this.$emit('update:creatingWork', false)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const {owner, markName, encrypt, password, auth, privary} = this.createMarkForm
            this.doCreateMark(owner, markName, encrypt, password, auth, privary)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      doCreateMark (owner, markName, encrypt, password = '', auth, privary) {
        if (window.$socket && window.$socket.connected) {
          window.$socket.emit('createMark', {owner, markName, encrypt, password, auth, privary})
        } else {
          this.$message.info('您已离线，请检查您的网络')
        }
      },
      initSocket () {
        if (window.$socket && window.$socket.connected) {
          window.$socket.on('createMark-formErr', data => {
            switch (data.code) {
              case 5000:
                this.$message.error('表单填写不完整，请检查表单')
                break
              case 5001:
                this.$message.error('表单存储失败')
            }
          })
          window.$socket.on('createMark-err', data => {
            switch (data.code) {
              case 5002:
                this.$message.error('没有权限的操作')
                break
              case 5003:
                this.$message.error('发生未知错误')
            }
          })
          window.$socket.on('createMark-success', data => {
            if (data.code === 1000) {
              this.$message.success('创建成功')
              console.log(data.data)
              if (!data.data.privary) {
                this.setDoingMarks({doingMarks: [data.data, ...this.getDoingMarks]})
              }
              this.$emit('update:creatingWork', false)
            }
          })
          window.$socket.on('broadcast-createMark-success', data => {
            if (data.code === 10000) {
              this.setDoingMarks({doingMarks: [data.data, ...this.getDoingMarks]})
              this.$message.success(data.message)
            }
          })
        } else {
          this.$message.info('您已离线，请检查您的网络')
        }
      }
    }
  }
</script>
