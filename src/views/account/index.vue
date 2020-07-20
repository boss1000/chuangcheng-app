<template>
  <div class="mainContent">
    <div class="searchForm">
      <van-cell-group :border="false">
        <van-field v-model="searchData.UserName" :border="false" label="姓名" placeholder="请输入姓名" />
        <van-field v-model="searchData.Mobile" :border="false" label="手机号" placeholder="请输入手机号" />
        <van-field v-model="searchData.Store" :border="false" label="门店" placeholder="请输入门店" />
        <van-field-select-picker
          v-if="isPhone"
          label="账号类型"
          placeholder="请选择"
          v-model="AccountTypelabel"
          :columns="handeraccountList"
        />
        <van-field v-model="satelabel" v-else name="账号类型" label="账号类型" :border="false">
          <template #input>
            <el-select v-model="searchData.AccountType" placeholder="请选择账号类型">
              <el-option
                v-for="item in AccountTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>
      </van-cell-group>

      <van-row class="controlBox">
        <van-button class="searchBoxbutton" size="small" hairline type="info" @click="onSearch">查询</van-button>
        <van-button
          v-if="roles == '1'"
          class="searchBoxbutton"
          size="small"
          hairline
          type="info"
          @click="accountAdd"
        >新增</van-button>
      </van-row>
    </div>

    <showLoading :showLoading="showLoading"></showLoading>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <accountView :accountList="accountList" @onSearch="onSearch"></accountView>
    </van-list>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import accountView from "./components/accountView";
import showLoading from "@/components/showLoading";
import { GetAccountList } from "@/api/account";
import VanFieldSelectPicker from "@/components/VanFieldSelectPicker";
export default {
  components: { accountView, showLoading, VanFieldSelectPicker },
  data() {
    return {
      showLoading: false,
      searchData: {
        UserName: "",
        Mobile: "",
        Store: "",
        AccountType: null
      },
      loading: false,
      finished: false,
      AccountTypelabel: "全部",
      AccountTypeList: [
        {
          label: "全部",
          value: null
        },
        {
          label: "公司账户",
          value: 1
        },
        // {
        //   label: "项目驻场",
        //   value: 2
        // },
        {
          label: "中介",
          value: 3
        }
      ],
      accountList: []
    };
  },
  computed: {
    ...mapGetters(["roles", "isPhone"]),
    handeraccountList() {
      let label = [];
      label = this.AccountTypeList.map(item => {
        return item.label;
      });
      return label;
    }
  },
  watch: {
    AccountTypelabel() {
      this.searchData.AccountType = this.AccountTypeList.find(
        item => item.label == this.AccountTypelabel
      ).value;
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    onSearch() {
      this.showLoading = true;
      GetAccountList(this.searchData).then(res => {
        this.showLoading = false;
        this.accountList = res.Result;
      });
    },
    onLoad() {
      // this.buildList = this.buildList.concat([
      //   {
      //     name: "新鹿城2121",
      //     size: "102-140",
      //     address: "路程区牛山北路（百里亭公交站）",
      //     price: "240",
      //     image: "https://img.yzcdn.cn/vant/apple-1.jpg"
      //   }
      // ]);
      // 加载状态结束
      this.loading = false;
      this.finished = true;
      // 数据全部加载完成
      // if (this.buildList.length == 4) {
      //   this.finished = true;
      // }
    },
    accountAdd() {
      this.$router.push({
        name: "accountAdd",
        params: {}
      });
    },
    changeDropdown() {}
  }
};
</script>
<style lang="less" scoped>
.searchBoxbutton {
  min-width: 32px;
  margin-right: 5px;
}
.searchBoxbutton:last-child {
  margin-right: 0px;
}
.searchForm {
  padding: 18px 0;
  .spiltRow {
    text-align: center;
    line-height: 28px;
  }
}
</style>