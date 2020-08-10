<template>
  <!-- <input type="file" hidden ref="file" @change="onFileChange" /> -->
  <van-uploader
    ref="file"
    :before-read="beforeRead"
    :after-read="onRead"
    accept="image/*"
    class="avatarSet"
  >
    <van-image v-if="reloadImage" @load="loadingImage" class="avatar" round :src="imageUrl">
      <template v-slot:loading>
        <van-loading class="avatar loading" size="36px"></van-loading>
      </template>
    </van-image>
    <van-loading v-else class="avatar loading" size="36px"></van-loading>
  </van-uploader>
</template>
<script>
import { Toast } from 'vant'
import { UpLoadHeadImg } from '@/api/home'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      width: 700,
      height: 700,
      reloadImage: true
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    imageUrl() {
      return `http://ccapi.chuanchengfc.com/api/Filse/GetPortrait?UserID=${this.loginData.UserId}`
    }
  },
  mounted() {},
  methods: {
    async onRead(file) {
      const formData = await this.compressImg(file.file)
      UpLoadHeadImg(formData).then(res => {
        this.reloadImage = true
        Toast('图片上传成功')
      })
    },
    onFileChange() {
      // 1.拿到file类型input选择的文件对象
      const fileObj = this.file.files[0]
      // 2.使用window.URL.createObjectURL(file)得到文件数据
      const fileData = window.URL.createObjectURL(fileObj)
      const fileFormat = fileObj.type.substring(fileObj.type.lastIndexOf('/') + 1).toLowerCase()
      if (!fileFormat.match(/png|jpg|jpeg/)) {
        Toast('请选择图片!')
        return
      }
      console.log(fileFormat)
      // 3.将img.src = 第2步的结果
      this.images = [fileData]
      this.isPreviewShow = true
    },
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为file文件
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], { type: mime })
    },
    beforeRead(file) {
      // 上传之前检测图片类似返回true和false会影响到onRead函数
      const regex = /(.jpg|.jpeg|.png|.bmp)$/
      if (!regex.test(file.type)) {
        Toast('图片格式不支持上传')
        return false
      } else {
        this.reloadImage = false
        return true
      }
    },
    compressImg(file) {
      var files
      var fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2)
      var read = new FileReader()
      const that = this
      read.readAsDataURL(file)

      Toast('图片上传中')
      return new Promise(function(resolve, reject) {
        read.onload = function(e) {
          var img = new Image()
          img.src = e.target.result
          img.onload = function() {
            // 默认按比例压缩
            const w = this.width
            const h = this.height
            // 生成canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            let base64
            // 创建属性节点
            canvas.setAttribute('width', w)
            canvas.setAttribute('height', h)
            ctx.drawImage(this, 0, 0, w, h)
            if (fileSize < 1) {
              // 如果图片小于一兆 那么不执行压缩操作
              base64 = canvas.toDataURL(file['type'], 1)
            } else if (fileSize > 1 && fileSize < 2) {
              // 如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file['type'], 0.5)
            } else {
              // 如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file['type'], 0.2)
            }
            // 回调函数返回file的值（将base64编码转成file）
            files = that.dataURLtoFile(base64, file.name) // 如果后台接收类型为base64的话这一步可以省略
            const formData = new FormData()
            formData.append('upload', 1)
            formData.append('upfile', files, Date.now() + '.jpg')

            resolve(formData)
          }
        }
      })
    },
    loadingImage() {}
  }
}
</script>
<style lang="scss" scoped>
/deep/.van-uploader__upload {
  border-radius: 90px;
}
.avatarSet {
  width: 92px;
  height: 92px;
  .avatar {
    background: white;
    border: 4px solid hsla(0, 0%, 100%, 0.5);
    background-clip: padding-box;
    border-radius: 90px;
    width: 90px;
    height: 90px;
  }
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
