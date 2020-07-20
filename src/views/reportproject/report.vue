<template>
  <div id="report" class="commonBase">
    <van-nav-bar left-arrow class="commonTitle" @click-left="onClickLeft" title="一手项目报备" />
    <van-form class="auth-form" @submit="postForm">
      <van-row>
        <van-col span="24">
          提交报备代表您已经阅读并同意
          <span class="redcol" @click="openReport">《联动规则》</span>
        </van-col>
      </van-row>
      <reportLink
        labelTitle="报备项目"
        :defaultIndex="fromData.ProjectIds"
        :defaultName="fromData.ProjectName"
        @saveProject="saveProject"
      ></reportLink>
      <van-field v-model="fromData.CustomerName" name="负责人" label="负责人" :border="false">
        <template #input>
          {{fromData.PrincipalerName}} -
          <span
            class="redcol"
            @click="openphone(fromData.PrincipalerMobile)"
          >{{fromData.PrincipalerMobile}}</span>
        </template>
      </van-field>
      <van-field
        v-model="fromData.CustomerName"
        name="客户姓名"
        label="客户姓名"
        placeholder="请输入客户姓名"
        :border="false"
        :rules="[{ required: true, message: '请填写客户姓名' }]"
      />
      <van-field
        v-model="fromData.CustomerMobile"
        name="客户电话"
        label="客户电话"
        placeholder="请输入客户电话"
        :border="false"
        :rules="[{ required: true, validator: phoneValidator, message: validator.phoneMessage }]"
      />
      <van-field
        v-if="fromData.IsEnableIdCard || IsEnableIdCard"
        v-model="fromData.CustomerIdCard"
        name="身份证号码"
        label="身份证号码"
        placeholder="请输入身份证号码"
        :border="false"
        :rules="[{ validator: cardValidator, message: validator.cardMessage }]"
      />
      <van-row class="datetime">
        <van-col span="16">
          <van-field
            readonly
            name="datetimePicker"
            :value="preparietaldate"
            :rules="[{ required: true, message: '请选择预约来访日期' }]"
            label="预约来访日期"
            placeholder="请输入预约来访日期"
            :border="false"
            @click-input="showDate = true"
          />
          <van-calendar v-model="showDate" title="来访日期" @confirm="onConfirm" :round="false" />
        </van-col>
        <van-col span="8">
          <van-field
            readonly
            name="datetimePicker"
            :value="preparietaltime"
            placeholder="请输入时间"
            :border="false"
            @click-input="showPicker = true"
            :rules="[{ required: true, message: '请选择时间' }]"
          />
        </van-col>
      </van-row>
      <van-field v-model="fromData.CompanyName" disabled name="体系" label="体系" placeholder="请输入体系" />
      <van-field
        v-model="fromData.ReporterName"
        name="中介"
        label="中介"
        placeholder="请输入中介"
        :border="false"
        :rules="[{ required: true, message: '请输入中介' }]"
      />
      <van-field
        v-model="fromData.ReporterMobile"
        name="中介电话"
        label="中介电话"
        placeholder="中介电话"
        :border="false"
        :rules="[{ required: true, validator: phoneValidator, message: validator.phoneMessage }]"
      />
      <van-field
        v-model="fromData.StoreName"
        name="所在门店"
        label="所在门店"
        placeholder="请输入所在门店"
        :border="false"
        :rules="[{ required: true, message: '请输入所在门店' }]"
      />
      <van-field-select-picker
        v-if="isPhone"
        class="setBorder"
        label="推荐人"
        placeholder="请选择推荐人"
        v-model="AccountTypelabel"
        :columns="handeraccountList"
      />
      <van-field v-model="AccountTypelabel" v-else name="推荐人" label="推荐人" :border="false">
        <template #input>
          <el-select v-model="fromData.ReferrerId" placeholder="请选择推荐人">
            <el-option
              v-for="item in AccountTypeList"
              :key="item.Id"
              :label="item.UserName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </template>
      </van-field>
      <van-field
        v-model="fromData.Remark"
        name="备注"
        label="备注"
        placeholder="请输入备注"
        :border="false"
      />
      <van-button type="info" block native-type="submit">提交报备</van-button>

      <van-row style="padding-top: 25px;">
        <van-col span="24">
          提交报备代表您已经阅读并同意
          <span class="redcol" @click="openReport">《联动规则》</span>
        </van-col>
      </van-row>
    </van-form>
    <van-popup v-model="showPicker" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        type="time"
        :min-hour="8"
        :max-hour="20"
        @confirm="confirmDate"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-dialog v-model="reportShow" title="联动规则" confirmButtonText="同意" show-cancel-button>
      <linkageRules></linkageRules>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
