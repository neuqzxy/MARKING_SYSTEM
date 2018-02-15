<template>
    <div class="mark-page">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mark-page-breadcrumb">
            <el-breadcrumb-item :to="{ path: `/${api.version}/login` }">登录</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/${api.version}/hall` }">大厅</el-breadcrumb-item>
            <el-breadcrumb-item>评分</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card" class="mark-page-content">
            <el-tab-pane style="height: 100%;" :label="item.markName" :key="item.id" v-for="item in joiningMarks">
                <el-row :gutter="10" style="height: 100%;">
                    <el-col :span="10">
                        <el-card>
                            <el-row :gutter="10">
                                <el-col :span="14">
                                    <h2 style="text-align: left;"><span style="cursor: pointer;" @click="changeSortState(item.id)">总榜单<i :style="{'margin-left': sort === 'bigToSmall' ? '0' : '-12px'}" :class="sort === 'bigToSmall' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i></span></h2>
                                </el-col>
                                <el-col :span="10" style="text-align: right;">
                                    <el-button type="text" @click="goBigBD(item.id)">大榜单</el-button>
                                    <el-button type="text" @click="changeFormState">添加信息</el-button>
                                </el-col>
                            </el-row>
                            <my-table :scores="scores" :markId="item.id" :changeFormState="changeFormState" :tableTitle="tableTitle" :tableData="tableData[item.id]" :roomsId="item.id"></my-table>
                        </el-card>
                    </el-col>
                    <el-col :span="14">
                        <el-card>
                            <h2>{{formState === 'creating' ? '添加信息' : '个人信息'}}</h2>
                            <hr>
                            <el-form :model="tableForm" :rules="rules" ref="tableForm" label-width="100px">
                                <el-form-item label="姓名" prop="username">
                                    <el-input :disabled="formState === 'editing'" v-model="tableForm.username"></el-input>
                                </el-form-item>
                                <el-form-item label="年龄" prop="age">
                                    <el-input-number :disabled="formState === 'editing'" v-model="tableForm.age" :min="1" :max="100"></el-input-number>
                                </el-form-item>
                                <el-form-item label="性别" prop="sex">
                                    <el-radio-group :disabled="formState === 'editing'" v-model="tableForm.sex">
                                        <el-radio label="man">男</el-radio>
                                        <el-radio label="woman">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="其他信息" prop="otherMessage">
                                    <el-input :disabled="formState === 'editing'" type="textarea" v-model="tableForm.otherMessage"></el-input>
                                </el-form-item>
                                <el-form-item  v-if="formState === 'editing'" label="分数" prop="score">
                                    <el-input-number v-model="tableForm.score" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                                <div v-if="formState === 'editing'">
                                    <el-row :gutter="10" :key="item.username" v-for="item in tableData[selectedMessage.markId].filter(i => i.personId === selectedMessage.personId)[0].scores">
                                        <el-col :span="12">
                                            评分人  <el-tag>{{item.username}}</el-tag>
                                        </el-col>
                                        <el-col :span="12">
                                            <span style="color: #67C23A">{{ item.score }}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                                <el-form-item style="text-align: left;">
                                    <el-button v-if="formState === 'creating'" type="primary" @click="submitForm('tableForm', item.markName, item.id)">提交</el-button>
                                    <el-button v-if="formState === 'editing'" type="primary" @click="giveScore(item.markName, item.id)">评分</el-button>
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
  import {fromJS} from 'immutable'
  import api from '../config/api.config'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'

  export default {
    data () {
      return {
        api,
        sort: 'bigToSmall',
        formState: 'creating',
        // 右侧表格中的数据，用户填写的表单数据
        tableForm: {
          username: '',
          age: 0,
          score: 0,
          sex: 'man',
          otherMessage: '',
          id: ''
        },
        scores: {},
        // 记录加入的评分组的信息
        joiningMarks: {},
        // 当前选中的人的信息
        selectedMessage: {
          markName: '',
          markId: '',
          personId: ''
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
    created () {
      this.initSocket()
      window.$socket.emit('get_mark_rooms', {
        username: this.$store.state.UserMessage.username
      })
    },
    destroyed () {
      this.OffSocket()
    },
    components: {
      ElButton,
      'my-table': () => import('../components/common/myTable')
    },
    computed: {
      ...mapGetters(['getTableData'])
    },
    watch: {
      // 排序
      getTableData (value) {
        this.tableData = value
        this.setScores()
      },
      scores: {
        handler (value) {
          // 将分数排序，和void 0做比较是为了让没有打分的排在后面
          let scores = Object.keys(value).sort((x, y) => (this.scores[y] === void 0 ? -1 : this.scores[y]) - (this.scores[x] === void 0 ? -1 : this.scores[x]))
          const keys = Object.keys(this.tableData)
          const newTableData = {}
          for (let personId of scores) {
            for (let i of keys) {
              let isBreak = false
              newTableData[i] = newTableData[i] ? newTableData[i] : []
              for (let item of this.tableData[i]) {
                if (item.personId === personId) {
                  newTableData[i].push(item)
                  isBreak = true
                }
                if (isBreak) {
                  break
                }
              }
              if (isBreak) {
                break
              }
            }
          }
          this.setTableData({tableData: fromJS(newTableData)})
        },
        deep: true
      }
    },
    methods: {
      ...mapMutations([
        'setJoiningMarks',
        'setTableData'
      ]),
      goBigBD (id) {
        this.$router.push({name: 'bigList', params: {id}})
      },
      initSocket () {
        window.$socket.on('get_mark_rooms_error', data => {
          this.$message.error(data.message)
        })
        window.$socket.on('get_mark_rooms_success', data => {
          /* this.setJoiningMarks({joiningMarks: data.data}) */
          this.joiningMarks = data.data.map(item => {
            return {id: item.id, markName: item.markName}
          })
          let tableData = this.getTableData
          for (let i of data.data) {
            /* this.$set(this.tableData, i.id, JSON.parse(JSON.stringify(i.charts)))
            this.setTableData({tableData: fromJS(this.tableData)}) */
            tableData[i.id] = i.charts
            this.setTableData({tableData: fromJS(tableData)})
          }
          // this.setScores()
        })
        window.$socket.on('add_person_error', data => {
          this.$message.error(data.message)
        })
        window.$socket.on('broadcast_add_person_success', data => {
          // this.tableData[data.reqData.id].push({...data.resData, scores: []})
          let tableData = this.getTableData
          tableData[data.reqData.id].push({...data.resData, scores: []})
          this.setTableData({tableData: fromJS(tableData)})
          this.$message.success(data.message)
        })
        window.$socket.on('add_person_success', data => {
          /* this.tableData[data.reqData.id].push({...data.resData, scores: []})
          this.setTableData({tableData: fromJS(this.tableData)}) */
          let tableData = this.getTableData
          tableData[data.reqData.id].push({...data.resData, scores: []})
          this.setTableData({tableData: fromJS(tableData)})
          this.$message.success(data.message)
        })
        window.$socket.on('give_score_error', data => {
          this.$message.error(data.message)
        })
        window.$socket.on('give_score_success', data => {
          this.$message.success(data.message)
          // 如果打过了分，就修改，否则，就添加
          let flag = false
          // 用于修改scores，（利用原生js Array地址不变的特性，很危险）
          let tableData = this.getTableData
          let __tableData = tableData[data.reqData.markId]
          let scores = __tableData.filter(item => item.personId === data.reqData.personId)[0].scores
          for (let score of scores) {
            if (score.username === data.reqData.username) {
              score.score = data.reqData.score
              flag = true
            }
          }
          if (!flag) {
            scores.push({username: data.reqData.username, score: data.reqData.score})
          }
          this.setTableData({tableData: fromJS(tableData)})
        })
        window.$socket.on('broadcast_give_score_success', data => {
          // 如果打过了分，就修改，否则，就添加
          let flag = false
          // 用于修改scores，（利用原生js Array地址不变的特性，很危险）
          let tableData = this.getTableData
          let __tableData = tableData[data.reqData.markId]
          let scores = __tableData.filter(item => item.personId === data.reqData.personId)[0].scores
          for (let score of scores) {
            if (score.username === data.reqData.username) {
              score.score = data.reqData.score
              flag = true
            }
          }
          if (!flag) {
            scores.push({username: data.reqData.username, score: data.reqData.score})
          }
          this.setTableData({tableData: fromJS(tableData)})
        })
      },
      OffSocket () {
        if (window.$socket && window.$socket.off) {
          window.$socket.off('get_mark_rooms_error')
          window.$socket.off('get_mark_rooms_success')
          window.$socket.off('add_person_error')
          window.$socket.off('broadcast_add_person_success')
          window.$socket.off('add_person_success')
          window.$socket.off('give_score_error')
          window.$socket.off('give_score_success')
          window.$socket.off('broadcast_give_score_success')
        }
      },
      changeSortState (id) {
        this.tableData[id].reverse()
        this.sort = (this.sort === 'bigToSmall') ? 'smallToBig' : 'bigToSmall'
      },
      changeFormState (id, markId, type) {
        this.formState = type === 'editing' ? 'editing' : 'creating'
        if (this.formState === 'creating') {
          this.tableForm = {username: '', age: 0, sex: 'man', otherMessage: '', score: 0}
        } else {
          const data = this.tableData[markId].filter(item => {
            return item._id === id
          })[0]
          this.selectedMessage = {markId, personId: data.personId}
          this.tableForm = {
            username: data.username,
            age: data.age,
            sex: data.sex,
            otherMessage: data.otherMessage,
            personId: data.personId
          }
        }
      },
      submitForm (formName, markName, id) {
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            const {username, sex, age, otherMessage} = this.tableForm
            window.$socket.emit('add_person', {username, sex, age: parseInt(age), otherMessage, markName, id, clientUsername: this.$store.state.UserMessage.username})
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      giveScore (markName, markId, personId) {
        window.$socket.emit('give_score', {
          score: this.tableForm.score || 0,
          markName,
          markId: markId,
          personId: this.tableForm.personId,
          username: this.$store.state.UserMessage.username,
          personName: this.tableForm.username
        })
      },
      setScores () {
        let keys = Object.keys(this.tableData)
        for (let key of keys) {
          for (let personInfo of this.tableData[key]) {
            let score = void 0
            if (personInfo.scores.length > 0) {
              score = 0
              personInfo.scores.forEach(item => {
                score += item.score
              })
              score = parseInt(score / personInfo.scores.length)
            }
            this.$set(this.scores, personInfo.personId, score)
          }
        }
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
