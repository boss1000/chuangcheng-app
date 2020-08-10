import { isPhone } from '@/utils'
const state = {
  userName: '',
  isPhone: true
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_ISPHONE: (state, roles) => {
    state.isPhone = roles
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  setPhone({ commit }) {
    commit('SET_ISPHONE', isPhone())
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
