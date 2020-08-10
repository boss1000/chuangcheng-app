import request from '@/utils/request'

// 楼盘列表
export function GetLoanAdvert(data) {
  return request({
    url: '/api/LoanAdvert/GetLoanAdvert',
    method: 'post',
    data
  })
}

// 房源管理
export function GetPrecisePub(data) {
  return request({
    url: '/api/PrecisePub/GetPrecisePub',
    method: 'post',
    data
  })
}
// 置顶功能
export function TopPrecisePub(data) {
  return request({
    url: '/api/PrecisePub/TopPrecisePub',
    method: 'get',
    params: data
  })
}

// 删除功能
export function DelPrecisePubn(data) {
  return request({
    url: '/api/PrecisePub/DelPrecisePubn',
    method: 'post',
    params: data
  })
}

// 信息修改
export function MolPrecisePub(data) {
  return request({
    url: '/api/PrecisePub/MolPrecisePub',
    method: 'post',
    data
  })
}

// 信息发布
export function AddPrecisePub(data) {
  return request({
    url: '/api/ChatRoom/AddPrecisePub',
    method: 'get',
    data
  })
}

// 上传图片
export function UpLoadHeadImg(data) {
  return request({
    url: '/api/Filse/UpLoadHeadImg',
    method: 'post',
    data,
    config: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  })
}
