<template>
    <div class="hall-main">
        <h1>大 厅</h1>
        <div class="content">
            <div class="left">
                <el-card style="height: 100%; overflow: auto">
                    <el-row :gutter="20" class="title">
                        <el-col :span="16">
                            正在进行的评分
                        </el-col>
                        <el-col class="link" :span="8">
                            <el-button type="text">
                                <span style="font-size: 1.2em;" @click="createWork">创建评分</span>
                            </el-button>
                        </el-col>
                    </el-row>
                    <hr>
                    <el-row :gutter="10">
                        <mark-card v-for="item in getDoingMarks"
                                   :key="item.id"
                                   :markName="item.markName"
                                   :owner="item.owner"
                                   :encrypt="item.encrypt"
                                   :auth="item.auth"
                                   :createDate="item.createDate"
                                   :id="item.id"
                        ></mark-card>
                    </el-row>
                </el-card>
                <create-mark-form :creatingWork.sync="creatingWork"></create-mark-form>
            </div>
            <div class="right">
                <el-card style="height: 100%; overflow: auto">
                    <div class="title">已完成的评分</div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        creatingWork: false
      }
    },
    created () {
      this.initSocket()
    },
    components: {
      'create-mark-form': () => import('../components/private/form/CreateMark'),
      'mark-card': () => import('../components/common/markCard')
    },
    computed: {
      ...mapGetters([
        'getDoingMarks',
        'getDoneMarks'
      ])
    },
    methods: {
      ...mapMutations([
        'setDoingMarks',
        'setDoneMarks'
      ]),
      createWork () {
        this.creatingWork = true
      },
      initSocket () {
        if (window.$socket && window.$socket.connected) {
          // 查询所有评分表的逻辑
          window.$socket.emit('get_all_mark')
          window.$socket.on('get_all_mark_err', data => {
            this.$message.error('查询信息出现错误')
          })
          window.$socket.on('get_all_mark_success', data => {
            let doingMarks = data.data.filter(item => {
              return item.done === false
            }).reverse()
            let doneMarks = data.data.filter(item => {
              return item.done === true
            }).reverse()
            this.setDoingMarks({doingMarks})
            this.setDoneMarks({doneMarks})
          })
          // 加入评分的逻辑
          window.$socket.on('join_mark_group_success', data => {
            this.$message.success(`成功加入${data.markName}评分工作组`)
          })
          window.$socket.on('join_mark_group_error', data => {
            this.$message.error(`加入${data.markName}失败，${data.message}`)
          })
          window.$socket.on('broadcast_join_mark_group_success', data => {
            this.$message.success(data.message)
          })
        } else {
          this.$emit('您已离线，请检查您的网络')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "../style/variable";

    .hall-main {
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        .content {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            .left {
                flex-grow: 1;
                margin-right: 10px;
                .title {
                    text-align: left;
                    font-weight: bolder;
                    font-size: 1.2em;
                    line-height: 40px;
                }
                .link {
                    text-align: right;
                }
                .left-content {
                }
            }
            .right {
                min-width: 300px;
                .title {
                    text-align: left;
                    font-weight: bolder;
                    font-size: 1.2em;
                }
            }
        }
    }

    ::-webkit-scrollbar {
        width: 15px;
        /*滚动条宽度（右侧滚动条）*/
        height: 10px;
        /*滚动条高度（底部滚动条）*/
        background-color: #333;
    }

    /*滚动条的轨道，一下两个样式组合作用于滚动条滚动轨迹的表现*/
    ::-webkit-scrollbar-track {
        background-color: #67687D;
    }

    ::-webkit-scrollbar-track-piece {
        background: rgba(0, 0, 0, .1);
    }

    /*滚动条的滑块按钮*/
    ::-webkit-scrollbar-thumb {
        border-radius: 0;
        background-color: $ONE_BORDER_COLOR;
        box-shadow: inset 0 0 5px #333;
    }

    /*滚动条的上下左右两端的按钮*/
    ::-webkit-scrollbar-button {
        height: 10px;
        width: 10px;
        background-color: #B0AEDA;
    }

    /*滚动条下边和右边按钮的交接处*/
    ::-webkit-scrollbar-corner {
        background: #82AFFF;
    }
</style>
