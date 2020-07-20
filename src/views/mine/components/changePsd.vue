<template>
  <div id="report" class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" title="修改密码" />
    <van-form class="auth-form" @submit="postForm">
      <van-field
        v-model="fromData.oldpassword"
        name="原密码"
        label="原密码"
        placeholder="请输入原密码"
        :rules="[{ required: true, message: '请输入原密码' }]"
      />
      <van-field
        v-model="fromData.testpassword"
        name="新密码"
        label="新密码"
        placeholder="请填写新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <van-field
        v-model="fromData.newpassword"
        name="确认新密码"
        label="确认新密码"
        placeholder="请再次输入新密码"
        :rules="[{ validator: phoneValidator, message: validator.newpassword }]"
      />
      <van-button type="info" block native-type="submit">确认修改</van-button>
    </van-form>
  </div>
</template>

<script type="text/javascript">
import { Dialog, Toast } from "vant";
import { ModifyOwnPassword } from "@/api/account";
import { removeToken } from "@/utils/auth";
import md5 from "js-md5";
export default {
  name: "changePsd",
  data() {
    return {
      fromData: {
        oldpassword: "",
        testpassword: "",
        newpassword: ""
      },
      validator: {
        newpassword: "请再次输入新密码"
      }
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1); //返回上一层
    },
    phoneValidator(value, rule) {
      if (this.fromData.testpassword == this.fromData.newpassword) {
        return true;
      } else {
        if (value.length > 0) {
          this.validator.newpassword = "两次密码不一致";
          return false;
        } else {
          this.validator.newpassword = "请再次输入新密码";
          return false;
        }
      }
    },
    postForm() {
      ModifyOwnPassword({
        OldPassword: md5(this.fromData.oldpassword),
        Password: md5(this.fromData.newpassword)
      }).then(res => {
        Toast("密码修改成功，请重新登陆！");
        setTimeout(() => {
          removeToken();
          this.$router.push({
            name: "login"
          });
        }, 1000);
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>
