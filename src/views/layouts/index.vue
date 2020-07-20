<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      tabbars: [
        {
          title: '一手楼盘',
          to: {
            name: 'Home'
          },
          normal: require('@/assets/ic_shouyeblack@3x.png'),
          active: require('@/assets/ic_shouye@3x.png')
        },
        {
          title: '',
          to: {
            name: 'Home'
          },
          normal: require('@/assets/ic_qipao@3x.png'),
          active: require('@/assets/ic_qipao@3x.png')
        },
        {
          title: '个人管理',
          to: {
            name: 'About'
          },
          normal: require('@/assets/ic_meblack@3x.png'),
          active: require('@/assets/ic_me@3x.png')
        }
      ]
    }
  },
  components: {
    TabBar
  },
  methods: {
    handleChange(v) {
      console.log('tab value:', v)
    }
  }
}
</script>
