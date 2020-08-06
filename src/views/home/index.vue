<!-- home -->
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      class="homeList"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="buildContent" v-for="item in infoList" :key="item.FID">
        <span class="buildTime">{{item.FCreatTime}}</span>
        <div class="buildBox">
          <img :src="`http://ccapi.chuanchengfc.com//api/Filse/GetAdvertImg?FID=${item.FID}`" alt />
          <div class="buildText">{{item.FTitle}}</div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { GetLoanAdvert } from '@/api/home'
export default {
  data() {
    return {
      infoList: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5
    }
  },
  computed: {},
  mounted() {},
  methods: {
    onLoad() {
      if (!this.finished) {
        this.loading = true
        this.pageNum += 1
        this.$nextTick(() => {
          this.getDataList(true)
        })
      }
    },
    getDataList(isPage) {
      if (!isPage) {
        // 判断是否为翻页
        this.infoList = []
        this.pageNum = 1
      }
      this.$nextTick(() => {
        GetLoanAdvert({
          curr: this.pageNum,
          pageSize: this.pageSize
        })
          .then(data => {
            this.infoList = this.infoList.concat(data.object)
            this.loading = false
            if (data.object.length < this.pageSize) {
              this.finished = true
            }
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>
<style lang="scss" scoped>
.homeList {
  padding: 0 20px;
  background: #fff;
  .buildContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
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
