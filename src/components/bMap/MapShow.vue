<template>
  <div :class="['dituContent',{'bigMap':!isSalce}]">
    <div class="mapZindex mapBox" v-if="isSalce" @click="openBig"></div>
    <div class="mapBox" :id="getId"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      iconUrl: require("@/assets/images/mk_icon.png")
    };
  },
  computed: {
    getId() {
      return `dituContent${this.isSalce ? "small" : "big"}`;
    }
  },
  props: {
    isSalce: {
      type: Boolean,
      default: true
    },
    detailForm: {
      type: Object,
      default: () => {}
    },
    showbigMap: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    detailForm: {
      handler() {
        this.initMap();
      },
      deep: true
    },
    showbigMap: {
      handler() {
        if (this.showbigMap) {
          this.$nextTick(() => {
            this.initMap();
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.initMap();
  },
  methods: {
    //这几个地方加this
    initMap() {
      this.createMap(); //创建地图
      this.setMapEvent(); //设置地图事件
      if (!this.isSalce) {
        this.addMapControl(); //向地图添加控件
      }
      this.addMarker(); //向地图中添加marker
    },
    createMap() {
      this.map = new BMap.Map(this.getId); //在百度地图容器中创建一个地图
      // var point = new BMap.Point(120.328033, 31.686802); //定义一个中心点坐标
      // map.centerAndZoom(point, 18); //设定地图的中心点和坐标并将地图显示在地图容器中
    },
    setMapEvent() {
      if (this.isSalce) {
        this.map.disableDoubleClickZoom();
        this.map.disablePinchToZoom();
        this.map.disableDragging(); //禁止拖拽
        this.map.disableScrollWheelZoom(); //禁止缩放
      } else {
        this.map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
        this.map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
        this.map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
        this.map.enableKeyboard(); //启用键盘上下左右键移动地图
      }
    },
    addMapControl() {
      //向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
      });
      this.map.addControl(ctrl_nav);
      //向地图中添加缩略图控件
      var ctrl_ove = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: 1
      });
      this.map.addControl(ctrl_ove);
      //向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
      this.map.addControl(ctrl_sca);
    },
    //创建marker
    addMarker() {
      let pointSet = this.detailForm.GPS.split(",");
      const markerArr = [
        {
          title: "",
          content: "",
          point: [parseFloat(pointSet[0]), parseFloat(pointSet[1])],
          isOpen: 1
        }
      ];
      for (var i = 0; i < markerArr.length; i++) {
        let point = new BMap.Point(
          markerArr[i].point[0],
          markerArr[i].point[1]
        );
        var myIcon = new BMap.Icon(this.iconUrl, new BMap.Size(30, 30));
        let marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        this.map.centerAndZoom(point, 15);

        let opts = {
          width: 250, // 信息窗口宽度
          height: 80, // 信息窗口高度
          title: "", // 信息窗口标题
          message: "",
          enableCloseOnClick: false
        };
        var infoWindow = new BMap.InfoWindow(this.detailForm.Address, opts); // 创建信息窗口对象
        marker.addEventListener("click", function() {
          this.map.openInfoWindow(infoWindow, point); //开启信息窗口
        });
        if (markerArr[i].isOpen == 1) {
          setTimeout(() => {
            this.map.openInfoWindow(infoWindow, point); //开启信息窗口
          }, 300);
        }
      }
    },
    openBig() {
      this.$emit("openBigMap");
    }
  }
};
</script>
<style lang="less" scoped>
.dituContent {
  width: 100%;
  height: 150px;
  overflow: hidden;
  margin: 0px auto;
  font-family: "微软雅黑";
  position: relative;
  .mapBox {
    height: 100%;
    width: 100%;
  }
  .mapZindex {
    position: absolute;
    opacity: 0;
    z-index: 1;
  }
  &.bigMap {
    height: 100%;
  }
}
</style>
<style lang="scss">
.anchorBL {
  display: none;
}
.BMap_bubble_content {
  margin-top: 20px;
}
.infowindow {
  // z-index: 101;
}
.BMap_Marker {
  img {
    height: 100%;
    width: 100%;
    z-index: 801;
  }
}
</style>
