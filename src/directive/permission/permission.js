import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  const buttons = store.getters && store.getters.buttons
  if (roles.includes('超级管理员') || value === undefined || value === '') {
    return true
  }
  if (roles.includes('超级管理员') && value === 'admin') {
    return true
  }
  if (value) {
    const permissionRoles = value
    const hasPermission = buttons.some(button => {
      return button.permission_name === permissionRoles
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
