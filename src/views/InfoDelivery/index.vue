<template>
  <div class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="title" />
    <div class="content">
      <div class="buttonBox">
        <van-button
          :class="{ 'active': watchFPubType == 1 }"
          plain
          type="info"
          @click="fromData.FPubType = 1"
        >出售</van-button>
        <van-button
          :class="{ 'active': watchFPubType == 2 }"
          plain
          type="info"
          @click="fromData.FPubType = 2"
        >出租</van-button>
      </div>
      <van-form
        class="formSet"
        ref="InfoDelivery"
        label-width="70px"
        :show-error-message="false"
        @submit="onSubmit"
      >
        <div class="formCell">
          <van-row>
            <van-field
              span="24"
              class="one-pixel-line shadow"
              v-model.trim="fromData.FName"
              :border="false"
              name="小区名称"
              label="小区名称"
              placeholder="请输入小区名称"
              :rules="[{ required: true, message: '请输入小区名称' }]"
            ></van-field>
          </van-row>
          <van-row>
            <van-col span="12">
              <van-field
                class="one-pixel-line shadow"
                v-model.trim="fromData.FArea"
                :border="false"
                name="面积"
                label="面积"
                placeholder="请输入面积"
                type="number"
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
                :placeholder="watchFPubType == 1 ? '总价（万元）':'万元/年'"
                type="number"
                @input="inputChange('FPrice')"
                :rules="[{ required: true, message: '请输入价格' }]"
              ></van-field>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <van-field
                class="one-pixel-line shadow"
                v-model.trim="fromData.FStorey"
                :border="false"
                name="楼层"
                label="楼层"
                placeholder="请输入楼层"
                type="number"
                @input="inputChange('FStorey')"
              ></van-field>
            </van-col>
            <van-col span="12">
              <van-field
                v-if="isPhone"
                readonly
                clickable
                name="picker"
                :value="FFitmentName"
                label="装修"
                placeholder="选择装修"
                @click="showPicker = true"
              />
              <van-field v-else v-model="FFitmentName" name="装修" label="装修" :border="false">
                <template #input>
                  <el-select v-model="fromData.FFitment" placeholder="选择装修">
                    <el-option
                      v-for="item in FFitmentSelect"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </van-field>
            </van-col>
          </van-row>
          <van-row>
            <van-field
              span="24"
              class="one-pixel-line shadow"
              v-model.trim="fromData.FRemark"
              :border="false"
              name="备注"
              label="备注"
              placeholder="请输入备注"
            ></van-field>
          </van-row>
          <van-row>
            <van-field
              span="24"
              class="one-pixel-line shadow"
              v-model.trim="fromData.FLinkTel"
              :border="false"
              name="联系电话"
              label="联系电话"
              placeholder="请输入联系电话"
              type="tel"
              @input="inputChange('FLinkTel')"
              :rules="[{ required: true,validator: phoneValidator, message: phoneMessage }]"
            ></van-field>
          </van-row>
          <van-cell>
            <template #title>
              <span class="custom-title">置顶发布</span>
              <span class="titleTip">置顶功能仅供会员使用</span>
            </template>
            <template #right-icon>
              <van-switch
                v-model="fromData.FIsTop"
                :disabled="loginData.IsVIP == 0 ? true : false"
                size="20"
              />
            </template>
          </van-cell>
        </div>

        <div class="buttonSure">
          <van-button type="info" size="large" native-type="submit">确认发布</van-button>
        </div>
      </van-form>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="FFitmentNameSelect"
        :default-index="fromData.FFitment - 1"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
import { MolPrecisePub, AddPrecisePub } from '@/api/home'
export default {
  name: 'HomeDetail',
  data() {
    return {
      title: '精准发布',
      infoList: [],
      showPicker: false,
      FFitmentName: '',
      FFitmentSelect: [
        {
          label: '毛坯',
          value: 1
        },
        {
          label: '简装',
          value: 2
        },
        {
          label: '中装',
          value: 3
        },
        {
          label: '精装',
          value: 4
        },
        {
          label: '豪装',
          value: 5
        },
        {
          label: '新装',
          value: 6
        },
        {
          label: '老装',
          value: 7
        }
      ],
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
      phoneMessage: '请输入联系电话',
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      pageSize: 5,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['loginData', 'isPhone']),
    FFitmentNameSelect() {
      const Columns = []
      this.FFitmentSelect.map(item => {
        Columns.push(item.label)
      })
      return Columns
    },
    watchFPubType() {
      return this.fromData.FPubType
    }
  },
  watch: {
    watchFPubType() {
      this.$refs['InfoDelivery'].resetValidation()
    }
  },
  created() {
    // 初始化 手机号码默认值
    this.fromData.FLinkTel = this.loginData.FMobile
    if (Object.keys(this.$route.params).length > 0) {
      this.fromData = Object.assign({}, this.fromData, this.$route.params)
      this.FFitmentName = this.$route.params.FFitmentName
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    },
    inputChange(key) {
      // 输入框值改变
      this.fromData[key] = this.fromData[key].replace(/[^\d.]/g, '')
    },
    phoneValidator(value, rule) {
      if (value.length > 0) {
        const isTest = /[1][3,4,5,6,7,8][0-9]{9}$/.test(value)
        if (!isTest) {
          this.phoneMessage = `联系电话错误，请检查`
        }

        return isTest
      }
    },
    onConfirm(value, index) {
      this.FFitmentName = value
      this.fromData.FFitment = index + 1
      this.showPicker = false
    },
    onSubmit() {
      // 有值为修改
      if (this.fromData.FID) {
        MolPrecisePub(this.fromData).then(data => {
          if (data.code === 1) {
            Toast('修改成功')
            this.onClickLeft()
          } else {
            Toast('修改失败')
          }
        })
      } else {
        AddPrecisePub(this.fromData).then(data => {
          if (data.code === 1) {
            Toast('新增成功')
            this.onClickLeft()
          } else {
            Toast('新增失败')
          }
        })
      }
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
    /deep/.van-field__label {
      margin-right: 0;
    }
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
.formSet {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  .formCell {
    flex-grow: 1;
  }
  .buttonSure {
    padding: 20px 30px;
  }
}

/deep/.van-row {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  &::after {
    // position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    bottom: 0;
    width: 100%;
    border-bottom: 2px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
/deep/ .el-select {
  width: 100%;
  .el-input__inner {
    border: none;
    height: 28px;
    line-height: 28px;
  }
}
.titleTip {
  font-size: 12px;
  color: #ccc;
  padding-left: 10px;
}
</style>
