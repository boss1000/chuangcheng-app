const getters = {
  token: state => state.user.token,
  loginData: state => state.user.loginData,
  isPhone: state => state.app.isPhone
}
export default getters
