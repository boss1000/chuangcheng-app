<template>
  <div class="mineBox">
    <div class="mineTitle">
      <avatarUpload></avatarUpload>
      <span class="userName">{{loginData.UserName}}</span>
    </div>
    <van-cell
      :border="false"
      title="联系电话"
      :value="loginData.FMobile"
      class="van-hairline--bottom"
      @click="openPhone"
    />
    <van-cell
      :border="false"
      title="房源管理"
      class="van-hairline--bottom"
      is-link
      @click="openFollow"
    />
    <van-cell
      :border="false"
      title="我的收藏"
      class="van-hairline--bottom"
      is-link
      @click="openCollection"
    />
    <van-cell
      :border="false"
      title="修改密码"
      class="van-hairline--bottom"
      is-link
      @click="openchangepsd"
    />
    <van-cell :border="false" title="退出登陆" class="van-hairline--bottom" is-link @click="loginOut" />
  </div>
</template>
<script>
import { removeToken, removeLocalStore } from '@/utils/auth'
import { Dialog } from 'vant'
import { mapGetters } from 'vuex'
import avatarUpload from '@/components/avatarUpload'
export default {
  data() {
    return {
      showShare: false
    }
  },
  components: { avatarUpload },
  computed: {
    ...mapGetters(['loginData'])
  },
  mounted() {},
  methods: {
    openPhone() {
      Dialog.confirm({
        title: '是否拨打电话',
        message: `电话:${this.loginData.FMobile}`
      })
        .then(() => {
          window.location.href = `tel://${this.loginData.FMobile}`
        })
        .catch(() => {
          // on cancel
        })
    },
    openchangepsd() {
      this.$router.push({
        name: 'changePsd'
      })
    },
    openCollection() {
      this.$router.push({
        name: 'InfoList'
      })
    },
    openFollow() {
      this.$router.push({
        name: 'HouseManagement'
      })
    },
    loginOut() {
      Dialog.confirm({
        title: '提示',
        message: `是否退出登陆`
      })
        .then(() => {
          removeToken()
          removeLocalStore('loginInfo')
          this.$nextTick(() => {
            this.$router.push({
              name: 'Login'
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.mineBox {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  background: #fff;
  .mineTitle {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 180px;
    background: url('../../assets/pic_dingbu@3x.png');
    background-size: 100% 100%;
    .userName {
      font-size: 16px;
    }
  }
}
</style>
