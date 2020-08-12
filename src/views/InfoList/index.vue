<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="title" />
    <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" class="content">
      <van-list
        ref="homeList"
        class="homeList"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="van-clearfix">
          <div class="buildContent float-item" v-for="item in infoList" :key="item.FID">
            <div class="buildBox" v-html="item.FContent"></div>
            <van-row class="phoneBox">
              <van-col span="12">{{item.FLinkTel}}</van-col>
              <van-col span="12" align="right">
                <span class="callPhone" @click="openphone(item.FLinkTel)">点击拨打</span>
              </van-col>
            </van-row>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { GetCollections } from '@/api/home'
export default {
  data() {
    return {
      infoList: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5,
      scrollTop: 0
    }
  },
  props: {
    title: {
      type: String,
      default: '我的收藏'
    }
  },
  computed: {},
  mounted() {},
  methods: {
    onLoad() {
      if (!this.finished) {
        this.loading = true
        if (this.infoList.length > 0) {
          this.pageNum += 1
        }
        this.$nextTick(() => {
          this.getDataList(true)
        })
      }
    },
    getDataList(isPage) {
      GetCollections({
        curr: !isPage ? 1 : this.pageNum,
        pageSize: this.pageSize
      })
        .then(data => {
          this.dataHlander(isPage, data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    dataHlander(isPage, data) {
      this.infoList = !isPage ? data.object : this.infoList.concat(data.object)
      this.loading = false
      if (data.object.length < this.pageSize) {
        this.finished = true
      }
      if (!isPage) {
        setTimeout(() => {
          Toast('刷新成功')
          this.refreshing = false
        }, 1000)
      }
    },
    onRefresh() {
      // 重载数据
      this.refreshing = true
      this.getDataList(false)
    },
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    openphone(phone) {
      Dialog.confirm({
        title: '是否拨打电话',
        message: `电话:${phone}`
      })
        .then(() => {
          window.location.href = `tel://${phone}`
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .van-pull-refresh__track {
  width: 100%;
}

.phoneBox {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  margin-top: 20px;
  padding-bottom: 10px;
  &::after {
    position: relative;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    bottom: -10px;
    width: 100%;
    border-bottom: 2px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>
