<template>
    <div class="userpage">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="userpage-breadcrumb">
            <el-breadcrumb-item :to="{ name: 'login' }">登录</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'hall' }">大厅</el-breadcrumb-item>
            <el-breadcrumb-item>用户信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div slot="header" class="">
                <span>我的评分</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <el-row :gutter="10">
                <mark-card v-for="item in myMarks"
                           :key="item._id"
                           :markName="item.markName"
                           :owner="item.owner.username"
                           :encrypt="item.encrypt"
                           :auth="item.auth"
                           :privary="item.privary"
                           :createDate="item.createDate"
                           :id="item._id"
                ></mark-card>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  data () {
    return {
      myMarks: []
    }
  },
  created () {
    this.initSocket(window.$socket)
    window.$socket.emit('get_my_marks', {username: this.getUsername})
  },
  components: {
    'mark-card': () => import('../components/common/markCard')
  },
  methods: {
    ...mapMutations(['setMyMarks']),
    initSocket (socket) {
      socket.on('get_my_marks_error', data => {
        this.$message.error(data.message)
      })
      socket.on('get_my_marks_success', data => {
        this.myMarks = data.data
        this.setMyMarks({myMarks: data.data})
      })
    }
  },
  computed: {
    ...mapGetters(['getUsername'])
  }
}
</script>

<style scoped lang="scss">
    .userpage {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
        &-breadcrumb {
            font-size: 1.2em;
            margin-bottom: 30px;
        }
    }
</style>