import { Dialog, Toast } from "vant";
import { validPhone, IdCardValidate } from "../../utils/validate";
import { mapState, mapGetters, mapActions } from "vuex";
import { AddReport } from "@/api/report";
import { GetSpecialAccountList } from "@/api/account";
import linkageRules from "../../components/linkageRules";
import reportLink from "@/components/reportLink/project";
import VanFieldSelectPicker from "@/components/VanFieldSelectPicker";
export default {
  name: "report",
  components: {
    linkageRules,
    reportLink,
    VanFieldSelectPicker
  },
  data() {
    return {
      showDate: false,
      showPicker: false,
      reportShow: false,
      preparietaldate: "", // 预约来访日期
      preparietaltime: "", // 预约来访时间
      AccountTypelabel: "",
      AccountTypeList: [], // 推荐人列表
      IsEnableIdCard: false, // 判断是否显示身份证
      fromData: {
        ProjectIds: this.$route.params.Id ? [this.$route.params.Id] : [], // 项目Id
        ProjectName: this.$route.params.ProjectName || "", // 项目名称
        PrincipalerName: this.$route.params.PrincipalerName || "", // 项目负责人姓名
        PrincipalerMobile: this.$route.params.PrincipalerMobile || "", // 负责人电话
        IsEnableIdCard: this.$route.params.IsEnableIdCard,
        CustomerName: "", // 客户姓名
        CustomerMobile: "", // 客户电话
        CustomerIdCard: "", // 客户身份证号
        ArriveDateTime: "", // 预约来访时间
        CompanyId: "", // 体系ID
        CompanyName: "", // 体系
        ReporterName: "", // 中介姓名
        ReporterMobile: "", // 中介电话
        StoreName: "", // 所在门店
        Remark: "", //备注
        ReferrerId: "" // 推荐人id
      },
      validator: {
        phoneMessage: "请输入手机号码",
        cardMessage: "请输入身份证号"
      }
    };
  },
  computed: {
    ...mapGetters(["otherData", "roles", "isPhone"]),
    handeraccountList() {
      let label = [];
      label = this.AccountTypeList.map(item => {
        return item.UserName;
      });
      return label;
    }
  },
  mounted() {
    this.getAccountTypeList();
    console.log(this.otherData);
    this.fromData.CompanyId = this.otherData.company_Id;
    this.fromData.CompanyName = this.otherData.company_Name;
    if (this.roles == 3) {
      this.fromData.ReporterName = this.otherData.name;
      this.fromData.ReporterMobile = this.otherData.Mobile;
      this.fromData.StoreName = this.otherData.store_name;
    }
  },
  watch: {
    preparietaldate() {
      this.fromData.ArriveDateTime =
        this.preparietaldate + " " + this.preparietaltime;
    },
    preparietaltime() {
      this.fromData.ArriveDateTime =
        this.preparietaldate + " " + this.preparietaltime;
    },
    AccountTypelabel() {
      this.fromData.ReferrerId = this.AccountTypeList.find(
        item => item.UserName == this.AccountTypelabel
      ).Id;
    }
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
        if (!isTest) {
          this.validator.cardMessage = "请检查身份证号码";
        }
        return isTest;
      } else {
        this.validator.cardMessage = "请输入身份证号码";
        return false;
      }
    },
    onConfirm(date) {
      this.preparietaldate = this.formatter(date);
      this.showDate = false;
    },
    confirmDate(date) {
      this.preparietaltime = date;
      this.showPicker = false;
    },
    formatter(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      let timeValue = `${year}-${month}-${day}`;
      return timeValue;
    },
    postForm() {
      AddReport(this.fromData).then(res => {
        Toast("报备成功");
        this.onClickLeft();
      });
    },
    openReport(item) {
      this.reportShow = true;
    },
    onClickLeft() {
      this.$router.go(-1); //返回上一层
    },
    saveProject(data) {
      this.fromData.ProjectIds = [this.$route.params.Id];
      this.fromData.ProjectIds = [
        ...new Set(this.fromData.ProjectIds.concat(data.ResponsibleProjects))
      ].filter(item => item);
      this.IsEnableIdCard = data.IsEnableIdCard;
    },
    getAccountTypeList() {
      GetSpecialAccountList({
        UserName: "",
        Mobile: "",
        Store: "",
        Status: "",
        AccountType: "",
        IsReferrer: true
      }).then(res => {
        this.AccountTypeList = res.Result;
      });
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
        padding-bottom: 0px;
      }
    }
    /deep/ .van-col:first-child .van-field__control {
      border-right: none;
    }
  }
  .setBorder {
    /deep/.van-field__value {
      border: solid 1px #ccc;
      padding-left: 5px;
      .van-field__control {
        border: none;
      }
      .van-field__right-icon {
        margin-right: 5px;
      }
    }
  }
  .noboder {
    /deep/ .van-field__control {
      border: none;
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
