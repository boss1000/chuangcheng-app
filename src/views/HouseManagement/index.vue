<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="title" />
    <van-pull-refresh class="content" v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
      <van-list
        ref="homeList"
        class="homeList"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell class="buildContent" v-for="item in infoList" :key="item.FID">
          <van-row>
            <van-col span="12">小区: {{item.FName}}</van-col>
            <van-col span="12">装修: {{item.FFitmentName}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">面积: {{item.FArea}}</van-col>
            <van-col span="12">楼层: {{item.FStorey ? `${item.FStorey}楼`:''}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">价格: {{item.FPrice ? `${item.FPrice}万`:''}}</van-col>
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col span="12">{{item.FLinkTel}}</van-col>
            <van-col span="12" align="right">
              <span class="callPhone" @click="openphone(item.FLinkTel)">点击拨打</span>
            </van-col>
          </van-row>
          <van-row class="rowButtun" type="flex" justify="end">
            <van-button hairline plain type="info" size="small" @click="editer(item)">编辑</van-button>
            <van-button hairline plain type="info" size="small" @click="setTop(item)">置顶</van-button>
            <van-button
              v-if="!isPhone"
              hairline
              plain
              type="info"
              size="small"
              @click="deleteItem(item)"
            >删除</van-button>
          </van-row>
          <template #right>
            <van-button
              class="delete-button"
              square
              type="danger"
              text="删除"
              @click="deleteItem(item)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { Toast, Dialog } from 'vant'
import { GetPrecisePub, TopPrecisePub, DelPrecisePubn } from '@/api/home'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeDetail',
  data() {
    return {
      title: '房源管理',
      infoList: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['loginData', 'isPhone'])
  },
  mounted() {
    // console.log(this.loginData)
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
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
      GetPrecisePub({
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
    },
    setTop(item) {
      if (this.loginData.IsVIP) {
        TopPrecisePub({ FID: item.FID }).then(data => {
          if (data.code === 1) {
            Toast('置顶成功')
            this.getDataList(false)
          } else {
            Toast('置顶失败')
          }
        })
      } else {
        Toast('您不是Vip用户，没有置顶权限')
      }
    },
    deleteItem(item) {
      Dialog.confirm({
        title: '提示',
        message: `是否删除此房源信息`
      })
        .then(() => {
          DelPrecisePubn({ FID: item.FID }).then(data => {
            if (data.code === 1) {
              Toast('删除成功')
              this.getDataList(false)
            } else {
              Toast('删除失败')
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    editer(item) {
      this.$router.push({
        name: 'InfoDelivery',
        params: item
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-pull-refresh__track {
  width: 100%;
}
.commonBase {
  .content {
    // width: 100%;
    height: calc(100vh - 60px);
    background: #fff;
    display: flex;
    overflow: scroll;
    .homeList {
      padding: 0 20px;
      font-size: 16px;
      .buildContent {
        padding-top: 20px;
        .van-row {
          padding-bottom: 10px;
          .callPhone {
            color: #3399ea;
            cursor: pointer;
          }
          &.rowButtun {
            border-top: solid 1px rgba(0, 0, 0, 0.2);
            padding: 5px 2px 5px 0;
            /deep/ .van-button {
              margin-right: 10px;
              border-radius: 15px;
              width: 60px;
              height: 24px;
              color: #000;
              border-color: rgba(0, 0, 0, 0.4);
              &:last-child {
                margin: 0;
              }
            }
          }
          /deep/.van-button--hairline::after {
            border-radius: 50px;
          }
        }
      }
      .delete-button {
        margin-left: 10px;
        text-align: center;
        height: 100%;
      }
    }
  }
}
</style>
