const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  user_info: state => state.user.user_info,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.currentRoutes,
  organization_no: state => state.permission.organizationNo,
  system_name: state => state.settings.system_name,
  buttons: state => state.permission.buttons,
  errorLogs: state => state.errorLog.logs
}
export default getters
