<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft">
      <template #title>
        <van-search
          v-model="searchValue"
          placeholder="搜索，多关键字用空格隔开"
          input-align="center"
          disabled
          @click="goSearch"
        />
      </template>
    </van-nav-bar>
    <van-pull-refresh
      v-model="refreshing"
      success-text="加载成功"
      @refresh="onRefresh"
      class="auth-form"
    >
      <van-list class="chatList" :immediate-check="false" @load="loadMessage">
        <div v-for="(item,index) in dataList" :key="index" @click="hiddenOption">
          <div class="van-clearfix">
            <!-- :style="{float:item.UserID === loginData.UserId ? 'right': 'left'}" -->
            <div :class="[{ reserve: item.UserID === loginData.UserId }, 'float-item']">
              <van-image
                width="60"
                height="60"
                :src="`http://ccapi.chuanchengfc.com/api/Filse/GetPortrait?UserID=${item.UserID}`"
              />
              <div class="chatContent">
                <div class="contentName">{{item.FNickName}}</div>
                <div v-show="item.active" class="contentOption">
                  <div
                    v-clipboard:copy="hanlderInfo(item.FContent)"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                  >复制</div>
                  <div @click.stop="collection(item)">收藏</div>
                  <div @click.stop="linkphone(item)">联系他</div>
                </div>
                <div
                  class="contentBox"
                  v-html="item.FContent"
                  @touchstart.stop="gotouchstart(item)"
                  @touchmove="gotouchmove(item)"
                  @touchend="gotouchend(item)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="infoOption">
      <van-icon class="optionIcon" name="add-o" size="24" @click="optionAdd" />
      <van-field
        class="optionText"
        v-model="optionText"
        rows="1"
        :autosize="{ maxHeight: 84, minHeight: 28 }"
        label
        type="textarea"
        clearable
        placeholder
      />
      <van-button
        class="optionButtom"
        size="mini"
        type="info"
        :loading="sendloading"
        loading-text="发送中"
        @click="infoSend"
      >发送</van-button>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { GetLogByTime } from '@/api/chat'
