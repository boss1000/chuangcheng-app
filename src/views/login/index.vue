<template>
  <div id="login">
    <van-nav-bar class="commonTitle" title="登陆" />
    <div class="loginBox">
      <div class="auth-form">
        <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
          <van-tabs v-model="active">
            <van-tab :title="loginPage.title">
              <!-- 账号密码登录 -->
              <van-form @submit="loginForm">
                <van-cell-group>
                  <!-- <van-field
                    v-model="loginData.account"
                    :border="false"
                    label="账号"
                    maxlength="11"
                    placeholder="请输入账号"
                    :rules="[{ validator: phoneValidator, message: validator.phoneMessage }]"
                  />-->
                  <van-field
                    v-model="loginData.password"
                    :border="false"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请输入密码' }]"
                  />
                </van-cell-group>
                <van-button
                  type="info"
                  size="large"
                  style="margin-top:1rem"
                  native-type="submit"
                  :loading="loginloading"
                  loading-text="登录中..."
                  loading-type="spinner"
                >登录</van-button>
              </van-form>
            </van-tab>
            <!-- 注册 -->
            <van-tab :title="loginPage.resgin">
              <van-form ref="registerPage">
                <van-cell-group>
                  <van-field
                    v-model="register.code"
                    :border="false"
                    type="text"
                    placeholder="请输入账号"
                    :rules="[{ required: true, message: '请输入账号' }]"
                  />
                  <!-- <van-field
                  name="postPhone"
                  v-model="register.mobile"
                  :border="false"
                  maxlength="11"
                  label="手机号"
                  type="number"
                  placeholder="请输入手机号"
                  :rules="[{ required: true,validator: phoneValidator, message: validator.phoneMessage }]"
                ></van-field>
                <van-field
                  v-model="register.userName"
                  :border="false"
                  type="text"
                  label="姓名"
                  placeholder="请输入姓名"
                  :rules="[{ required: true, message: '请输入姓名' }]"
                />
                <van-field
                  v-model="register.storeName"
                  :border="false"
                  type="text"
                  label="门店"
                  placeholder="请输入门店"
                  :rules="[{ required: true, message: '请输入门店' }]"
                />
                <van-field
                  v-model="register.orginpassWord"
                  :border="false"
                  type="text"
                  label="登录密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请输入密码' }]"
                  />-->
                </van-cell-group>
                <van-button
                  type="info"
                  size="large"
                  style="margin-top:1rem"
                  native-type="submit"
                  @click="registerForm"
                >注册</van-button>
              </van-form>
            </van-tab>
          </van-tabs>
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// 引入Vant的组件
// import { Toast } from 'vant'
// import { mapGetters } from 'vuex'
// import { register, getCode } from '@/api/user'
// import { setLocalStore, getLocalStore } from '@/utils/auth.js'
// import md5 from 'js-md5'
// const Base64 = require('js-base64').Base64
export default {
  data() {
    return {
      countDown: 0, // 倒计时
      active: 0,
      loginloading: false,
      loginPage: {
        title: '登录',
        resgin: '注册'
      },
      validator: {
        phoneMessage: '请输入手机号',
        passeMessage: '请输入密码',
        cardMessage: '请输入身份证号码'
      },
      loginData: {
        wxCode: '',
        account: '', // 用户名
        password: '' // 用户密码
      },
      register: {
        mobile: '', // 手机号
        code: '', // 验证码
        userName: '', // 用户名
        storeName: '', // 门店
        idCard: '', // 身份证
        orginpassWord: '', // 密码
        passWord: ''
      },
      imgCaptcha: '', // 图片验证码
      smsCaptcha: '', // 短信验证码
      isShowSMSLogin: true, // 是否短信登录
      smsCaptchaResult: null,
      userInfo: null
    }
  },
  computed: {
    // 1.手机号码验证
    phoneNumberRight() {
      const iphoneValue = this.isShowSMSLogin ? this.login_phone : this.login_userName
      // 1.1 当输入的手机号大于10位进行验证
      if (iphoneValue.length > 10) {
        return /[1][3,4,5,6,7,8][0-9]{9}$/.test(iphoneValue)
      } else {
        return true
      }
    },
    // 2.发送验证码按钮显示
    captchaDisable() {
      if (this.login_phone.length > 10 && this.phoneNumberRight) {
        return false
      } else {
        return true
      }
    }
    // ...mapGetters(['roles'])
  },
  watch: {
    active() {
      // if (this.$refs.registerPage) {
      //   this.$refs.registerPage.resetValidation()
      // }
    }
  },
  created() {},
  methods: {
    onSwipeLeft() {
      if (this.active === 1) {
        this.active = 0
      }
    },
    onSwipeRight() {
      if (this.active === 0) {
        this.active = 1
      }
    },
    loginForm() {},
    registerForm() {}
  }
}
</script>
<style lang="scss" scoped>
#login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: url("../../images/login/back2.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-color: #e4dada80;
  display: flex;
  flex-direction: column;

  .loginBox {
    display: flex;
    // align-items: center;
    justify-content: center;
    flex: 1;
    opacity: 0.95;
    z-index: 500;
    background-color: #fff;
    .auth-form {
      position: relative;
      top: 20px;
      margin: 18px;
      width: 28.5rem;
      max-width: 90%;
      font-size: 1.167rem;
      background-color: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      /deep/ .van-tabs__content {
        margin-top: 20px;
      }
    }
    img {
      position: absolute;
      top: 1rem;
      left: 50%;
      width: 4rem;
      transform: translate(-50%, -70%);
      z-index: 1;
      @media screen and (max-width: 320px) {
        top: 0.5rem;
        transform: translate(-50%, -40%);
        width: 5rem;
      }
    }
    .closeButton {
      position: absolute;
      right: 1rem;
      top: 0.4rem;
    }
    .verificationImage {
      position: absolute;
      right: 0;
      width: 8rem;
      height: 3rem;
      margin-left: 3rem;
    }
    .switchLogin {
      margin-top: 1rem;
      font-size: 16px;
    }
  }
  .title {
    padding: 0.5rem;
    font-size: 0.5rem;
    color: grey;
  }
  .agreement {
    // margin-top: 1.667rem;
    line-height: 1rem;
    color: #767676;
    font-size: 0.867rem;
    .agreement-box {
      color: blue;
    }
  }
  .pcSet {
    #login {
      .loginBox {
        .auth-form {
          width: 400px;
          max-width: 400px;
        }
      }
    }
  }
}
</style>
