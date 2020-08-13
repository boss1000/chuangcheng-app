<template>
  <van-pull-refresh
    v-model="refreshing"
    success-text="加载成功"
    @refresh="onRefresh"
    class="commonBase"
  >
    <van-list class="chatList">
      <div v-for="(item,index) in dataList" :key="index">
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
              <div class="contentBox" v-html="item.FContent"></div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<script>
import { getToken } from '@/utils/auth'
import { GetLogByTime } from '@/api/chat'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      refreshing: false,
      ws: null,
      dataList: [],
      timeStamp: '',
      commonBase: null,
      activeHeight: ''
    }
  },
  mounted() {
    this.commonBase = document.querySelector('.commonBase') // 获取对象
    this.getData()
  },
  computed: {
    ...mapGetters(['loginData', 'isPhone'])
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
        // 第一次加载
        if (!this.timeStamp) {
          this.dataList = data.object.reverse()
          this.setSrcoll()
        } else {
          this.dataList = this.dataList.concat(data.object.reverse())
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
      this.ws.onmessage = function(evt) {
        // 接受信息
        const newData = JSON.parse(evt.data)
        const item = {
          UserID: newData.UserIDFrom,
          FNickName: newData.NickName,
          FAddTime: newData.SendTime,
          FID: newData.FID,
          FContent: newData.Content,
          FTelLink: newData.FTelLink
        }
        console.log(item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.commonBase {
  overflow: scroll;
}
.van-list {
  display: flex;
  flex-direction: column-reverse;
  background: #fff;
  padding: 0 20px;
  flex-grow: 1;
  .van-clearfix {
    padding: 20px 0;
  }
  .float-item {
    display: flex;
    flex-direction: row;
    .chatContent {
      display: flex;
      flex-direction: column;
      width: 50%;
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
</style>
