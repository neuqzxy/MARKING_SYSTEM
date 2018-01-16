<template>
    <div class="reminder">
        <el-popover
                placement="top-start"
                :title="title"
                width="200"
                trigger="hover">
            <div slot="reference">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-test"></use>
                </svg>
            </div>
            <div v-html="content"></div>
        </el-popover>
    </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '提示'
      },
      content: {
        type: String,
        default: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
      }
    }
  }
</script>

<style scoped lang="scss">
    .reminder {
        display: inline-block;
        border: 1px solid #ccc;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        line-height: 20px;
        text-align: center;
    }
</style>