import { InsCollection } from '@/api/home'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  data() {
    return {
      refreshing: false,
      ws: null,
      dataList: [],
      timeStamp: '',
      commonBase: null,
      activeHeight: '',
      Loop: null,
      searchValue: '',
      optionText: '',
      sendloading: false,
      sendcache: [] // 信息缓存
    }
  },
  mounted() {
    this.commonBase = document.querySelector('.auth-form') // 获取对象
    this.getData()
    this.setSocket()
    // const userAgent = navigator.userAgent
    // const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    // if (!isiOS) {
    //   setTimeout(() => {
    //     const showHeight = document.body.offsetHeight - 200
    //     document.body.animate(
    //       {
    //         scrollTop: showHeight
    //       },
    //       'normal',
    //       'linear'
    //     )
    //   }, 200)
    // }
  },
  computed: {
    ...mapGetters(['loginData', 'isPhone']),
    getScrollTop() {
      return this.commonBase.scrollTop
    }
  },
  watch: {
    sendcache() {
      if (
        this.commonBase.scrollHeight - this.commonBase.scrollTop - 200 < this.commonBase.clientHeight &&
        this.sendcache.length > 0
      ) {
        this.dataList = this.sendcache.concat(this.dataList)
        this.$nextTick(() => {
          this.sendcache = []
        })
      }
    }
  },
  methods: {
    onRefresh() {
      // 改变时间 兼容ios
      let setTime = this.dataList[this.dataList.length - 1].FAddTime
      setTime = setTime.replace('T', ' ')
      const arr = setTime.split(/[- :]/)
      const _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
      this.timeStamp = Date.parse(_date)

      // 获取当前高度
      this.activeHeight = this.commonBase.scrollHeight // 滚动高度
      this.$nextTick(() => {
        this.getData()
      })
    },
    getData() {
      GetLogByTime({
        timeStamp: this.timeStamp
      }).then(data => {
        const setData = []
        for (const index in data.object) {
          setData.push(Object.assign({}, data.object[index], { active: false }))
        }
        // 第一次加载
        if (!this.timeStamp) {
          this.dataList = setData.reverse()
          this.setSrcoll()
        } else {
          this.dataList = this.dataList.concat(setData.reverse())
          this.refreshing = false
          this.$nextTick(() => {
            this.commonBase.scrollTop = this.commonBase.scrollHeight - this.activeHeight // 滚动高度
          })
        }
      })
    },
    setSrcoll() {
      // 最底部
      this.$nextTick(() => {
        this.commonBase.scrollTop = this.commonBase.scrollHeight // 滚动高度
      })
    },
    setSocket() {
      this.ws = new WebSocket(
        'ws://ccapi.chuanchengfc.com/api/ChatRoom/ConnChatRoom?token=Bearer ' + getToken('Admin-Token')
      )
      const that = this
      this.ws.onmessage = function(evt) {
        // 接受信息
        const newData = JSON.parse(evt.data)
        const item = [
          {
            UserID: newData.UserIDFrom,
            FNickName: newData.NickName,
            FAddTime: newData.SendTime,
            FID: newData.FID,
            FContent: newData.Content,
            FTelLink: newData.FTelLink
          }
        ]
        that.sendcache = item.concat(that.sendcache)
      }
    },
    gotouchstart(item) {
      clearInterval(this.Loop) // 再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(
        function() {
          // 将所有隐藏
          for (const index in this.dataList) {
            if (this.dataList[index].active) {
              this.dataList[index].active = false
            }
          }
          item.active = true
        }.bind(this),
        800
      )
    },
    gotouchmove(item) {
      item.active = false
    },
    gotouchend(item) {
      clearInterval(this.Loop)
      // item.active = false
    },
    hiddenOption() {
      if (this.dataList.length > 0) {
        // 将所有隐藏
        for (const index in this.dataList) {
          if (this.dataList[index].active) {
            this.dataList[index].active = false
          }
        }
      }
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
        item.active = false
      })
    },
    linkphone(item) {},
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    goSearch() {
      this.$router.push({
        name: 'ChatroomSearch'
      })
    },
    optionAdd() {
      this.$router.push({
        name: 'InfoDelivery'
      })
    },
    infoSend() {
      this.sendloading = true
      const u = navigator.userAgent
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
      let setSend = isAndroid ? this.optionText.replace(/\n/g, '\\n').replace(/\r/g, '\\r') : this.optionText
      setSend = setSend
        .replace(/<(?!br|input).*?>/g, '')
        .replace(/(^\s*)|(\s*$)/g, '')
        .replace(/\n/g, '<br>') // 去除所有标签 去除首尾空格
      if (setSend.length === 0) {
        this.optionText = ''
        this.sendloading = false
        return false
      }
      const sendArray = []
      let finalData = ''
      // 循环去除每一行的空格
      for (const index in setSend.split('<br>')) {
        const currData = setSend.split('<br>')[index].replace(/(^\s*)|(\s*$)/g, '')
        sendArray.push(currData)
      }
      finalData = sendArray.join('<br>')
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(finalData)
        this.sendloading = false
        this.optionText = ''
        finalData = ''
        this.setSrcoll()
      } else {
        Toast.fail('连接已经关闭')
        this.sendloading = false
      }
    },
    loadMessage() {
      // 判定元素是否滚动到底 200
      if (
        this.commonBase.scrollHeight - this.commonBase.scrollTop - 200 < this.commonBase.clientHeight &&
        this.sendcache.length > 0
      ) {
        this.dataList = this.sendcache.concat(this.dataList)
        this.$nextTick(() => {
          this.sendcache = []
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.commonBase {
  overflow: hidden;
}
.auth-form {
  overflow: scroll;
  border-radius: 0;
}
.van-list {
  display: flex;
  flex-direction: column-reverse;
  background: #fff;
  // padding: 0 20px;
  flex-grow: 1;
  .van-clearfix {
    padding: 20px 0;
  }
  .float-item {
    display: flex;
    flex-direction: row;
    .chatContent {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 65%;
      padding: 0 0 0 20px;
      .contentName {
        padding: 0 0 5px 0;
      }
      .contentBox {
        position: relative;
        border-radius: 8px;
        background: #e2e2e2;
        position: relative;
        border-color: #e2e2e2;
        padding: 10px;
        &::after {
          box-sizing: content-box;
          width: 0px;
          height: 0px;
          position: absolute;
          top: 10px;
          left: -18px;
          padding: 0;
          border-right: 9px solid #e2e2e2;
          border-top: 9px solid transparent;
          border-bottom: 9px solid transparent;
          border-left: 9px solid transparent;
          display: block;
          content: '';
          z-index: 10;
        }
      }
      .contentOption {
        position: absolute;
        display: flex;
        left: 35px;
        top: -8px;
        // padding: 0 10px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.8);
        z-index: 20;
        color: #fff;
        // width: 125px;
        &::after {
          box-sizing: content-box;
          width: 0px;
          height: 0px;
          position: absolute;
          top: 22px;
          left: 50px;
          padding: 0;
          border-right: 7px solid transparent;
          border-top: 7px solid rgba(0, 0, 0, 0.8);
          border-bottom: 7px solid transparent;
          border-left: 7px solid transparent;
          display: block;
          content: '';
          z-index: 10;
        }
        div {
          height: 22px;
          line-height: 22px;
          padding: 0 6px;
          border-right: #fff solid 1px;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    &.reserve {
      flex-direction: row-reverse;
      .chatContent {
        padding: 0 20px 0 0;
      }
      .contentBox {
        &::after {
          border-right: 9px solid transparent;
          border-left: 9px solid #e2e2e2;
          right: 0;
          left: 100%;
        }
      }
    }
  }
}
.commonTitle {
  display: flex;
  margin: 0;
  border-bottom: 1px solid #e2e2e2;
  /deep/.van-nav-bar__left,
  /deep/.van-nav-bar__right {
    position: relative;
  }
  /deep/.van-nav-bar__title {
    max-width: initial;
    flex-grow: 1;
    .van-search {
      padding: 0;
    }
  }
}
.infoOption {
  display: flex;
  padding: 5px 10px;
  // height: 60px;
  .optionIcon {
  }
  .optionText {
    padding: 0;
    margin: 0 10px;
    min-height: 28px;
  }
  .optionButtom {
    width: 45px;
  }
}
</style>
