<template>
  <div>
    <van-button type="info" :icon="icon" class="shareInfo" @click="openShare" />
    <div v-show="showShare" class="popupSet" @touchmove.prevent>
      <div class="popupBackground" id="imageWrapper" ref="imageWrapper">
        <img :src="backgroundImg" @load="imgback = true" style="width: 100%;height: 100%;" />
        <img class="image" :src="ImgUrl" @load="imgload = true" />
        <div class="projectName">{{ProjectName}}</div>
        <div class="phoneAndName Name">{{shareInfo.PrincipalerName}}</div>
        <div class="phoneAndName Phone">{{shareInfo.PrincipalerMobile}}</div>
        <div ref="qrCodeDiv" id="qrCode" class="qrCode" style="width: 80px;height: 80px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadPhysical } from "@/api/project";
import { isIos } from "@/utils/common";
// import html2canvas from "html2canvas";
import html2canvas from "@/utils/html2canvas";
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      showShare: true,
      imgback: false,
      imgload: false,
      backgroundImg: require("@/assets/images/share.jpg"),
      icon: require("@/assets/images/shareButton.png"),
      Id: "",
      ProjectName: "",
      ImgUrl: "",
      imgData: "",
      sys: ""
    };
  },
  props: {
    showShareImg: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imgloadOver() {
      return this.imgback && this.imgload;
    },
    shareInfo() {
      let { PrincipalerName, PrincipalerMobile, ...other } = this.$route.params;
      return {
        PrincipalerName: PrincipalerName,
        PrincipalerMobile: PrincipalerMobile
      };
    }
  },
  watch: {
    imgloadOver() {
      if (this.imgloadOver) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.createPicture(); // 二维码生成后，执行生成图片
      }
    }
  },
  mounted() {
    let { Id, ProjectName, ImgUrl } = this.$route.params;
    this.Id = Id;
    this.ProjectName = ProjectName;
    this.ImgUrl = ImgUrl;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.bindQRCode();
  },
  methods: {
    getContainer() {
      return document.querySelector(".commonBase");
    },
    bindQRCode() {
      let herfText = `${window.location.origin}/#/share/project/${this.Id}`;
      let canvas = new QRCode(this.$refs.qrCodeDiv, {
        text: herfText,
        width: 80,
        height: 80,
        colorDark: "#333333", // 二维码颜色
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
      });
    },
    // 从 canvas 提取图片 image
    createPicture(canvas, herfText) {
      var canvas2 = document.createElement("canvas");
      // DOM节点主体
      let main = document.querySelector("#imageWrapper");
      //防止保存的图片模糊
      let w = parseInt(window.getComputedStyle(main).width);
      let h = parseInt(window.getComputedStyle(main).height);
      canvas2.width = w * 1.5;
      canvas2.height = h * 1.5;
      canvas2.style.width = w + "px";
      canvas2.style.height = h + "px";
      var context = canvas2.getContext("2d");
      const devicePixelRatio = window.devicePixelRatio;
      let scale = 1.5 / devicePixelRatio;
      context.scale(scale, scale);
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop; // 获取滚动轴滚动的长度
      //useCORS允许网络地址图片跨域
      window
        .html2canvas(this.$refs.imageWrapper, {
          canvas: canvas2,
          useCORS: true
          // width: w, //设置canvas尺寸与所截图尺寸相同，防止白边
          // height: h
        })
        .then(canvas => {
          this.showShare = false;
          let base64ImgSrc = canvas.toDataURL("image/png");
          this.$emit("update:imgshareUrl", base64ImgSrc);
          let file = this.base64ToFile(base64ImgSrc, "QRCode");
        });
    },
    phone() {
      if (navigator.userAgent.match("Android")) {
        this.sys = "Android";
      } else if (navigator.userAgent.match("iPhone")) {
        this.sys = "iPhone";
      } else if (navigator.userAgent.match("iPad")) {
        this.sys = "iPad";
      } else {
        alert(navigator.userAgent);
      }
    },
    openShare() {
      this.$emit("update:showShareImg", true);
      // this.showShareImg = true;
    },
    base64ToFile(dataUrl, fileName) {
      let arr = dataUrl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      let filename = "temp_img";
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let file = new File([u8arr], `${filename}.${suffix}`, { type: mime });
      let formdata = new FormData();
      formdata.append("files", file);
      UploadPhysical(formdata)
        .then(res => {
          let url =
            "http://ccreportfiles.chuanchengfc.com" +
            res.Result.fileNames[0].replace(/\\/g, "/");
          this.$emit("update:imgshareUrl", url);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.shareInfo {
  position: fixed;
  right: 10px;
  top: 80px;
  opacity: 0.8;
  padding: 0;
  height: 38px;
  width: 38px;
  /deep/ .van-button__icon {
    width: 100%;
    height: 100%;
    .van-icon__image {
      padding: 5px;
      width: 100%;
      height: 100%;
    }
  }
}
.popupSet {
  position: absolute;
  z-index: 100;
  top: 100%;
  left: 50%;
  // margin-top: -250px;
  margin-left: -150px;
  opacity: 0;
  z-index: 0;
  transform: translateZ(0px);
}

.popupBackground {
  position: relative;
  width: 300px;
  height: 500px;
  // background-image: url("../../assets/images/share.jpg");
  // background-size: 100% 100%;
  .image {
    position: absolute;
    width: 242px;
    height: 180px;
    top: 150px;
    left: 29px;
  }
  .projectName {
    position: absolute;
    width: 241.5px;
    height: 25.5px;
    line-height: 23.5px;
    top: 330px;
    left: 29.5px;
    font-family: pingFang;
    color: #fff;
    text-align: center;
    font-size: 18px;
  }
  .qrCode {
    position: absolute;
    right: 20px;
    bottom: 30px;
    img {
      padding: 4px;
      background: #fff;
    }
  }
  .phoneAndName {
    position: absolute;
    top: 400px;
    font-family: pingfangg;
    color: #fff;
    &.Name {
      left: 35px;
      font-size: 15px;
    }
    &.Phone {
      margin-top: 2px;
      left: 95px;
      font-size: 13px;
    }
  }
}
</style>
<style lang="scss">
.qrCode {
  img {
    padding: 4px;
    background: #fff;
  }
}
</style>
