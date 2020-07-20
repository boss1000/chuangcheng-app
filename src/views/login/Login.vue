<template>
  <div id="login">
    <van-nav-bar class="commonTitle" title="登陆" />
    <div class="loginBox">
      <div class="auth-form">
        <van-tabs v-model="active">
          <van-tab :title="loginPage.title">
            <!-- 账号密码登录 -->
            <van-form @submit="loginForm">
              <van-cell-group>
                <van-field
                  v-model="loginData.account"
                  :border="false"
                  label="账号"
                  maxlength="11"
                  placeholder="请输入账号"
                  :rules="[{ validator: phoneValidator, message: validator.phoneMessage }]"
                />
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
                  name="postPhone"
                  v-model="register.mobile"
                  :border="false"
                  maxlength="11"
                  label="手机号"
                  type="number"
                  placeholder="请输入手机号"
                  :rules="[{ required: true,validator: phoneValidator, message: validator.phoneMessage }]"
                >
                  <van-button
                    slot="button"
                    size="small"
                    type="primary"
                    v-if="countDown == 0"
                    native-type="button"
                    @click="sendVerifyCode"
                  >发送验证码</van-button>
                  <van-button
                    slot="button"
                    size="small"
                    type="primary"
                    disabled
                    v-model="smsCaptcha"
                    v-else
                  >已发送{{countDown}}s</van-button>
                </van-field>
                <van-field
                  v-model="register.code"
                  :border="false"
                  type="text"
                  label="验证码"
                  placeholder="请输入验证码"
                  :rules="[{ required: true, message: '请输入验证码' }]"
                />
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
                  v-model="register.idCard"
                  :border="false"
                  type="text"
                  label="身份证"
                  placeholder="请输入身份证号码"
                  :rules="[{ required: true, validator: cardValidator, message: validator.cardMessage }]"
                />
                <van-field
                  v-model="register.orginpassWord"
                  :border="false"
                  type="text"
                  label="登录密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请输入密码' }]"
                />
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
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// 引入Vant的组件
import { Toast, Dialog } from "vant";
import { IdCardValidate } from "../../utils/validate";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { register, getCode } from "../../api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { setLocalStore, getLocalStore } from "@/config/global.js";
import md5 from "js-md5";
let Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      countDown: 0, // 倒计时
      active: 0,
      loginloading: false,
      loginPage: {
        title: "登录",
        resgin: "注册"
      },
      validator: {
        phoneMessage: "请输入手机号",
        passeMessage: "请输入密码",
        cardMessage: "请输入身份证号码"
      },
      loginData: {
        wxCode: "",
        account: "", // 用户名
        password: "" // 用户密码
      },
      register: {
        mobile: "", // 手机号
        code: "", // 验证码
        userName: "", // 用户名
        storeName: "", // 门店
        idCard: "", // 身份证
        orginpassWord: "", // 密码
        passWord: ""
      },
      imgCaptcha: "", // 图片验证码
      smsCaptcha: "", // 短信验证码
      isShowSMSLogin: true, // 是否短信登录
      smsCaptchaResult: null,
      userInfo: null
    };
  },
  computed: {
    // 1.手机号码验证
    phoneNumberRight() {
      let value = this.isShowSMSLogin ? this.login_phone : this.login_userName;
      // 1.1 当输入的手机号大于10位进行验证
      if (value.length > 10) {
        return /[1][3,4,5,6,7,8][0-9]{9}$/.test(value);
      } else {
        return true;
      }
    },
    // 2.发送验证码按钮显示
    captchaDisable() {
      if (this.login_phone.length > 10 && this.phoneNumberRight) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters(["roles"])
  },
  watch: {
    active() {
      if (this.$refs.registerPage) {
        this.$refs.registerPage.resetValidation();
      }
    }
  },
  created() {
    let loginInfo = getLocalStore("loginInfo");
    if (loginInfo) {
      let setloginInfo = loginInfo.split("&*&");
      this.loginData.account = Base64.decode(setloginInfo[0]);
      this.loginData.password = Base64.decode(setloginInfo[1]);
    }
    // console.log(Base64.encode("123456"));
    // console.log(Base64.decode('MTIzNDU2'))
  },
  methods: {
    switchLogin() {
      this.isShowSMSLogin = !this.isShowSMSLogin;
    },
    // 3.账号密码登录切换图片验证码
    getCaptcha() {
      // 获取验证码的标签
      let captchaEle = this.$refs.imgCaptcha;
      this.$set(
        captchaEle,
        "src",
        "http://demo.itlike.com/web/xlmc/api/captcha?time=" + new Date()
      );
    },
    // 4.获取手机验证码
    async sendVerifyCode() {
      this.$refs.registerPage.validate("postPhone").then(() => {
        this.countDown = 60;
        this.timeIntervalID = setInterval(() => {
          this.countDown--;
          // 4.1 如果减到0 则清除定时器
          if (this.countDown == 0) {
            clearInterval(this.timeIntervalID);
          }
        }, 1000);
        // 4.2 获取短信验证码
        let result = getCode({ Mobile: this.register.mobile });
      });
    },
    // 5.登录
    async loginForm() {
      this.loginloading = true;
      this.loginData.wxCode = this.getQueryString("code");
      this.$store
        .dispatch("user/login", this.loginData)
        .then(data => {
          Toast.success("登录成功");
          let setloginInfo = `${Base64.encode(
            this.loginData.account
          )}&*&${Base64.encode(this.loginData.password)}`;
          setLocalStore("loginInfo", setloginInfo);
          this.loginloading = false;
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          console.log(error);
          this.loginloading = false;
          // Toast({
          //   message: "账号或密码错误"
          // });
        });
    },
    // 6.注册
    async registerForm() {
      this.register.passWord = md5(this.register.orginpassWord);
      this.$refs.registerPage
        .validate()
        .then(() => {
          register(this.register)
            .then(data => {
              Toast.success("注册成功，请等待验证");
              this.register = Object.assign(
                {},
                this.$data.register,
                this.$options.data().register
              );
              this.active = 1;
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 7.用户协议
    agreement(index) {},
    // 8.关闭
    close() {
      this.$router.back();
    },
    // 正则验证
    phoneValidator(value, rule) {
      let name = this.active == 1 ? "手机号" : "账号";
      if (value.length > 0) {
        let isTest = /[1][3,4,5,6,7,8][0-9]{9}$/.test(value);
        if (!isTest) {
          this.validator.phoneMessage = `${name}错误，请检查`;
        }

        return isTest;
      }
    },
    cardValidator(value, rule) {
      if (value.length > 0) {
        let isTest = IdCardValidate(value);
        if (!isTest) {
          this.validator.cardMessage = "请检查身份证号码";
        }
        return isTest;
      }
    },
    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
