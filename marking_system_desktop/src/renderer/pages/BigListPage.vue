<template>
    <div>
        大榜单
        {{myTableData[$route.params.id]}}
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['getTableData']),
      myTableData () {
        let myTableData = this.getTableData.toJS()
        console.log(myTableData)
        return myTableData
      }
    }
  }
</script>

<style>

</style>
