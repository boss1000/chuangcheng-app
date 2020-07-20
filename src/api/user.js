import request from '@/utils/request'

// 判读是否登录
export function IsLogin(data) {
  return request({
    url: '/api/Login/IsLogin',
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

// 注册
export function RegisterAccount(data) {
  return request({
    url: '/api/Register/RegisterAccount',
    method: 'post',
    data
  })
}

// 验证用户名
export function CheckAccount(data) {
  return request({
    url: '/api/Register/CheckAccount',
    method: 'get',
    params: data
  })
}

// 验证手机号
export function CheckMobile(data) {
  return request({
    url: '/api/Register/CheckMobile',
    method: 'get',
    params: data
  })
}

// 验证昵称
export function CheckNickName(data) {
  return request({
    url: '/api/Register/CheckNickName',
    method: 'get',
    params: data
  })
}
