<template>
    <div class="hall-main">
        <el-row :gutter="10" class="hall-main-title">
            <el-col :span="12" style="text-align: left; font-weight: bolder; font-size: 2em;">大厅</el-col>
            <el-col :span="12" style="text-align: right;"><el-button type="text" @click="beginMark">开始评分</el-button></el-col>
        </el-row>
        <hr>
        <div class="content">
            <el-tabs type="card"
                     v-model="activeName"
                     style="flex-grow: 1; overflow: auto;">
                <el-tab-pane
                        v-loading="loading"
                        element-loading-text="正在加载中"
                        element-loading-spinner="el-icon-loading"
                        label="正在进行的评分"
                        name="doingMarks">
                    <el-card>
                        <el-row :gutter="20" class="title">
                            <el-col :span="12">
                                <el-autocomplete
                                        v-model="search"
                                        :fetch-suggestions="querySearchAsync"
                                        placeholder="输入评分名搜索公开评分或通过id搜索私有评分"
                                        @select="handleSelect"
                                        :style="{width: onFocus ? '100%' : '50%'}"
                                        @focus="focus"
                                        @blur="blur"
                                        class="input"
                                        select-when-unmatched
                                ></el-autocomplete>
                            </el-col>
                            <el-col class="link" :span="12">
                                <el-button type="text">
                                    <span style="font-size: 1.2em;" @click="createWork">创建评分</span>
                                </el-button>
                            </el-col>
                        </el-row>
                        <hr>
                        <el-row :gutter="10">
                            <mark-card v-for="item in doingMarks || getDoingMarks"
                                       :key="item.id"
                                       :markName="item.markName"
                                       :owner="item.owner.username ? item.owner.username : item.owner"
                                       :encrypt="item.encrypt"
                                       :auth="item.auth"
                                       :privary="item.privary"
                                       :createDate="item.createDate"
                                       :id="item.id || item._id"
                            ></mark-card>
                            <div v-if="doingMarks && doingMarks.length === 0">暂时没有公开的评分工作</div>
                        </el-row>
                    </el-card>
                    <create-mark-form :creatingWork.sync="creatingWork"></create-mark-form>
                </el-tab-pane>
                <el-tab-pane label="已完成的评分" name="doneMarks">
                    <el-card style="height: 100%; overflow: auto">
                        <div class="title">已完成的评分</div>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import getDate from '../util/getDate'
  import api from '../config/api.config'

  export default {
    data () {
      return {
        creatingWork: false,
        activeName: 'doingMarks',
        search: '',
        onFocus: false,
        doingMarks: null,
        loading: true
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
        'setDoneMarks',
        'setSearchedMarks'
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
            this.loading = false
          })
          window.$socket.on('get_all_mark_success', data => {
            this.loading = false
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
            this.$router.push(`/${api.version}/mark?markName=${data.markName}&markId=${data.data._id}`)
          })
          window.$socket.on('join_mark_group_error', data => {
            this.$message.error(`加入${data.markName}失败，${data.message}`)
          })
          window.$socket.on('broadcast_join_mark_group_success', data => {
            this.$message.success(data.message)
          })
          // 搜索某个评分
          window.$socket.on('get_mark_by_id_success', data => {
            console.log(data.data)
            this.doingMarks = data.data
            this.setSearchedMarks({searchedMarks: data.data})
          })
          window.$socket.on('get_mark_by_id_error', data => {
            this.$message.error(data.message)
          })
        } else {
          this.$emit('您已离线，请检查您的网络')
        }
      },
      focus () {
        this.onFocus = true
      },
      blur () {
        if (this.search === '') {
          this.doingMarks = null
        }
        this.onFocus = false
      },
      querySearchAsync (queryString, cb) {
        let results = this.getDoingMarks.map(item => {
          const {year, mouth, day, hour, minute, second} = getDate(item.createDate)
          item.value = `${item.markName} - ${item.owner} - ${year}年${mouth}月${day}日${hour}时${minute}分${second}秒`
          return item
        })
        if (queryString) {
          results = results.filter(item => {
            return item.markName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          })
        }
        cb(results)
      },
      handleSelect (item) {
        if (item.id) {
          this.doingMarks = [item]
        } else {
          this.doingMarks = []
          if (item) {
            window.$socket.emit('get_mark_by_id', {
              id: item.value
            })
          }
        }
      },
      beginMark () {
        this.$router.push('/v0/mark')
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
            .title {
                text-align: left;
                font-weight: bolder;
                font-size: 1.2em;
                line-height: 40px;
            }
            .input {
                transition: all .5s;
            }
            .link {
                text-align: right;
            }
            .left-content {
            }
            .title {
                text-align: left;
                font-weight: bolder;
                font-size: 1.2em;
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
