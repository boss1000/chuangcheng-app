import request from '@/utils/request'

// 楼盘列表
export function GetLoanAdvert(data) {
  return request({
    url: '/api/LoanAdvert/GetLoanAdvert',
    method: 'post',
    data
  })
}

// 判读是否登录
export function IsLogin(data) {
  return request({
    url: '/api/Login/IsLogin',
    method: 'get',
    params: data
  })
}
