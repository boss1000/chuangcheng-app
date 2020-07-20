<template>
  <div id="report" class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" title="账号新增" />
    <van-form class="auth-form columnSpace" @submit="postForm">
      <div>
        <van-field
          v-model="fromData.Mobile"
          name="账号"
          label="账号"
          :border="false"
          :placeholder="validator.phoneMessage"
          :rules="[{validator: phoneValidator, message: validator.phoneMessage }]"
        />
        <van-field
          v-model="fromData.UserName"
          name="姓名"
          label="姓名"
          :border="false"
          :placeholder="validator.phoneMessage"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          v-model="fromData.IdCard"
          name="身份证号码"
          label="身份证号码"
          :border="false"
          :placeholder="validator.cardMessage"
          :rules="[{ validator: cardValidator, message: validator.cardMessage }]"
        />
        <van-field
          v-model="fromData.StoreName"
          name="门店"
          label="门店"
          placeholder="请输入门店"
          :border="false"
          :rules="[{ required: true, message: '请输入门店' }]"
        />
        <van-field v-model="fromData.Company" name="体系" label="体系" placeholder="请输入所属体系" disabled />

        <reportLink @saveProject="saveProject"></reportLink>
      </div>
      <van-button type="info" block native-type="submit">确认新增</van-button>
    </van-form>
  </div>
</template>

<script type="text/javascript">
import { Dialog, Toast } from "vant";
import { validPhone, IdCardValidate } from "@/utils/validate";
import { mapState, mapGetters, mapActions } from "vuex";
import { AddAccount } from "@/api/account";
import reportLink from "@/components/reportLink/project";
export default {
  name: "report",
  components: { reportLink },
  data() {
    return {
      showDate: false,
      showPicker: false,
      reportShow: false,
      fromData: {
        Mobile: "", // 账号
        UserName: "", // 姓名
        IdCard: "", // 身份证号码
        StoreName: "", // 门店
        Company: "", // 体系
        typeEnum: 3, // 账号类型
        projectIds: []
      },
      validator: {
        phoneMessage: "请输入手机号码",
        cardMessage: "请输入身份证号"
      }
    };
  },
  computed: {
    ...mapGetters(["otherData"])
  },
  mounted() {
    this.fromData.Company = this.otherData.name;
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
    phoneValidator(value, rule) {
      if (value.length > 0) {
        let isTest = validPhone(value);
        this.validator.phoneMessage = !isTest ? `手机号码错误，请检查` : "";
        return isTest;
      } else {
        this.validator.phoneMessage = `请输入手机号码`;
        return false;
      }
    },
    cardValidator(value, rule) {
      if (value.length > 0) {
        let isTest = IdCardValidate(value);
        this.validator.cardMessage = !isTest ? "请检查身份证号码" : "";
        return isTest;
      } else {
        this.validator.cardMessage = "请输入身份证号码";
        return false;
      }
    },
    postForm() {
      AddAccount(this.fromData).then(res => {
        Toast("新增成功");
        setTimeout(() => {
          this.$router.back();
        }, 1500);

        // onClickLeft()
      });
    },
    onClickLeft() {
      this.$router.go(-1); //返回上一层
    },
    saveProject(data) {
      this.fromData.projectIds = data.ResponsibleProjects;
    }
  }
};
</script>
<style lang="less" scoped>
#report {
  .datetime {
    &.van-row {
      padding-bottom: 0px;
    }
    /deep/ .van-cell {
      padding-bottom: 18px;
      &.van-field--error {
        // padding-bottom: 0px;
      }
    }
    /deep/ .van-col:first-child .van-field__control {
      border-right: none;
    }
  }

  .redcol {
    color: #ff0000;
  }
  .dateChange {
    width: 80%;
    height: 400px;
  }
}
</style>
