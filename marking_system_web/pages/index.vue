<template>
  <div class="index">
    <h1 class="index-h1">选手信息查询</h1>
    <hr>
    <el-card class="index-card">
      <el-form :model="searchForm" :rules="rules" ref="searchForm" label-width="100px">
        <el-form-item class="index-card-item" label="姓名" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item class="index-card-item" label="id" prop="personId">
          <el-input v-model="searchForm.personId"></el-input>
        </el-form-item>
        <el-form-item class="index-card-item" label="评分组" prop="markName">
          <el-input v-model="searchForm.markName"></el-input>
        </el-form-item>
        <el-form-item class="index-card-item" label="验证码" prop="code">
          <el-input v-model="searchForm.code"></el-input>
        </el-form-item>
        <el-form-item class="index-card-item">
          <el-button class="index-card-item-button" type="primary" @click="submitForm('searchForm')">立即查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import axios from 'axios'
import {mapMutations} from 'vuex'

export default {
  components: {
    AppLogo
  },
  asyncData () {
    return {
      searchForm: {
        name: '',
        code: '',
        markName: '',
        personId: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 2, max: 6, message: '长度在2 到6 个字符', trigger: 'blur'}
        ],
        markName: [
          {required: true, message: '请输入评分组', trigger: 'blur'},
          {min: 2, max: 6, message: '长度在2 到6 个字符', trigger: 'blur'}
        ],
        personId: [
          {required: true, message: '请输入id', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {...this.searchForm}
          this.getUserInfo(data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getUserInfo (data) {
      axios.post(`${process.env.baseUrl}/api/userinfo`, data).then(res => {
        switch (res.data.code) {
          case 2000:
            this.$message.error('发生错误')
            break
          case 2001:
            this.$message.error('没有查询到信息')
            break
          case 2002:
            this.$message.success('查询成功')
            this.setUserInfo({userInfo: res.data.data})
            this.$router.push({name: 'info'})
            break
          default:
            this.$message.error('发生未知错误')
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  .index {
    padding: 10px;
    &-h1 {
      text-align: center;
    }
    &-card {
      margin: 30px auto 0 auto;
      width: 80%;
      padding: 10px 50px;
      &-item {
        margin-bottom: 40px;
        &-button {
          width: 100%;
        }
      }
    }
  }
</style>
