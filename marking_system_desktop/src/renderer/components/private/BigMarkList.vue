<template>
    <div class="big-mark">
        <el-row :gutter="10">
            <transition-group name="cell" tag="div">
                <el-col :xs="24" :sm="12" :md="6" :xl="4" v-for="(person, index) in getCalculatedScores" :key="person._id">
                    <div class="cell">
                        <h2 class="cell-title">
                            <el-col :span="10">
                                <span :class="[{'danger': index === 0}, {'blue': index < 5 && index > 0}, {'success': index >=5 && index < 10}, {'info': index >=10}]">{{index + 1}}</span>
                            </el-col>
                            <el-col :span="13" style="text-align: right">
                                <span class="cell-title-markName">{{person.markName}}</span>
                            </el-col>
                        </h2>
                        <div class="cell-line">
                            <el-col :span="11">
                                姓名
                            </el-col>
                            <el-col :span="12">
                                <el-tag><span class="bigtext">{{person.username}}</span></el-tag>
                            </el-col>
                        </div>
                        <div class="cell-line">
                            <el-col :span="11">
                                分数
                            </el-col>
                            <el-col :span="12">
                                <span class="orange bigtext">{{person.calculatedScores}}</span>
                            </el-col>
                        </div>
                    </div>
                </el-col>
            </transition-group>
        </el-row>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        getCalculatedScores: 'MarkList/getCalculatedScores'
      })
    }
  }
</script>

<style scoped lang="scss">
    @import "../../style/variable";
    .big-mark {
        flex-grow: 1;
    }
    .cell {
        border: 1px dashed #ccc;
        margin-top: 10px;
        min-height: 100px;
        background: #fff2e8;
        &-title {
            text-align: left;
            text-indent: 10px;
            &-markName {
                font-size: 0.8em;
                color: $FOUR_FONT_COLOR
            }
        }
        &-line {
            height: 30px;
        }
    }
    .cell-move {
        transition: transform 1s;
    }
    .blue {
        color: $BLUE
    }
    .success {
        color: $SUCCESS
    }
    .danger {
        color: $DANGER
    }
    .info {
        color: $INFO
    }
    .orange {
        color: $WARNING
    }
    .bigtext {
        font-size: 1.3em;
        font-weight: bolder;
    }
</style>
