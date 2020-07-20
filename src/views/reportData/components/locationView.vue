<template>
  <div class="infoPreview">
    <div
      v-for="(item,index) in locationList"
      :key="index"
      :class="['infoBox', (index + 1 !== locationList.length ) ? 'van-hairline--bottom' : '']"
    >
      <div class="buildContent">
        <div class="contentBox">
          <van-row class="halfBorder">
            <van-col class="name" span="8">报备项目</van-col>
            <van-col class="content" span="16">{{item.ProjectName}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">负责人</van-col>
            <van-col class="content" span="16">
              {{item.PrincipalerName}} -
              <span
                class="phone"
                @click="openphone(item.PrincipalerMobile)"
              >{{item.PrincipalerMobile}}</span>
            </van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">客户姓名</van-col>
            <van-col class="content" span="16">{{item.CustomerName}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">客户电话</van-col>
            <van-col
              v-if="item.ReportMobileType == 1"
              class="content phone"
              span="16"
              @click="openphone(item.CustomerMobile)"
            >{{item.CustomerMobile}}</van-col>
            <van-col
              v-else
              class="content"
              span="16"
            >{{ item.CustomerMobile.substr(0, 3) + '****' + item.CustomerMobile.substr(7) }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">预约来访日期</van-col>
            <van-col class="content" span="16">{{item.ArriveDateTime}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">体系</van-col>
            <van-col class="content" span="16">{{ item.CompanyName }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">报备人</van-col>
            <van-col class="content" span="16">{{item.ReporterName}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">报备电话</van-col>
            <van-col
              class="content phone"
              span="16"
              @click="openphone(item.ReporterMobile)"
            >{{ item.ReporterMobile }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">房号</van-col>
            <van-col class="content" span="16">{{item.HourseCode}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">报备时间</van-col>
            <van-col class="content" span="16">{{ item.CreateTime }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">报备状态</van-col>
            <van-col class="content" span="16">{{ item.StatusName }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="8">所在门店</van-col>
            <van-col class="content" span="16">{{item.StoreName}}</van-col>
          </van-row>
          <van-row :class="['halfBorder',{'hideBorder':roles !== '2'}]">
            <van-col class="name" span="8">备注</van-col>
            <van-col class="content notice" span="16">{{item.Remark}}</van-col>
          </van-row>
          <!-- -->
          <van-row v-if="roles == '2'" class="controlBox" type="flex" justify="end">
            <van-button class="buttonRight" type="info" size="small" @click="changeSate(item)">修改状态</van-button>
          </van-row>
        </div>
      </div>
    </div>

    <van-dialog
      v-model="showModify"
      show-cancel-button
      confirm-button-text="确认修改"
      :before-close="onBeforeClose"
      @confirm="postModify"
    >
      <van-form ref="postModify" class="auth-form">
        <van-field
          v-if="isPhone"
          :label-width="setlabelWidth"
          v-model="dialogForm.StatusName"
          name="状态枚举"
          label="状态枚举"
          placeholder="选择状态枚举"
          readonly
          @click="opemPopup"
          right-icon="arrow-down"
          :rules="[{ required: true, message: '选择状态枚举' }]"
        />
        <van-field
          v-model="satelabel"
          v-else
          :label-width="setlabelWidth"
          :border="false"
          name="状态枚举"
          label="状态枚举"
        >
          <template #input>
            <el-select ref="StatusNameSelect" v-model="dialogForm.Status" placeholder="请选择状态枚举">
              <el-option
                v-for="item in sateList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>
        <van-field
          v-if="dialogForm.Status == 8"
          :label-width="setlabelWidth"
          v-model="dialogForm.HourseCode"
          name="房号名称"
          label="房号名称"
          placeholder="请输入房号名称"
          :rules="[{ required: true, message: '请输入房号名称' }]"
        />
      </van-form>
    </van-dialog>
    <van-popup v-if="destoryPoupState" v-model="showpopup" position="bottom" @closed="destoryPoup">
      <van-picker
        :default-index="defaultIndex"
        :columns="hanlersateList"
        show-toolbar
        title="修改状态"
        @cancel="showpopup = !showpopup"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import { mapState, mapGetters, mapActions } from "vuex";
import { ChangeStatus } from "@/api/report";
import VanFieldSelectPicker from "@/components/VanFieldSelectPicker";
export default {
  name: "locationView",
  props: {
    locationList: {
      type: Array,
      default: []
    },
    sateList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showModify: false,
      defaultIndex: null,
      orginHourseCode: "",
      setlabelWidth: "100px",
      showpopup: false,
      destoryPoupState: false,
      dialogForm: {
        ReportId: 0,
        Status: 0,
        StatusName: "",
        HourseCode: ""
      },
      satelabel: "请选择",
      currReport: {},
      modify: {
        name: "",
        system: ""
      }
    };
  },
  watch: {
    showModify() {
      if (this.showModify) {
        this.$nextTick(() => {
          // 第一次打开options的时候 z-index 小于弹窗得z-index 导致 option被覆盖 需要默认打开一次
          this.$refs.StatusNameSelect.visible = true;
          setTimeout(() => {
            this.$refs.StatusNameSelect.visible = false;
          },0);
        });
      }
    }
  },
  components: {
    VanFieldSelectPicker
  },
  computed: {
    ...mapGetters(["roles", "isPhone"]),
    hanlersateList() {
      let label = [];
      this.sateList.shift();
      label = this.sateList.map(item => {
        return item.label;
      });
      return label;
    }
  },
  mounted() {},
  methods: {
    openphone(phone) {
      Dialog.confirm({
        title: "是否拨打电话",
        message: `电话:${phone}`
      })
        .then(() => {
          window.location.href = `tel://${phone}`;
        })
        .catch(() => {
          // on cancel
        });
    },
    opendetail(item) {
      this.$router.push({
        name: "reportList",
        params: {
          id: item.id,
          name: item.name
        }
      });
    },
    changeSate(data) {
      let satevIndex = 0;
      this.dialogForm.ReportId = data.Id;
      this.orginHourseCode = data.HourseCode;
      this.dialogForm.HourseCode = data.HourseCode;
      this.sateList.find((item, index) => {
        if (item.label == data.StatusName) {
          this.defaultIndex = index;
          this.dialogForm.Status = item.value;
          this.dialogForm.StatusName = item.label;
        }
      });
      this.$nextTick(() => {
        this.showModify = true;
      });
    },
    onBeforeClose(action, done) {
      if (action === "confirm") {
        return done(false);
      } else {
        // 重置表单校验

        this.$refs["postModify"].resetValidation();
        return done();
      }
    },
    postModify(item) {
      ChangeStatus({
        ReportId: this.dialogForm.ReportId,
        Status: this.dialogForm.Status,
        HourseCode:
          this.dialogForm.Status == 8
            ? this.dialogForm.HourseCode
            : this.orginHourseCode
      }).then(() => {
        this.showModify = !this.showModify;
        // 本地修改不走请求
        this.$emit("ChangeStatus", {
          ReportId: this.dialogForm.ReportId,
          Status: this.dialogForm.Status
        });
        Toast.success("状态修改成功");
      });
    },
    onConfirm(value) {
      let satevalue = this.sateList.find((item, index) => {
        if (item.label == value) {
          return item;
        }
      });
      this.dialogForm.Status = satevalue.value;
      this.dialogForm.StatusName = satevalue.label;
      this.showpopup = false;
    },
    opemPopup() {
      this.showpopup = true;
      this.destoryPoupState = true;
    },
    destoryPoup() {
      this.showpopup = false;
      this.destoryPoupState = false;
    }
  }
};
</script>
<style lang="less" scoped>
.infoPreview {
  .infoBox {
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
    margin-top: 10px;
    background: #fff;
    // border: solid 1px #ccc;
    .imageSize {
      width: 90px;
      height: 90px;
    }
    .buildContent {
      flex-grow: 1;
      border: 1px solid rgba(0, 0, 0, 0.2);
      .contentBox {
        display: flex;
        flex-direction: column;
        // margin-left: 15px;
        font-size: 14px;
        // margin-bottom: 10px;
        /deep/.van-row {
          &.halfBorder {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            .van-col {
              padding: 5px 0;
              border-left: 1px solid rgba(0, 0, 0, 0.2);
            }
            .van-col:first-child {
              border-left: none;
            }
          }
          &.controlBox {
            padding: 5px 10px;
          }
        }
        .name {
          color: #908585;
          font-size: 14px;
          line-height: 20px;
          text-indent: 5px;
        }
        .content {
          min-height: 30px;
          font-size: 14px;
          line-height: 20px;
          text-indent: 5px;
          // margin-top: 10px;
          &.notice {
            text-indent: 0px;
            padding: 0 5px !important;
          }
        }
        .phone {
          color: #ff0000;
        }
      }
      .buttonRight {
        margin-right: 10px;
      }
      .hideBorder {
        // border: none !important;
        .notice {
          word-break: break-all;
        }
      }
    }
  }
  .reprotSet {
    width: 80%;
    height: 80%;
  }
}
.auth-form {
  padding-bottom: 0;
  /deep/.van-field__value {
    border: solid 1px #ccc;
    padding-left: 5px;
    margin-right: 5px;
    .van-field__control {
      border: none;
    }
    .van-field__right-icon {
      margin-right: 5px;
    }
  }
  .van-cell:last-child {
    padding: 0;
  }
  /deep/ .van-field__label {
    width: 50px;
  }
}
</style>