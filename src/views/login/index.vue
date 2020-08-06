<template>
  <div id="login">
    <!-- <van-nav-bar class="commonTitle" title="登陆" /> -->
    <div class="loginBox">
      <div class="auth-form">
        <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
          <van-tabs v-model="active" color="#1989fa">
            <!-- 注册 -->
            <van-tab :title="loginPage.resgin">
              <van-form ref="registerPage">
                <van-cell-group>
                  <van-field
                    class="one-pixel-line shadow"
                    v-model.trim="loginData.FAccount"
                    :border="false"
                    placeholder="请输入账号"
                    :rules="[{ required: true,validator: FAccountValidator, message: (value, rule) => {
                      return msg.FAccountMsg
                    } }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="username" />
                    </template>
                  </van-field>
                  <van-field
                    v-model.trim="loginData.fristPwd"
                    :border="false"
                    type="password"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请输入密码' }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="passwaord" />
                    </template>
                  </van-field>
                  <van-field
                    v-model.trim="loginData.secondPwd"
                    :border="false"
                    type="password"
                    placeholder="请确认密码"
                    :rules="[{ required: true,validator: PwdValidator, message: (value, rule) => {
                      return msg.PwdMsg
                    } }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="passwaord" />
                    </template>
                  </van-field>
                  <van-field
                    v-model.trim="loginData.FMobile"
                    :border="false"
                    placeholder="请输入手机号"
                    :rules="[{ required: true,validator: PhoneValidator, message: (value, rule) => {
                      return msg.PhoneMsg
                    } }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="phone" />
                    </template>
                  </van-field>
                  <van-field
                    v-model.trim="loginData.FNickName"
                    :border="false"
                    placeholder="请输入昵称"
                    :rules="[{ required: true,validator: NickValidator, message: (value, rule) => {
                      return msg.NickMsg
                    } }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="name" />
                    </template>
                  </van-field>
                </van-cell-group>
                <van-button
                  type="info"
                  size="large"
                  style="margin-top:1rem"
                  native-type="submit"
                  :loading="registerloading"
                  @click="registerForm"
                >注册</van-button>
              </van-form>
            </van-tab>
            <van-tab :title="loginPage.title">
              <!-- 账号密码登录 -->
              <van-form ref="loginPage" @submit="loginForm">
                <van-cell-group>
                  <van-field
                    v-model.trim="loginData.UserName"
                    :border="false"
                    placeholder="请输入账号"
                    :rules="[{ required: true, message: '请输入账号' }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="username" />
                    </template>
                  </van-field>
                  <van-field
                    v-model.trim="loginData.UserPwd"
                    :border="false"
                    type="password"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请输入密码' }]"
                  >
                    <template #left-icon>
                      <svg-icon icon-class="passwaord" />
                    </template>
                  </van-field>
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
          </van-tabs>
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// 引入Vant的组件
import { Toast } from 'vant'
// import { mapGetters } from 'vuex'
import { CheckAccount, CheckMobile, CheckNickName } from '@/api/user'
export default {
  data() {
    return {
      countDown: 0, // 倒计时
      active: 1,
      loginloading: false,
      registerloading: false,
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
        UserName: '', // 用户名
        UserPwd: '' // 用户密码
      },
      register: {
        FAccount: '', // 用户
        fristPwd: '',
        secondPwd: '',
        FPwd: '', // 密码
        FMobile: '', // 手机号
        FNickName: '' // 昵称
      },
      msg: {
        FAccountMsg: '请输入账号',
        PwdMsg: '请输入密码',
        PhoneMsg: '请输入手机号',
        NickMsg: '请输入昵称'
      }
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
      if (this.$refs.registerPage) {
        this.$refs.registerPage.resetValidation()
      }
      if (this.$refs.loginPage) {
        this.$refs.loginPage.resetValidation()
      }
    }
  },
  created() {},
  methods: {
    FAccountValidator(val) {
      return new Promise(resolve => {
        CheckAccount({ FAccount: val }).then(data => {
          let isSure = true
          if (data.code === 1) {
            if (data.object === 1) {
              this.msg.FAccountMsg = '用户名重复，请重新输入'
              isSure = false
            } else {
              isSure = true
            }
          } else {
            this.msg.FAccountMsg = '请求失败'
            isSure = false
          }

          resolve(isSure)
        })
      })
    },
    PwdValidator(val) {
      if (this.loginData.fristPwd === val) {
        return true
      } else {
        this.msg.PwdMsg = '密码不一致，请重新输入'
        return false
      }
    },
    PhoneValidator(val) {
      const testPhone = /^1[34578]\d{9}$/
      if (!testPhone.test(val)) {
        this.msg.PhoneMsg = '请输入正确的手机号'
        return false
      }
      return new Promise(resolve => {
        CheckMobile({ FMobile: val }).then(data => {
          let isSure = true
          if (data.code === 1) {
            if (data.object === 1) {
              this.msg.PhoneMsg = '手机号重复，请重新输入'
              isSure = false
            } else {
              isSure = true
            }
          } else {
            this.msg.PhoneMsg = '请求失败'
            isSure = false
          }

          resolve(isSure)
        })
      })
    },
    NickValidator(val) {
      return new Promise(resolve => {
        CheckNickName({ FNickName: val }).then(data => {
          let isSure = true
          if (data.code === 1) {
            if (data.object === 1) {
              this.msg.NickMsg = '昵称重复，请重新输入'
              isSure = false
            } else {
              isSure = true
            }
          } else {
            this.msg.NickMsg = '请求失败'
            isSure = false
          }

          resolve(isSure)
        })
      })
    },
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
    loginForm() {
      this.loginloading = true
      this.$store
        .dispatch('user/login', this.loginData)
        .then(data => {
          Toast.success('登录成功')
          this.loginloading = false
          this.$router.push({ path: '/' })
        })
        .catch(error => {
          this.loginloading = false
          console.log(error)
        })
    },
    registerForm() {
      this.registerloading = true
      this.$store
        .dispatch('user/register', this.register)
        .then(data => {
          Toast.success({ duration: 2000, message: '注册成功' })
          setTimeout(() => {
            this.active = 1
            this.register = Object.assign({}, this.$data.register, this.$options.data().register)
            this.registerloading = false
          }, 2000)
        })
        .catch(error => {
          this.registerloading = false
          console.log(error)
        })
    }
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
      top: 50px;
      margin: 18px;
      width: 28.5rem;
      max-width: 90%;
      font-size: 1.167rem;
      background-color: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      .van-cell {
        // padding: 0;
        // padding-bottom: 5px;
        // margin-bottom: 5px;
      }
      /deep/ .van-tabs__content {
        margin-top: 20px;
      }
      /deep/.van-field__left-icon {
        height: 30px;
        width: 32px;
        margin: 0;
        padding: 0 12px 0px 0;
        border-bottom: solid 1px #ccc;
        .svg-icon {
          height: 100%;
          width: 100%;
        }
      }
      /deep/.van-cell__value {
        font-size: 18px;
      }
      /deep/.van-field__value .van-field__control {
        border: none;
        border-bottom: solid 1px #ccc;
        padding: 0 5px 5px 0;
        margin-bottom: 5px;
        .el-select {
          width: 100%;

          .el-input__inner {
            height: 25px;
            line-height: 25px;
            border: none;
            padding: 0;
          }
        }
      }
      /deep/.van-field--error {
        .van-field__left-icon,
        .van-field__value .van-field__control {
          border-bottom: solid 1px #ee0a24 !important;
        }
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
