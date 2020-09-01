<template>
  <div id="report" class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" title="修改密码" />
    <van-form class="auth-form" @submit="postForm">
      <div class="searchContent">
        <van-field
          v-model="fromData.testpassword"
          name="新密码"
          label="新密码"
          placeholder="请填写新密码"
          :border="false"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <van-field
          v-model="fromData.newpassword"
          name="确认新密码"
          label="确认新密码"
          placeholder="请再次输入新密码"
          :border="false"
          :rules="[{ validator: phoneValidator, message: validator.newpassword }]"
        />
      </div>

      <van-button type="info" block native-type="submit">确认修改</van-button>
    </van-form>
  </div>
</template>

<script type="text/javascript">
import { Toast } from 'vant'
import { MolPassword } from '@/api/user'
import { removeToken, removeLocalStore } from '@/utils/auth'
export default {
  name: 'ChangePsd',
  data() {
    return {
      fromData: {
        testpassword: '',
        newpassword: ''
      },
      validator: {
        newpassword: '请再次输入新密码'
      }
    }
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    phoneValidator(value, rule) {
      if (this.fromData.testpassword === this.fromData.newpassword) {
        return true
      } else {
        if (value.length > 0) {
          this.validator.newpassword = '两次密码不一致'
          return false
        } else {
          this.validator.newpassword = '请再次输入新密码'
          return false
        }
      }
    },
    postForm() {
      MolPassword({
        FPwd: this.fromData.newpassword
      }).then(res => {
        Toast('密码修改成功，请重新登陆！')
        setTimeout(() => {
          removeToken()
          removeLocalStore('loginInfo')
          this.$router.push({
            name: 'Login'
          })
        }, 1000)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  border-radius: 0;
  line-height: 27px;
  text-align: center;
  // /deep/ .van-cell {
  //   // padding-bottom: 0px;
  //   .van-field__value {
  //     border: solid 1px #ccc;
  //     height: 28px;
  //     line-height: 28px;
  //     .van-field__control {
  //       height: 28px;
  //       line-height: 28px;
  //       border: none;
  //     }
  //   }
  // }
  .searchContent {
    flex-grow: 1;
  }
}
</style>
