<template>
  <div :class="['commonBase', {noData: listData.length == 0}]">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" :title="`${title}的报备`" />
    <div class="mainContent" v-if="listData.length > 0">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="aloneReport" v-for="(item,index) in listData" :key="index">
          <van-row>
            <van-col span="8">报备项目</van-col>
            <van-col span="16">{{ item.ProjectName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">负责人</van-col>
            <van-col span="16">
              {{item.PrincipalerName}} -
              <span
                class="redcol"
                @click="openphone(item.PrincipalerMobile)"
              >{{item.PrincipalerMobile}}</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="8">客户姓名</van-col>
            <van-col span="16">{{ item.CustomerName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">客户电话</van-col>
            <van-col span="16">{{ item.CustomerMobile }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">预约来访日期</van-col>
            <van-col span="16">{{ item.ArriveDateTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">体系</van-col>
            <van-col span="16">{{ item.CustomerName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">报备人</van-col>
            <van-col span="16">{{ item.ReporterName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">报备人电话</van-col>
            <van-col span="16">{{ item.ReporterMobile }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">房号</van-col>
            <van-col span="16">{{ item.HourseCode }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">报备时间</van-col>
            <van-col span="16">{{ item.CreateTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">报备状态</van-col>
            <van-col span="16">{{ item.StatusName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">所在门店</van-col>
            <van-col span="16">{{ item.StoreName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">备注</van-col>
            <van-col span="16">{{ item.Remark }}</van-col>
          </van-row>
          <van-row v-if="roles == '2'" type="flex" justify="end">
            <van-button class="buttonRight" type="info" size="small" @click="changeSate(item)">修改状态</van-button>
          </van-row>
        </div>
      </van-list>
    </div>
    <div class="mainContent noData" v-else>暂无报备数据</div>
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
          v-else
          v-model="satelabel"
          :label-width="setlabelWidth"
          :border="false"
          name="状态枚举"
          label="状态枚举"
        >
          <template #input>
            <el-select ref="StatusNameSelect" v-model="dialogForm.Status" placeholder="请选择状态枚举">
              <el-option
                v-for="item in sateList"
                :key="item.value"
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

<script type="text/javascript">
import { Dialog, Toast } from "vant";
import {
  GetReportListByUserId,
  GetReportListByProjectId,
  ChangeStatus
} from "@/api/report";
import { mapGetters } from "vuex";
export default {
  name: "reportList",
  data() {
    return {
      title: this.$route.params.name || "未知",
      defaultIndex: false,
      destoryPoupState: true,
      showpopup: false,
      showModify: false,
      setlabelWidth: "100px",
      orginHourseCode: "",
      defaultIndex: 0,
      listData: [],
      PageIndex: 1,
      PageSize: 10,
      finished: false,
      loading: false,
      satelabel: '',
      dialogForm: {
        ReportId: 0,
        Status: 0,
        StatusName: "",
        HourseCode: ""
      }
    };
  },
  computed: {
    ...mapGetters(["roles", "sateList", "isPhone"]),
    hanlersateList() {
      let label = [];
      label = this.sateList.map(item => {
        return item.label;
      });
      return label;
    }
  },
  watch: {
    showModify() {
      if (this.showModify) {
        this.$nextTick(() => {
          // 第一次打开options的时候 z-index 小于弹窗得z-index 导致 option被覆盖 需要默认打开一次
          this.$refs.StatusNameSelect.visible = true;
          setTimeout(() => {
            this.$refs.StatusNameSelect.visible = false;
          }, 0);
        });
      }
    }
  },
  mounted() {
    this.getReport();
  },
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
    onClickLeft() {
      this.$router.go(-1); //返回上一层
    },
    onLoad() {
      if (!this.finished && this.listData.length > 0) {
        this.loading = true;
        this.PageIndex += 1;
        this.$nextTick(() => {
          this.getReport();
        });
      }
    },
    getReport() {
      if (this.$route.params.id) {
        GetReportListByUserId({ UserId: this.$route.params.id }).then(res => {
          this.listData = res.Result;
          this.finished = true;
        });
      } else {
        GetReportListByProjectId({
          ProjectId: this.$route.params.ProjectId,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }).then(res => {
          this.listData = this.listData.concat(res.Result);
          if (res.Result.length < this.PageSize) {
            this.finished = true;
          }
        });
      }
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
      this.defaultIndex = satevIndex;
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
.commonBase {
  &.noData {
    background-color: #fff;
  }
}
.mainContent {
  flex-grow: 1;
  &.noData {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
}
.aloneReport {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 20px;
  /deep/ .van-row {
    padding-bottom: 10px;
  }
  .redcol {
    color: #ff0000;
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
