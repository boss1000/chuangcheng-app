/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '一手楼盘', keepAlive: true, requireAuth: true }
      },
      {
        path: '/homeDetail',
        name: 'HomeDetail',
        component: () => import('@/views/home/detail'),
        meta: { title: '详情', keepAlive: true, requireAuth: true, hiddenBottom: true }
      },
      {
        path: '/chatroom',
        name: 'Chatroom',
        component: () => import('@/views/chatroom'),
        meta: { title: '个管理', keepAlive: true, requireAuth: true }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/mine/index'),
        meta: { title: '个人管理', keepAlive: true, requireAuth: true }
      },
      {
        path: '/HouseManagement',
        name: 'HouseManagement',
        component: () => import('@/views/HouseManagement/index'),
        meta: { title: '房源管理', requireAuth: true, hiddenBottom: true }
      },
      {
        path: '/InfoDelivery',
        name: 'InfoDelivery',
        component: () => import('@/views/InfoDelivery/index'),
        meta: { title: '精准发布', requireAuth: true, hiddenBottom: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: { title: '登录', keepAlive: true }
  }
]
