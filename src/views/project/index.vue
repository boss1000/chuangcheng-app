<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      offset="0"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <form ref="search" action="javascript:return true">
        <van-search v-model="searchData.ProjectName" placeholder="请输入搜索关键词" @blur="getDataList()"></van-search>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="searchData.Area"
          :options="areaList"
          title="地区"
          @change="getDataList()"
        />
        <van-dropdown-item
          v-model="searchData.orderType"
          :options="option2"
          title="排序"
          @change="getDataList()"
        />
      </van-dropdown-menu>
      <infoview ref="infoview" class="dataList" :infoList="infoList" @openChange="openChange"></infoview>
    </van-list>
    <cahangeData
      :projectId="projectId"
      :areaList="areaList"
      :dialogFormVisible.sync="dialogFormVisible"
      @getDataList="getDataList"
    ></cahangeData>
  </div>
</template>
<script>
import infoview from "./components/infoview";
import cahangeData from "./components/cahangeData";
import {
  getProjectList,
  GetAreaList,
  getEditProject,
  GetDetail,
  GetLinkAgeRules
} from "@/api/project";
import { getLocalStore, removeLocalStore } from "@/config/global.js";
export default {
  components: { infoview, cahangeData },
  data() {
    return {
      searchData: {
        ProjectName: "",
        Area: "",
        orderType: 1,
        PageIndex: 1,
        PageSize: 10
      },
      loading: false,
      finished: false,
      areaList: [],
      areagroupList: [],
      option2: [
        {
          text: "默认",
          value: 1
        },
        {
          text: "日期排序",
          value: 2
        },
        {
          text: "热度",
          value: 3
        }
      ],
      showList: false,
      infoList: [],
      projectId: 0,
      dialogFormVisible: false
    };
  },
  computed: {
    getListheight() {
      let listheight = window.screen.height + 20;
      let setheght = (listheight / 37.5).toFixed(1) + "rem";
      return setheght;
    }
  },
  created() {
    let redirectedId = getLocalStore("saveRedirected");
    // 判断是否为外部地址跳转
    // http://localhost:8080/#/share/project/31
    if (redirectedId) {
      this.redirected(redirectedId);
    }
  },
  mounted() {
    this.getDataList();
    this.getAreaList();
    this.showList = true;
  },
  methods: {
    onLoad() {
      if (!this.finished) {
        this.loading = true;
        this.searchData.PageIndex += 1;
        this.$nextTick(() => {
          this.getDataList(true);
        });
      }
    },
    getAreaList() {
      GetAreaList().then(data => {
        this.areaList = data.Result;
        this.areagroupList = [
          {
            value: null,
            text: "全部"
          }
        ].concat(data.Result);
      });
    },
    getDataList(isPage) {
      if (!isPage) {
        // 判断是否为翻页
        this.infoList = [];
        this.searchData.PageIndex = 1;
      }
      this.$nextTick(() => {
        getProjectList(this.searchData)
          .then(data => {
            this.infoList = this.infoList.concat(data.Result);
            this.loading = false;
            if (data.Result.length < this.searchData.PageSize) {
              this.finished = true;
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    openChange(data) {
      this.projectId = data.projectId;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    redirected(Id) {
      this.isRedirected = true;
      GetDetail({ ProjectID: Number(Id) })
        .then(data => {
          let currData = data.Result;
          this.$refs.infoview.opendetail(currData);
          removeLocalStore("saveRedirected");
        })
        .catch(error => {
          removeLocalStore("saveRedirected");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.dataList {
  margin: 0px;
  padding: 0 15px;
}
</style>