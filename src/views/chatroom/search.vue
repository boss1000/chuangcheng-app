<template>
  <div id="report" class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft">
      <template #title>
        <van-search v-model="fromData.strWhere" placeholder="搜索，多关键字用空格隔开" input-align="center" />
      </template>
    </van-nav-bar>
    <div class="auth-form">
      <div class="searchContent">
        <van-row>
          <van-col span="4">面积</van-col>
          <van-col span="9">
            <van-field v-model="fromData.FAreaBegin" @input="inputChange('FAreaBegin')" />
          </van-col>
          <van-col span="1">-</van-col>
          <van-col span="9">
            <van-field v-model="fromData.FAreaEnd" @input="inputChange('FAreaEnd')" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="4">价格</van-col>
          <van-col span="9">
            <van-field v-model="fromData.FPriceBegin" @input="inputChange('FPriceBegin')" />
          </van-col>
          <van-col span="1">-</van-col>
          <van-col span="9">
            <van-field v-model="fromData.FPriceEnd" @input="inputChange('FPriceEnd')" />
          </van-col>
        </van-row>
      </div>
      <van-button type="info" block @click="postForm">确认搜索</van-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { SearchLogList } from '@/api/chat'
export default {
  name: 'ChangePsd',
  data() {
    return {
      fromData: {
        strWhere: '',
        FAreaBegin: '',
        FAreaEnd: '',
        FPriceBegin: '',
        FPriceEnd: ''
      }
    }
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    postForm() {
      SearchLogList(this.fromData).then(res => {
        this.$router.push({
          name: 'InfoList',
          params: {
            title: '搜索结果',
            ...this.fromData
          }
        })
      })
    },
    inputChange(key) {
      // 输入框值改变
      this.fromData[key] = this.fromData[key].replace(/[^\d.]/g, '')
    }
  }
}
</script>
<style lang="less" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  border-radius: 0;
  line-height: 27px;
  text-align: center;
  /deep/ .van-cell {
    padding-bottom: 0px;
  }
  .searchContent {
    flex-grow: 1;
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
</style>
