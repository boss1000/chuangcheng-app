<template>
  <div class="mineBox">
    <div class="mineTitle">
      <avatarUpload></avatarUpload>
    </div>
    <van-cell
      :border="false"
      title="联系电话"
      value="13587985146"
      class="van-hairline--bottom"
      @click="openFollow"
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
      @click="openFollow"
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
import { removeToken } from '@/utils/auth'
import { Dialog } from 'vant'
import avatarUpload from '@/components/avatarUpload'
export default {
  data() {
    return {
      showShare: false
    }
  },
  components: { avatarUpload },
  methods: {
    openchangepsd() {
      this.$router.push({
        name: 'changePsd'
      })
    },
    openFollow() {
      this.$router.push({
        name: 'followProject'
      })
    },
    loginOut() {
      Dialog.confirm({
        title: '提示',
        message: `是否退出登陆`
      })
        .then(() => {
          removeToken()
          sessionStorage.removeItem('userRoles')
          this.$nextTick(() => {
            this.$router.push({
              name: 'login'
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
    width: 100%;
    height: 180px;
    background: url('../../assets/pic_dingbu@3x.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
}
</style>
