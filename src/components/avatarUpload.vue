<template>
  <div class="avatarSet" @click="onAvatarClick">
    <van-image class="avatar" round :src="imageUrl" />
    <input type="file" hidden ref="file" @change="onFileChange" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: require('../assets/test.png')
    }
  },
  computed: {
    file() {
      return this.$refs['file']
    }
  },
  methods: {
    onAvatarClick() {
      this.file.click()
    },
    onFileChange() {
      // 1.拿到file类型input选择的文件对象
      const fileObj = this.file.files[0]
      // 2.使用window.URL.createObjectURL(file)得到文件数据
      const fileData = window.URL.createObjectURL(fileObj)
      // 3.将img.src = 第2步的结果
      this.images = [fileData]
      this.isPreviewShow = true
    },
    onUpdateAvatar() {
      // 1.构造包含文件数据的表单对象
      // 注意：含有文件的服务务必要放到FormData中
      // 用代码来构造一个表单对象，主要目的是用来异步发送文件上传
      // 参数一：键
      // 参数二：值
      const fd = new FormData()
      fd.append('photo', this.file.files[0])
      this.$toast.loading({
        duration: 1000,
        message: '保存中',
        forbidClick: true
      })
      this.isPreviewShow = false
      // this.$toast.success('保存成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.avatarSet {
  .avatar {
    background: white;
    border: 4px solid hsla(0, 0%, 100%, 0.5);
    background-clip: padding-box;
    border-radius: 90px;
    width: 90px;
    height: 90px;
  }
}
</style>
