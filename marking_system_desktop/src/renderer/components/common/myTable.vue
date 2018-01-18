<template>
    <div class="my-table">
        <el-row>
            <el-col class="my-table-col-title" v-for="(item, index) in tableTitle" :span="item.width" :key="`${item.value}-${index}`">{{item.value}}</el-col>
        </el-row>
        <transition-group name="flip-list" tag="ul">
            <el-row class="my-table-col" v-for="item in tableData" :key="item._id">
                <el-col :key="item.username" :span="6" >{{item.username}}</el-col>
                <el-col :key="item.age" :span="6" >{{item.age}}</el-col>
                <el-col :key="item.sex" :span="6" >{{item.sex === 'man' ? '男' : '女'}}</el-col>
                <el-col :key="item.score" :span="6" >{{item.score || '暂无'}}</el-col>
            </el-row>
        </transition-group>
    </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      tableTitle: Array,
      tableData: Array
    }
  }
</script>

<style scoped lang="scss">
    @import "../../style/variable";
    .my-table {
        width: 100%;
        height: 100%;
        &-col-title {
            color: $TWO_FONT_COLOR;
            margin-top: 20px;
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid $ONE_BORDER_COLOR;
        }
        &-col {
            color: $TWO_FONT_COLOR;
            height: 65px;
            border-bottom: 1px solid $ONE_BORDER_COLOR;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
                background: $FOUR_BORDER_COLOR;
            }
        }
    }
    .flip-list-move {
        transition: transform 1s;
    }
</style>
