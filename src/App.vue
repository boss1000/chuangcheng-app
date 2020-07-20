<template>
  <div id="app" :class="{pcSet:!isPhone}">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isPhone"])
  },
  mounted() {
    this.$store.dispatch("app/setPhone");
    // 禁止手机端扩大和缩小手势
    window.onload = function() {
      document.addEventListener("touchstart", function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      document.addEventListener("gesturestart", function(event) {
        event.preventDefault();
      });
    };
    this.$store.dispatch("user/saveUserRoles");
  }
};
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  font-family: Helvetica;
}
</style>
