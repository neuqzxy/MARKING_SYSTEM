<template>
    <div class="BigList">
        <el-tabs class="BigList-tabs" v-model="activeName" tab-position="left" v-show="showTabs">
            <el-tab-pane label="总榜单" name="first">
                <big-mark-list></big-mark-list>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="second">
                <mark-list-config></mark-list-config>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import MarkListConfig from '@/components/private/form/MarkListConfig'
  import BigMarkList from '@/components/private/BigMarkList'
  export default {
    data () {
      return {
        activeName: 'first',
        showTabs: true
      }
    },
    components: {
      MarkListConfig,
      BigMarkList
    },
    computed: {
      ...mapGetters(['getTableData']),
      myTableData () {
        let myTableData = this.getTableData
        console.log(myTableData)
        return myTableData
      }
    }
  }
</script>

<style scoped lang="scss">
    .BigList {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        &-tabs {
            height: 100%;
            width: 100%;
            overflow: auto;
        }
    }
</style>
