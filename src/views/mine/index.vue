<template>
  <div>
    <van-cell :border="false" title="关注列表" class="van-hairline--bottom" is-link @click="openFollow" />
    <van-cell :border="false" title="修改密码" class="van-hairline--bottom" is-link @click="openchangepsd" />
    <van-cell :border="false" title="退出登陆" class="van-hairline--bottom" is-link @click="loginOut" />
  </div>
</template>
<script>
import { removeToken } from "@/utils/auth";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      showShare: false
    };
  },
  methods: {
    openchangepsd() {
      this.$router.push({
        name: "changePsd"
      });
    },
    openFollow() {
      this.$router.push({
        name: "followProject"
      });
    },
    loginOut() {
      Dialog.confirm({
        title: "提示",
        message: `是否退出登陆`
      })
        .then(() => {
          removeToken();
          sessionStorage.removeItem("userRoles");
          this.$nextTick(() => {
            this.$router.push({
              name: "login"
            });
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>