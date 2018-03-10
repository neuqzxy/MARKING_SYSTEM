<template>
    <el-col :xs="24" :md="12">
        <el-card class="card">
            <div slot="header" style="text-align: left; height: 20px;">
                <span>{{markName}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="joinGroup">
                    <svg class="icon" aria-hidden="true" v-if="encrypt">
                        <use xlink:href="#icon-suo"></use>
                    </svg>
                    进入评分
                </el-button>
            </div>
            <el-row class="text-line">
                <el-col :span="12">
                    <span>管理员</span>
                </el-col>
                <el-col :span="12">
                    <el-tag><span style="font-weight: bolder;">{{owner}}</span></el-tag>
                </el-col>
            </el-row>
            <el-row class="text-line">
                <el-col :span="12">
                    <span>创建时间</span>
                </el-col>
                <el-col :span="12">
                    <span style="font-weight: lighter; font-size: 0.8em;">{{getCreateDate}}</span>
                </el-col>
            </el-row>
            <div class="text-line" :style="{color: auth ? '#67C23A' : '#E6A23C', textAlign: 'center'}">{{auth ? '实名评分' : '匿名评分'}}</div>
            <div class="text-line" style="text-align: center">id: <span style="color: #409EFF"> {{id}}</span></div>
            <div class="text-line" style="text-align: center">
                <span v-if="privary" style="color: #F56C6C">不公开</span>
                <span v-if="!privary" style="color: #67C23A">公开</span>
            </div>
            <div v-if="type === 'userPage'" class="text-line" style="text-align: center">验证码: <span style="color: #409EFF"> {{accessCode}}</span></div>
        </el-card>
    </el-col>
</template>

<script>
  import getDate from '../../util/getDate'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {}
    },
    props: {
      markName: {
        type: String
      },
      owner: {
        type: String
      },
      encrypt: {
        type: Boolean
      },
      auth: {
        type: Boolean
      },
      createDate: {
        type: String
      },
      id: {
        type: String
      },
      privary: {
        type: Boolean
      },
      accessCode: {
        type: String
      },
      type: {
        type: String
      }
    },
    computed: {
      ...mapGetters(['getDoingMarks', 'getSearchedMarks', 'getMyMarks']),
      getCreateDate () {
        const {year, mouth, day, hour, minute, second} = getDate(this.createDate)
        return `${year}年-${mouth}月-${day}日-${hour}时-${minute}分-${second}秒`
      }
    },
    methods: {
      joinGroup () {
        // 该评分的数据可能来源于搜索到的评分，大厅中正在进行的评分，以及我的评分
        let data = this.getDoingMarks.filter(item => {
          return item.id === this.id
        })[0]
        if (!data) {
          data = this.getSearchedMarks.filter(item => {
            return item._id === this.id
          })[0]
        }
        if (!data) {
          data = this.getMyMarks.filter(item => {
            return item._id === this.id
          })[0]
        }
        if (!data) {
          return this.$message.error('发生错误')
        }
        delete data.createDate
        if (this.encrypt) {
          this.$prompt('请输入该评分的密码', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'password',
            inputPattern: /^\w{3,10}$/,
            inputErrorMessage: '密码格式不正确'
          }).then(({ value }) => {
            window.$socket.emit('join_mark_group', {
              markName: this.markName,
              id: this.id,
              password: value,
              username: this.$store.state.UserMessage.username,
              data
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          window.$socket.emit('join_mark_group', {
            markName: this.markName,
            id: this.id,
            username: this.$store.state.UserMessage.username,
            data
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .card {
        width: 100%;
        margin-top: 10px;
        .text-line {
            margin-top: 10px;
        }
    }
</style>
