import request from '@/utils/request'

// 加载聊天数据
export function GetLogByTime(data) {
  return request({
    url: '/api/ChatRoom/GetLogByTime',
    method: 'get',
    params: data
  })
}

// 登录
export function GetUserInfo(data) {
  return request({
    url: '/api/Login/GetUserInfo',
    method: 'post',
    data
  })
}
