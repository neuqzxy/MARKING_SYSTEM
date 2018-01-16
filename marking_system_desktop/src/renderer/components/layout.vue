<template>
    <div class="layout">
        <my-header class="header"></my-header>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import MyHeader from './common/header.vue'
    export default {
      components: {
        MyHeader
      }
    }
</script>

<style lang="scss" scoped>
    @import "../style/variable";
    .layout {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: space-between;
        font-family: $FONT_FAMILY;
        color: $ONE_FONT_COLOR;
        text-align: center;
        .header {
            height: 60px;
            flex-grow: 0;
        }
        .content {
            flex-grow: 1;
            padding: 20px;
            display: flex;
        }
    }
</style>
