<template>
    <div class="mark-page">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mark-page-breadcrumb">
            <el-breadcrumb-item :to="{ path: `/${api.version}/login` }">登录</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/${api.version}/hall` }">大厅</el-breadcrumb-item>
            <el-breadcrumb-item>评分</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card" class="mark-page-content">
            <el-tab-pane style="height: 100%;" :label="item.markName" :key="item._id" v-for="item in getJoiningMarks">
                <el-row :gutter="10" style="height: 100%;">
                    <el-col :span="10">
                        <el-card>
                            <el-row :gutter="10">
                                <el-col :span="14">
                                    <h2 style="text-align: left;"><span style="cursor: pointer;" @click="changeSortState(item._id)">总榜单<i :style="{'margin-left': sort === 'bigToSmall' ? '0' : '-12px'}" :class="sort === 'bigToSmall' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i></span></h2>
                                </el-col>
                                <el-col :span="10" style="text-align: right;">
                                    <el-button type="text" @click="addMessage">添加信息</el-button>
                                </el-col>
                            </el-row>
                            <my-table :tableTitle="tableTitle" :tableData="tableData[item._id]" :roomsId="item._id"></my-table>
                        </el-card>
                    </el-col>
                    <el-col :span="14">
                        <el-card>
                            <h2>{{formState === 'creating' ? '添加信息' : '个人信息'}}</h2>
                            <hr>
                            <el-form :model="tableForm" :rules="rules" ref="tableForm" label-width="100px">
                                <el-form-item label="姓名" prop="username">
                                    <el-input v-model="tableForm.username"></el-input>
                                </el-form-item>
                                <el-form-item label="年龄" prop="age">
                                    <el-input-number v-model="tableForm.age" :min="1" :max="100"></el-input-number>
                                </el-form-item>
                                <el-form-item label="性别" prop="sex">
                                    <el-radio-group v-model="tableForm.sex">
                                        <el-radio label="man">男</el-radio>
                                        <el-radio label="woman">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="其他信息" prop="otherMessage">
                                    <el-input type="textarea" v-model="tableForm.otherMessage"></el-input>
                                </el-form-item>
                                <el-form-item style="text-align: left;">
                                    <el-button type="primary" @click="submitForm('tableForm', item.markName, item._id)">提交</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import api from '../config/api.config'

  export default {
    data () {
      return {
        api,
        sort: 'bigToSmall',
        formState: 'creating',
        tableForm: {
          username: '',
          age: 0,
          sex: 'man',
          otherMessage: ''
        },
        tableData: {},
        tableTitle: [
          {
            value: '姓名',
            width: 6
          },
          {
            value: '年龄',
            width: 6
          },
          {
            value: '性别',
            width: 6
          },
          {
            value: '均分',
            width: 6
          }
        ],
        rules: {
          username: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'getJoiningMarks'
      ])
    },
    created () {
      this.initSocket()
      window.$socket.emit('get_mark_rooms', {
        username: this.$store.state.UserMessage.username
      })
    },
    components: {
      'my-table': () => import('../components/common/myTable')
    },
    methods: {
      ...mapMutations([
        'setJoiningMarks'
      ]),
      initSocket () {
        window.$socket.on('get_mark_rooms_error', data => {
          this.$message.error(data.message)
        })
        window.$socket.on('get_mark_rooms_success', data => {
          this.setJoiningMarks({joiningMarks: data.data})
          for (let i of data.data) {
            this.$set(this.tableData, i._id, [...i.charts])
          }
        })
        window.$socket.on('add_person_error', data => {
          this.$message.error(data.message)
        })
        window.$socket.on('broadcast_add_person_success', data => {
          this.$message.success(data.message)
        })
        window.$socket.on('add_person_success', data => {
          this.$message.success(data.message)
        })
      },
      changeSortState (id) {
        this.tableData[id].reverse()
        this.sort = (this.sort === 'bigToSmall') ? 'smallToBig' : 'bigToSmall'
      },
      addMessage () {
        this.formState = 'creating'
      },
      submitForm (formName, markName, id) {
        console.log(this.$refs[formName])
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            const {username, sex, age, otherMessage} = this.tableForm
            window.$socket.emit('add_person', {username, sex, age: parseInt(age), otherMessage, markName, id, clientUsername: this.$store.state.UserMessage.username})
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .mark-page {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .mark-page-breadcrumb {
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .mark-page-content {
            flex-grow: 1;
        }
    }
</style>
