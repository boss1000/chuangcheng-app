<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="title" />
    <van-list ref="authform" class="auth-form">
      <div class="content" span="24" @click="getImg($event)" v-html="Detail"></div>
    </van-list>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
export default {
  name: 'HomeDetail',
  data() {
    return {}
  },
  computed: {
    title() {
      return this.$route.params.FTitle
    },
    Detail() {
      return this.$route.params.FContent
    }
  },
  mounted() {
    // console.log(this.$route)
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    getImg(event) {
      const getSrc = event.target.getAttribute('src')
      if (getSrc) {
        ImagePreview({
          images: [getSrc],
          showIndex: false
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.auth-form {
  padding: 0;
  margin: 0px;
}
.commonBase .content {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
<style lang="less">
// pre {
//   white-space: pre-wrap;
//   white-space: -moz-pre-wrap;
//   white-space: -pre-wrap;
//   white-space: -o-pre-wrap;
//   word-wrap: break-word;
// }
.showSharePoup {
  .van-image-preview__image {
    display: flex;
  }
}
</style>