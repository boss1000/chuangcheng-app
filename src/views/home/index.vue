<!-- home -->
<template>
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
          <span class="buildTime">{{item.FCreatTime}}</span>
          <div class="buildBox" @click="openDetail(item)">
            <img :src="`http://ccapi.chuanchengfc.com/api/Filse/GetAdvertImg?FID=${item.FID}`" alt />
            <div class="buildText">{{item.FTitle}}</div>
          </div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { Toast } from 'vant'
import { GetLoanAdvert } from '@/api/home'
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
  computed: {},
  mounted() {},
  activated() {
    if (this.scrollTop !== 0) {
      document.querySelector('.content').scrollTo(0, this.scrollTop)
    }
  },
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
      GetLoanAdvert({
        curr: !isPage ? 1 : this.pageNum,
        pageSize: this.pageSize
      })
        .then(data => {
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
        })
        .catch(error => {
          console.log(error)
        })
    },
    onRefresh() {
      // 重载数据
      this.refreshing = true
      this.getDataList(false)
    },
    openDetail(data) {
      this.scrollTop = document.querySelector('.content').scrollTop
      this.$router.push({
        name: 'HomeDetail',
        params: data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .van-pull-refresh__track {
  width: 100%;
}
.content {
  // width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  overflow: scroll;
}
.homeList {
  padding: 0 20px;
  background: #fff;
  .buildContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    &:first-child {
      padding-top: 20px;
    }
    .buildTime {
      background: #e2e2e2;
      padding: 4px 10px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .buildBox {
      position: relative;
      width: 100%;
      height: 200px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      .buildText {
        position: absolute;
        top: 170px;
        height: 30px;
        width: 100%;
        line-height: 30px;
        color: #fff;
        padding: 0 10px;
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
