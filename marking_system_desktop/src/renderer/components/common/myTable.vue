<template>
    <div class="my-table">
        <el-row>
            <el-col class="my-table-col-title" v-for="(item, index) in tableTitle" :span="item.width" :key="`${item.value}-${index}`">{{item.value}}</el-col>
        </el-row>
        <transition-group name="flip-list" tag="ul">
            <el-row class="my-table-col" v-for="item in tableData" :key="item._id" @click.native="changeFormState(item._id, markId, 'editing')">
                <el-col style="text-align: center" :key="item.username" :span="6" >{{item.username}}</el-col>
                <el-col style="text-align: center" :key="item.age" :span="6" >{{item.age}}</el-col>
                <el-col style="text-align: center" :key="item.sex" :span="6" >{{item.sex === 'man' ? '男' : '女'}}</el-col>
                <el-col style="text-align: center" :key="item.username + 'score'" :span="6" >{{scores[item.personId] === void 0 ? '暂无' : scores[item.personId] }}</el-col>
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
      tableData: Array,
      markId: String,
      changeFormState: Function,
      scores: Object
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
