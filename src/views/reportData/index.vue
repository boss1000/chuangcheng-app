<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      offset="10"
      @load="onLoad"
    >
      <div ref="search" class="searchForm" v-if="roles !== '3'">
        <van-cell-group :border="false">
          <van-field-select-picker
            v-if="isPhone"
            label="状态"
            placeholder="请选择"
            :border="false"
            v-model="satelabel"
            :columns="hanlersateList"
          />
          <van-field v-model="satelabel" v-else name="状态" label="状态" :border="false">
            <template #input>
              <el-select v-model="searchForm.Status" placeholder="请选择状态">
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
            v-model="searchForm.Q"
            :border="false"
            label="搜索关键词"
            placeholder="多个关键字之间用空格隔开"
          />
          <van-row>
            <van-col span="14">
              <van-field
                :value="searchForm.DateBegin"
                :border="false"
                label="报备日期"
                placeholder="开始"
                readonly
                @click-input="timeStart = true"
              />
              <van-calendar
                v-model="timeStart"
                title="开始"
                :round="false"
                :border="false"
                @confirm="onConfirmStart"
              />
            </van-col>
            <van-col span="2" class="spiltRow">-</van-col>
            <van-col span="8">
              <van-field
                :value="searchForm.DateEnd"
                :border="false"
                placeholder="截至"
                readonly
                @click-input="timeEnd = true"
              />
              <van-calendar
                v-model="timeEnd"
                title="截至"
                :round="false"
                :border="false"
                @confirm="onConfirmEnd"
              />
            </van-col>
          </van-row>
        </van-cell-group>

        <van-row class="controlBox" :border="false">
          <van-button class="buttonRight" type="info" size="small" @click="getReport()">查询</van-button>
        </van-row>
      </div>

      <showLoading :showLoading="showLoading"></showLoading>
      <locationView
        class="van-clearfix dataList"
        :locationList="locationList"
        :sateList="sateList"
        @ChangeStatus="ChangeStatus"
      ></locationView>
    </van-list>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { Toast } from "vant";
import { formatDate } from "@/utils/common.js";
import { GetReportList, GetReportListByUserId } from "@/api/report";
import showLoading from "@/components/showLoading";
import VanFieldSelectPicker from "@/components/VanFieldSelectPicker";
import locationView from "./components/locationView";
export default {
  name: "location",
  components: {
    VanFieldSelectPicker,
    showLoading,
    locationView
  },
  data() {
    return {
      showLoading: false,
      satelabel: "全部",
      timeStart: false,
      timeEnd: false,
      finished: false,
      loading: false,
      minDate: new Date(2020, 0, 1),
      showList: false,
      searchForm: {
        Status: null,
        Q: "",
        DateBegin: "",
        DateEnd: "",
        PageIndex: 1,
        PageSize: 10
      },
      sateList: [
        {
          value: null,
          label: "全部"
        },
        {
          value: 1,
          label: "界定中"
        },
        {
          value: 2,
          label: "有效推荐"
        },
        {
          value: 3,
          label: "无效推荐"
        },
        {
          value: 4,
          label: "有效带看"
        },
        {
          value: 5,
          label: "有效到访"
        },
        {
          value: 6,
          label: "认筹"
        },
        {
          value: 7,
          label: "认购"
        },
        {
          value: 8,
          label: "成交"
        }
      ],
      locationList: []
    };
  },
  computed: {
    ...mapGetters(["roles", "isPhone"]),
    maxDate() {
      let date = formatDate(Date.now(), "yyyy-MM-dd")
        .split("-")
        .map(item => Number(item));
      return new Date(date[0], date[1] - 1, date[2]);
    },
    hanlersateList() {
      let label = [];
      label = this.sateList.map(item => {
        return item.label;
      });
      return label;
    },
    getListheight() {
      let listheight = window.screen.height - 50;
      let setheght = (listheight / 37.5).toFixed(1) + "rem";
      return setheght;
    }
  },
  watch: {
    satelabel() {
      // item.updateTime = this.$tool.formatTime(item.updateTime, "yyyy-MM-dd");
      this.searchForm.Status = this.sateList.find(
        item => item.label == this.satelabel
      ).value;
    }
  },
  mounted() {
    this.getReport();
    this.showList = true;
  },
  methods: {
    onConfirmStart(value) {
      this.searchForm.DateBegin = formatDate(value, "yyyy-MM-dd");
      this.timeStart = false;
    },
    onConfirmEnd(value) {
      this.searchForm.DateEnd = formatDate(value, "yyyy-MM-dd");
      this.timeEnd = false;
    },
    onLoad() {
      if (!this.finished && this.locationList.length > 0) {
        this.loading = true;
        this.searchForm.PageIndex += 1;
        this.getReport(true);
      }
    },
    getReport(isPage) {
      if (!isPage) {
        // 判断是否为翻页
        this.locationList = [];
        this.searchForm.PageIndex = 1;
      }
      this.showLoading = true;
      GetReportList(this.searchForm).then(res => {
        this.locationList = this.locationList.concat(res.Result);
        this.showLoading = false;
        this.loading = false;
        if (res.Result.length < this.searchForm.PageSize) {
          this.finished = true;
        }
      });
    },
    ChangeStatus(data) {
      let { ReportId, Status } = data;
      this.locationList.map(item => {
        if (item.Id == ReportId) {
          item.StatusName = Status;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.searchForm {
  padding: 18px 15px;
  .spiltRow {
    text-align: center;
    line-height: 28px;
  }
}
.dataList {
  padding: 0 15px;
  overflow: hidden;
}
</style>