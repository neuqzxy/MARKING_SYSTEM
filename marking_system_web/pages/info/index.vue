<template>
    <div class="info">
      <el-card>
        <el-row class="info-card-row" :gutter="10">
          <el-col :span="12">姓名</el-col>
          <el-col :span="12">{{getUserInfo.username}}</el-col>
        </el-row>
        <el-row class="info-card-row" :gutter="10">
          <el-col :span="12">顺序</el-col>
          <el-col :span="12">{{getUserInfo.index + 1}}</el-col>
        </el-row>
        <el-row class="info-card-row" :gutter="10">
          <el-col :span="12">分数</el-col>
          <el-col :span="12">
            <!--<template v-if="getUserInfo.scores && getUserInfo.scores.length > 0">
              <span v-for="(item, index) in getUserInfo.scores" :key="index">
                {{index + 1}} - {{item.score}}
              </span>
            </template>-->
            <template>
              暂无分数信息
            </template>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['getUserInfo'])
    }
  }
</script>

<style scoped lang="scss">
  .info {
    padding: 10px;
    &-card {
      &-row {
        margin-bottom: 20px;
      }
    }
  }
</style>
