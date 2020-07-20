<template>
  <van-overlay :show="showLoading">
    <div class="loadingWrapper" @click.stop>
      <van-loading size="34px">数据加载中...</van-loading>
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: "showLoading",
  props: {
    showLoading: {
      type: Boolean,
      required: false
    }
  }
};
</script>

<style scoped>
</style>