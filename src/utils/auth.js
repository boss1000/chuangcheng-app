// 本地化存储
export const setLocalStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 本地化获取
export const getLocalStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

// 本地化删除
export const removeLocalStore = name => {
  if (!name) return
  return window.localStorage.removeItem(name)
}

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 版本信息
export const _VERSION_ = '1.4.1'
