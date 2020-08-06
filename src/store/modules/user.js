import { GetUserInfo, RegisterAccount } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'
import { setLocalStore } from '@/utils/auth.js'

const state = {
  token: getToken(),
  account: '',
  name: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { UserName, UserPwd } = userInfo
    return new Promise((resolve, reject) => {
      GetUserInfo({
        UserName: UserName.trim(),
        UserPwd: UserPwd.trim()
      })
        .then(response => {
          const { object } = response
          commit('SET_TOKEN', object)
          setLocalStore('loginInfo', object)
          setToken(object)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  register({ commit }, registerData) {
    return new Promise((resolve, reject) => {
      RegisterAccount(registerData)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_ACCOUNT', '')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      sessionStorage.removeItem('userRoles')
      removeToken()
      router.push({
        name: 'login'
      })
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCOUNT', '')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
