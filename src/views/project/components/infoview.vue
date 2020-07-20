<template>
  <div class="infoPreview">
    <div
      v-for="(item,index) in infoList"
      :key="index"
      :class="['infoBox', (index + 1 !== infoList.length ) ? 'van-hairline--bottom' : '']"
    >
      <div class="imageSize">
        <van-image class="imageSize" fit="contain" lazy-load :src="item.ImgUrl" />
      </div>
      <div class="buildContent">
        <div class="collectionBtn" @click="followStart(item)">
          <svg-icon :icon-class="item.IsFollow == true ? 'collection' : 'nocollection'" />
        </div>
        <div class="contentBox">
          <van-row>
            <van-col class="title" span="12">{{item.ProjectName}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">报备数</van-col>
            <van-col class="content" span="16">{{item.ReportCount}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">负责人</van-col>
            <van-col class="content" span="16">
              {{item.PrincipalerName}} -
              <span
                class="phone"
                @click="openphone(item.PrincipalerMobile)"
              >{{item.PrincipalerMobile}}</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">折扣</van-col>
            <van-col class="content" span="16">{{item.Discount}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">开发商</van-col>
            <van-col class="content" span="16">{{item.Developer}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">开盘时间</van-col>
            <van-col class="content" span="16">{{item.OpeningTime}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">佣金</van-col>
            <van-col class="content" span="16">{{item.Commission}}</van-col>
          </van-row>
          <van-row>
            <van-col class="name" span="8">特别说明</van-col>
            <van-col class="content notice" span="16">{{item.Remark}}</van-col>
          </van-row>
          <van-row>
            <van-button class="buttonRight" type="info" size="small" @click="openReport(item)">报备</van-button>
            <van-button
              v-if="roles == '2'  && item.IsOwnProjec"
              class="buttonRight"
              type="info"
              size="small"
              @click="openReportList(item)"
            >数据</van-button>
            <van-button
              :class="{buttonRight: roles == '2'}"
              type="info"
              size="small"
              @click="opendetail(item)"
            >详情</van-button>
            <van-button
              v-if="roles == '2' && item.IsOwnProjec"
              type="info"
              size="small"
              @click="changeData(item)"
            >修改</van-button>
          </van-row>
        </div>
      </div>
    </div>

    <van-dialog
      v-model="reportShow"
      title="联动规则"
      confirmButtonText="同意"
      @confirm="agreeReportShow"
      show-cancel-button
    >
      <linkageRules></linkageRules>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import { mapState, mapGetters, mapActions } from "vuex";
import linkageRules from "@/components/linkageRules";
import { FollowProject, EditProject } from "@/api/project";
export default {
  name: "infoview",
  props: {
    infoList: {
      type: Array,
      default: []
    }
  },
  components: {
    linkageRules
  },
  data() {
    return {
      reportShow: false,
      currReport: {}
    };
  },
  computed: {
    ...mapGetters(["roles", "ruleData", "isPhone"])
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
    openReport(item) {
      this.$store.dispatch("user/saveRules", item.LinkAgeRules);
      this.currReport = item;
      this.$nextTick(() => {
        this.reportShow = true;
      });
    },
    opendetail(item) {
      let {
        Id,
        ProjectName,
        PrincipalerName,
        PrincipalerMobile,
        ImgUrl
      } = item;
      this.$store.dispatch("user/saveRules", item.LinkAgeRules);
      this.$router.push({
        name: "projectdetail",
        params: {
          Id: Id,
          ProjectName,
          PrincipalerName,
          PrincipalerMobile,
          ImgUrl
        }
      });
    },
    agreeReportShow() {
      let {
        Id,
        ProjectName,
        PrincipalerName,
        PrincipalerMobile,
        IsEnableIdCard
      } = this.currReport;
      this.$router.push({
        name: "report",
        params: {
          Id,
          ProjectName,
          PrincipalerName,
          PrincipalerMobile,
          IsEnableIdCard
        }
      });
    },
    changeData(item) {
      if (this.isPhone) {
        Toast({
          message: "请使用电脑端操作该功能"
        });
      } else {
        this.$emit("openChange", {
          projectId: item.Id
        });
      }
    },
    followStart(item) {
      // 1 为关注 2 取消关系
      FollowProject({ ProjectId: item.Id, Type: item.IsFollow ? "2" : "1" })
        .then(res => {
          if (item.IsFollow) {
            Toast({
              message: "已取消关注"
            });
          } else {
            Toast({
              message: "已关注"
            });
          }

          item.IsFollow = !item.IsFollow;
        })
        .catch(error => {
          console.log(error);
        });
    },
    openReportList(item) {
      this.$router.push({
        name: "reportList",
        params: {
          ProjectId: item.Id,
          name: item.UserName
        }
      });
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
    // border-bottom: solid 1px #ccc;
    .imageSize {
      width: 90px;
      height: 90px;
    }
    .buildContent {
      position: relative;
      flex-grow: 1;
      .contentBox {
        display: flex;
        flex-direction: column;
        margin-left: 15px;
        font-size: 14px;
        /deep/.van-row {
          margin-bottom: 10px;
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          width: 80%;
        }
        .name {
          color: #908585;
        }
        .content {
          // margin-top: 10px;
        }
        .notice {
          white-space: break-spaces;
        }
        .phone {
          color: #ff0000;
        }
        .buttonRight {
          margin-right: 2px;
        }
      }
      .collectionBtn {
        position: absolute;
        width: 30px;
        height: 30px;
        right: 0;
        /deep/ .svg-icon {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .reprotSet {
    width: 80%;
    height: 80%;
  }
}
</style>