<template>
    <div class="MarkListConfig">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="MarkListConfig-breadcrumb">
            <el-breadcrumb-item :to="{ name: 'login' }">登录</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'hall' }">大厅</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'mark' }">评分</el-breadcrumb-item>
            <el-breadcrumb-item>总榜单</el-breadcrumb-item>
        </el-breadcrumb>
        <h2 class="MarkListConfig-h2">配置管理</h2>
        <el-card>
            <div slot="header" style="text-align: left">
                <span>参与房间</span>
            </div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 10px 0;"></div>
            <el-checkbox-group v-model="checked" @change="handleCheckedMarksChange">
                <el-checkbox :checked="checked.includes(item.id)" v-for="item in getJoiningMarks" :label="item.id" :key="item.id">{{item.markName}}</el-checkbox>
            </el-checkbox-group>
        </el-card>
        <el-card>
            <div slot="header" style="text-align: left">
                <span>计算精度</span>
            </div>
            <el-radio-group v-model="precision">
                <el-radio :label="0">只保留整数</el-radio>
                <el-radio :label="1">保留一位小数</el-radio>
                <el-radio :label="2">保留两位小数</el-radio>
                <el-radio :label="3">保留三位小数</el-radio>
            </el-radio-group>
        </el-card>
        <el-card>
            <div slot="header" style="text-align: left">
                <span>计算策略</span>
            </div>
            <el-radio-group v-model="radio">
                <el-radio :label="1">东大专用</el-radio>
                <el-radio :label="2">平均分策略</el-radio>
            </el-radio-group>
        </el-card>
    </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {fromJS} from 'immutable'
  import averageStrategy from '../../../../strategy/average'
  import dongDaStrategy from '../../../../strategy/dongDa'
  export default {
    data () {
      return {
        checked: [],
        isIndeterminate: true,
        checkAll: false,
        radio: 1,
        precision: 0
      }
    },
    computed: {
      ...mapGetters({
        getJoiningMarks: 'getJoiningMarks',
        getTableData: 'getTableData',
        getCheckedMarksData: 'MarkList/getCheckedMarksData'
      }),
      allMarksId () {
        return this.getJoiningMarks.map(item => {
          return item.id
        })
      },
      checkedMarksData () {
        let __arr = []
        this.checked.forEach(item => {
          // 拿到房间名
          const {markName, id} = this.getJoiningMarks.filter(mark => {
            return mark.id === item
          })[0]
          // 将房间名存起来
          let tableData = this.getTableData.toJS()[item].map(data => {
            return {...data, markName, markId: id}
          })
          __arr = __arr.concat(tableData)
        })
        return __arr
      },
      calculatedScores () {
        if (this.checked.length === 0) {
          return []
        }
        switch (this.radio) {
          case 1:
            return dongDaStrategy(this.getCheckedMarksData, this.checked, this.precision)
          case 2:
            return averageStrategy(this.getCheckedMarksData, this.precision)
        }
      }
    },
    watch: {
      checkedMarksData (val) {
        this.setCheckedMarksData({checkedMarksData: fromJS(val || [])})
      },
      calculatedScores (val) {
        this.setCalculatedScores({calculatedScores: fromJS(val || [])})
      }
    },
    methods: {
      ...mapMutations({
        setCheckedMarksData: 'MarkList/setCheckedMarksData',
        setCalculatedScores: 'MarkList/setCalculatedScores'
      }),
      handleCheckAllChange (val) {
        this.checked = val ? this.allMarksId : []
        this.isIndeterminate = false
      },
      handleCheckedMarksChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.allMarksId.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allMarksId.length
      }
    }
  }
</script>

<style scoped lang="scss">
    .MarkListConfig {
        display: flex;
        flex-direction: column;
        &-breadcrumb {
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        &-h2 {
            border-bottom: 1px dashed #ccc;
            margin-bottom: 20px;
        }
    }
</style>
