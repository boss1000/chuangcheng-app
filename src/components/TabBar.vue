<template>
  <div>
    <van-tabbar fixed route v-model="active" @change="handleChange">
      <van-tabbar-item v-for="(item, index) in data" :to="item.to" :key="index">
        {{ item.title }}
        <template #icon="props">
          <img :src="props.active ? item.active : item.normal" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
    defaultActive: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      active: this.defaultActive
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/deep/ .van-tabbar-item__icon {
  img {
    height: 28px;
  }
}
.van-tabbar-item:nth-child(2) {
  /deep/ .van-tabbar-item__icon {
    top: -15px;
    z-index: 10;
    img {
      height: 50px;
    }
  }
}
</style>
