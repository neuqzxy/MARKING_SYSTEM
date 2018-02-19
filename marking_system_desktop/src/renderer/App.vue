<template>
  <div id="app">
    <layout>
      <keep-alive>
        <transition name="fade"  mode="out-in"  v-if="$route.meta.keepAlive">
          <router-view></router-view>
        </transition>
      </keep-alive>
      <transition name="fade"  mode="out-in"  v-if="!$route.meta.keepAlive">
        <router-view></router-view>
      </transition>
    </layout>
  </div>
</template>

<script>
  import Layout from './components/layout.vue'
  export default {
    name: 'marking_system_desktop',
    components: {
      Layout
    }
  }
</script>

<style lang="scss">
  /* CSS */
  @import "./style/variable";
  @import "reset.css";
  #app {
    display: flex;
    height: 100%;
    width: 100%;
    font-family: $FONT_FAMILY;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
