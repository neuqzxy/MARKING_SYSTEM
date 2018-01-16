<template>
    <div class="header">
        <el-row :gutter="10" style="width: 100%;">
            <el-col :span="15" class="header-col">
                <div class="title">
                    <router-link :to="`/${this.$myVersion}`" class="link"><span class="link">评 分 系 统</span></router-link>
                </div>
            </el-col>
            <el-col :span="5" class="header-col">

            </el-col>
            <el-col :span="4" class="header-col">
                <div class="header-col" v-if="!downloading">
                    <div :class="[online ? 'online-icon' : 'offline-icon']"></div>
                    <div class="online-text">{{online ? '在线' : '离线'}}</div>
                </div>
                <div v-if="downloading">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiazai"></use>
                    </svg>
                    <div class="downloading-text">正在下载资源</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
        online: 'getOnLine',
        downloading: 'getDownloading'
      })
    }
  }
</script>

<style scoped lang="scss">
    @import "../../style/variable";

    .header {
        height: 60px;
        background: $FOUR_FONT_COLOR;
        width: 100%;
        .header-col {
            height: 60px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .title {
                text-align: left;
                text-indent: 30px;
                flex-grow: 1;
                font-size: 1.2em;
                .link {
                    text-decoration: none;
                    color: $ONE_FONT_COLOR;
                }
            }
            .online-icon {
                height: 16px;
                width: 16px;
                border-radius: 8px;
                background: $SUCCESS;
                margin-right: 5px;
            }
            .offline-icon {
                height: 16px;
                width: 16px;
                border-radius: 8px;
                background: $DANGER;
                margin-right: 5px;
            }
            .downloading-text {
                font-size: 0.8em;
            }
        }
    }
</style>
