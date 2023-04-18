import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/getPageTitle'

NProgress.configure({ showSpinner: false }) // NProgress Configuration 进度条

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  const systemName = await store.dispatch('settings/getSystemName')
  document.title = getPageTitle(to.meta.title, systemName)
  // const organizationNo = await store.dispatch('permission/getOrganizationNo')
  // // 判断是否已从总服务器获取organizationNo机构编号
  // if (organizationNo === null && (to.path !== '/login')) {
  //   removeToken()
  //   next(`/login?redirect=${to.path}`)
  //   NProgress.done()
  // } else {
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission role through getInfo
      const hasroles = store.getters.roles && store.getters.roles.length > 0
      if (hasroles) {
        next()
      } else {
        try {
          // get user info
          // note: role must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles, id } = await store.dispatch('user/getInfo')
          // generate accessible routes map based on role
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          await store.dispatch('permission/generateButtons', id)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
