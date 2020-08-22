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
          <van-swipe-cell class="buildContent float-item" v-for="item in infoList" :key="item.FID">
            <div class="buildBox" v-html="item.FContent"></div>
            <van-row class="phoneBox">
              <van-col span="12">{{item.FLinkTel}}</van-col>
              <van-col span="12" align="right">
                <span class="callPhone" @click="openphone(item.FLinkTel)">点击拨打</span>
              </van-col>
            </van-row>
            <template #right>
              <van-button
                v-if="isSearch"
                class="delete-button"
                square
                type="primary"
                text="复制"
                v-clipboard:copy="hanlderInfo(item.FContent)"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
              <van-button
                v-if="isSearch"
                class="info-button"
                square
                type="info"
                text="收藏"
                @click="collection(item)"
              />
              <van-button
                v-if="!isSearch"
                class="delete-button"
                square
                type="danger"
                text="删除"
                @click="deleteItem(item)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { GetCollections, DelCollection, InsCollection } from '@/api/home'
import { SearchLogList } from '@/api/chat'
export default {
  data() {
    return {
      title: '我的收藏',
      fromData: {},
      infoList: [],
      isSearch: false, // 是否为搜索
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5,
      scrollTop: 0
    }
  },
  watch: {},
  mounted() {
    if (Object.keys(this.$route.params).length > 0) {
      const { title, ...fromData } = this.$route.params
      this.isSearch = true
      this.title = title
      this.fromData = Object.assign({}, this.fromData, fromData)
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
      if (this.isSearch) {
        SearchLogList(this.fromData)
          .then(data => {
            this.infoList = data.object
            this.finished = true
          })
          .catch(error => {
            console.log(error)
          })
      } else {
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
      }
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
    },
    deleteItem(rowData) {
      Dialog.confirm({
        title: '提示',
        message: `是否删除此收藏`
      })
        .then(() => {
          DelCollection({ FColID: rowData.FID }).then(data => {
            if (data.code === 1) {
              Toast('删除成功')
              let delIndex = ''
              this.infoList.map((item, index) => {
                if (item.FID === rowData.FID) {
                  delIndex = index
                }
              })
              this.infoList.splice(delIndex, 1)
              // this.getDataList(false)
            } else {
              Toast('删除失败')
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    hanlderInfo(item) {
      const hanlerData = item.replace(/<(?!br).*?>/g, '').replace(/<br\/>/g, ' \n')
      return hanlerData
    },
    onCopy(item) {
      Toast.success('复制成功！')
    },
    onError(item) {
      Toast.fail('复制失败！')
    },
    collection(item) {
      InsCollection({ FChatID: item.FID }).then(data => {
        if (data.code === 1) {
          Toast('收藏成功')
        } else {
          Toast('收藏失败')
        }
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
.info-button {
  margin-left: 1px;
  text-align: center;
  height: 100%;
}
</style>
