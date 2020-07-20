<template>
  <div class="buildPreview">
    <div v-for="(item,index) in buildList" :key="index" class="buildBox">
      <van-image
        @click="openDetail(item)"
        class="imageSize"
        fit="contain"
        lazy-load
        :src="item.image"
      />
      <div class="tagPostion" v-if="showTag">
        <van-tag
          class="tagMargin"
          v-for="(tagName,index) in item.tag"
          :key="tagName + index"
          color="#FFF"
          text-color="#000"
        >{{tagName}}</van-tag>
      </div>
      <div class="buildContent">
        <div class="contentBox">
          <span class="name">{{item.name}}</span>
          <span class="size">{{item.size}}㎡</span>
        </div>
        <div class="contentBox">
          <span class="address">{{item.address}}</span>
          <span class="price">{{item.price}}万起</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "buildPreview",
  props: {
    buildList: {
      type: Array,
      default: []
    },
    showTag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    openDetail(item) {
      // this.$router.push({
      //   name: "second",
      //   params: {
      //     id: "20180822",
      //     name: "query"
      //   }
      // });
    }
  }
};
</script>
<style lang="less" scoped>
.buildPreview {
  position: relative;
  .imageSize {
    width: 100%;
    height: 150px;
  }
  .tagPostion {
    position: absolute;
    top: 130px;
    .tagMargin {
      margin-right: 8px;
      border-radius: 5px;
    }
  }
  .buildContent {
    .contentBox {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      vertical-align: bottom;
      .name {
        font-size: 18px;
      }
      .size {
        font-size: 14px;
        color: #908585;
      }
      .address {
        // line-height: 80px;
        margin-top: 6px;
      }
      .price {
        font-size: 18px;
        color: #1296db;
      }
    }
  }
  .buildBox {
    margin: 10px 0;
  }
}
</style>