<template>
  <div id="dashboard">
    <!-- 缓存界面选择加载 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <van-tabbar
      v-model="active"
      :safe-area-inset-bottom="true"
      :placeholder="true"
      @change="tabchange"
      class="tabbarNav"
    >
      <van-tabbar-item v-for="(item, index) in tabbars" :key="index">
        <span>{{ item.title }}</span>
        <template slot="icon" slot-scope="props">
          <svg-icon :icon-class="props.active ? item.active : item.normal" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script type="text/javascript">
import { setLocalStore, getLocalStore } from "../../config/global.js";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "DashBoard",
  data() {
    return {
      active: 0,
      tabbars: [
        {
          name: "project",
          title: "项目",
          normal: "home",
          active: "home-active"
        },
        {
          name: "account",
          title: "账号",
          normal: "build",
          active: "build-active"
        },
        {
          name: "reportData",
          title: "数据",
          normal: "reportData",
          active: "reportData-active"
        },
        {
          name: "mine",
          title: "用户中心",
          normal: "user",
          active: "user-active"
        }
      ]
    };
  },
  watch: {
    // 监听路由变化,保证路由跳转Tabbar选中正常
    $route: {
      handler(val, oldval) {
        this.tabbarSelected(val.name);
      }
    },
    deep: true
  },
  components: {},
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    this.setRoles();
    //通过路由跳转绑定Tabbar的选中
    this.tabbarSelected(this.$route.name);
  },
  mounted() {},
  methods: {
    setRoles() {
      switch (String(this.roles)) {
        case "1":
          // 公司账户
          break;
        case "2":
          // 项目驻场
          this.tabbars.splice(1, 1);
          break;
        case "3":
          // 中介
          this.tabbars.splice(1, 1);
          break;
        default:
          // 超级管理员
          // window.location.href = 'http://ccreportmanage.chuanchengfc.com/'
          // window.location.href = 'http://192.168.3.47:9527/'
          break;
      }
    },
    // 1.点击tabbar触发的方法
    tabchange(num) {
      this.$router.push(this.tabbars[num].name);
    },
    tabbarSelected(item) {
      let mapType = {};
      this.tabbars.map((item, index) => {
        mapType[item.name] = index;
      });
      this.active = mapType[item];
    }
  }
};
</script>
<style lang="less" scoped>
.tabbarNav {
  // padding-top: 10px;
  margin-top: 20px;
  height: 1.3rem !important;
  /deep/ .van-hairline--top-bottom {
    border-top: solid 1px #ccc;
  }
}
/*转场动画*/
.router-slider-enter-active,
.router-slider-leave-active {
  transition: all 0.3s;
}
.router-slider-enter,
.router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-moz-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-o-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.moveToCart {
  animation: mymove 0.5s ease-in-out;
}
</style>
