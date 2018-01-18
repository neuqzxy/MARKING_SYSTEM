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
            <div class="text-line" :style="{color: auth ? '#67C23A' : '#E6A23C'}">{{auth ? '实名评分' : '匿名评分'}}</div>
        </el-card>
    </el-col>
</template>

<script>
  import getDate from '../../util/getDate'

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
      }
    },
    computed: {
      getCreateDate () {
        const {year, mouth, day, hour, minute, second} = getDate(this.createDate)
        return `${year}年-${mouth}月-${day}日-${hour}时-${minute}分-${second}秒`
      }
    },
    methods: {
      joinGroup () {
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
              password: value
            })
          }).catch(() => {
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
