<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="title" />
    <div class="content">
      <div class="buttonBox">
        <van-button
          :class="{ 'active': fromData.FPubType == 1 }"
          plain
          type="info"
          @click="fromData.FPubType = 1"
        >出售</van-button>
        <van-button
          :class="{ 'active': fromData.FPubType == 2 }"
          plain
          type="info"
          @click="fromData.FPubType = 2"
        >出租</van-button>
      </div>
      <van-form ref="registerPage">
        <van-cell-group>
          <van-field
            class="one-pixel-line shadow"
            v-model.trim="fromData.FName"
            :border="false"
            name="小区名称"
            label="小区名称"
            placeholder="请输入小区名称"
            :rules="[{ required: true, message: '请输入小区名称' }]"
          ></van-field>
          <van-row>
            <van-col span="12">
              <van-field
                class="one-pixel-line shadow"
                v-model.trim="fromData.FArea"
                :border="false"
                name="面积"
                label="面积"
                placeholder="请输入面积"
                type="type"
                @input="inputChange('FArea')"
                :rules="[{ required: true, message: '请输入面积' }]"
              ></van-field>
            </van-col>
            <van-col span="12">
              <van-field
                class="one-pixel-line shadow"
                v-model.trim="fromData.FPrice"
                :border="false"
                name="价格"
                label="价格"
                placeholder="请输入价格"
                type="type"
                @input="inputChange('FPrice')"
                :rules="[{ required: true, message: '请输入价格' }]"
              ></van-field>
            </van-col>
          </van-row>
        </van-cell-group>
      </van-form>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeDetail',
  data() {
    return {
      title: '精准发布',
      infoList: [],
      fromData: {
        FID: '',
        FPubType: 1, // 发布类型 必填
        FName: '', // 小区名称 必填
        FArea: '', // 面积 必填
        FPrice: '', // 价格 必填
        FStorey: '', // 楼层
        FFitment: '', // 装修
        FRemark: '', // 备注
        FLinkTel: '', // 联系电话 必填
        FIsTop: 0
      },
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  },
  mounted() {
    // console.log(this.loginData)
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    inputChange(key) {
      // 输入框值改变
      this.fromData[key] = this.fromData[key].replace(/[^\d.]/g, '')
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
    flex-direction: column;
    overflow: scroll;
    // padding: 0 20px;
    .buttonBox {
      text-align: center;
      padding: 15px 20px;
      border-bottom: solid 10px #eee9e9;
      /deep/ .van-button {
        margin: 0 10px;
        height: 34px;
        color: #333;
        background: #eee9e9;
        border: none;
        &.active {
          color: #fff;
          background: #1989fa;
        }
      }
    }
  }
}
</style>
