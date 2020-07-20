<template>
  <div class="infoPreview">
    <div
      v-for="(item,index) in accountList"
      :key="index"
      :class="['infoBox', (index + 1 !== accountList.length ) ? 'van-hairline--bottom' : '']"
    >
      <div class="buildContent">
        <div class="contentBox">
          <van-row class="halfBorder">
            <van-col class="name" span="5">账号</van-col>
            <van-col class="content phone" span="7" @click="openphone(item.Mobile)">{{item.Mobile}}</van-col>
            <van-col class="name" span="5">姓名</van-col>
            <van-col class="content" span="7">{{item.UserName}}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="5">体系</van-col>
            <van-col class="content" span="7">{{item.Company}}</van-col>
            <van-col class="name" span="5">状态</van-col>
            <van-col
              class="content"
              span="7"
            >{{ item.Status == '1' ? '启用' : item.Status == '2' ? '停用': '异常' }}</van-col>
          </van-row>
          <van-row class="halfBorder">
            <van-col class="name" span="5">负责项目</van-col>
            <van-col class="content" span="19">
              <div
                v-for="(allproject,index) in item.ResponsibleProjectsName"
                :key="index"
              >{{allproject}}</div>
            </van-col>
          </van-row>
          <van-row class="controlBox" type="flex" justify="end">
            <van-button class="buttonRight" type="danger" size="small" @click="resetPass(item)">重置密码</van-button>
            <van-button class="buttonRight" type="info" size="small" @click="modifyData(item)">修改</van-button>
            <van-button type="info" size="small" @click="opendetail(item)">数据</van-button>
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
        <reportLink v-if="showModify" @saveProject="saveProject"></reportLink>

        <van-field
          :label-width="setlabelWidth"
          v-model="modify.StoreName"
          name="门店名称"
          label="门店名称"
          placeholder="请输入门店名称"
          :rules="[{ required: true, message: '请输入门店名称' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import { ResetPassword, ModifyAccount } from "@/api/account";
import reportLink from "@/components/reportLink/project";
export default {
  name: "accountList",
  props: {
    accountList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showModify: false,
      currReport: {},
      labelWidth: "90px",
      modify: {
        StoreName: ""
      }
    };
  },
  computed: {
    setlabelWidth() {
      let labelWidth = Number(this.labelWidth.replace(/[a-zA-Z]+/g, ""));
      let conversion = (labelWidth / 37.5).toFixed(1) + "rem";
      return conversion;
    }
  },
  watch: {
    showModify() {
      if (!this.showModify) {
        this.modify = Object.assign(
          {},
          this.$data.modify,
          this.$options.data().modify
        );

        this.$refs["postModify"].resetValidation();
      }
    }
  },
  components: { reportLink },
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
          id: item.Id,
          name: item.UserName
        }
      });
    },
    resetPass(item) {
      ResetPassword({ Id: item.Id })
        .then(res => {
          Toast("密码重置成功");
        })
        .catch(error => {
          console.log(error);
        });
    },
    modifyData(item) {
      this.showModify = true;
      this.currReport = JSON.parse(JSON.stringify(item));
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
    postModify() {
      this.currReport = Object.assign({}, this.currReport, this.modify);
      ModifyAccount(this.currReport).then(data => {
        this.showModify = false;
        this.$emit("onSearch");
      });
    },
    saveProject(data) {
      this.currReport.ResponsibleProjects = data.ResponsibleProjects;
      this.currReport.ResponsibleProjectsName = data.ResponsibleProjectsName;
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
              // padding: 5px 0;
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
          font-size: 14px;
          line-height: 20px;
          min-height: 20px;
          text-indent: 5px;
          // margin-top: 10px;
        }
        .phone {
          color: #ff0000;
        }
      }
      .buttonRight {
        margin-right: 10px;
      }
    }
  }
  .reprotSet {
    width: 80%;
    height: 80%;
  }
}
.auth-form {
  border-radius: 0;
  margin: 18px;
  padding-bottom: 0;
  .van-cell:last-child {
    padding: 0;
  }
  /deep/ .van-field__label {
    width: 50px;
  }
  /deep/ .van-cell {
    padding: 0;
    padding-bottom: 18px;
    .van-field__value .van-field__control {
      border: solid 1px #ccc;
      padding-left: 5px;
      margin-right: 5px;
    }
  }
}
</style>