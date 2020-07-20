const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  account: state => state.user.account,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  ruleData: state => state.user.ruleData,
  otherData: state => state.user.otherData,
  detailCurr: state => state.user.detailCurr,
  name: state => state.user.name,
  isPhone: state => state.app.isPhone,
  sateAllList: state => state.app.sateAllList,
  sateList: state => state.app.sateList,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  approverList: state => state.user.approver
}
export default getters
