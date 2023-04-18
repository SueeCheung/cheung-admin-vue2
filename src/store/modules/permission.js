import { componentMap, constantRoutes } from '@/router'
import { getRouteList, getButtonList } from '@/api/system/permission'
import { getSysValueInfo } from '@/api/system/sysValue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  allRoutes: [],
  addRoutes: [],
  currentRoutes: [],
  buttons: [],
  organizationNo: null
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes.concat(constantRoutes)
  },
  SET_ALL_ROUTES: (state, routers) => {
    state.allRoutes = routers
  },
  SET_CURRENT_ROUTES: (state, routes) => {
    state.currentRoutes = routes
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_ORGANIZATION_NO: (state, organizationNo) => {
    state.organizationNo = organizationNo
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      // let accessedRoutes
      // 获取路由
      let routes = await getRouteList()
      routes = routes.data
      // 替换组件，删除childern
      const asyncRoutes = routes.filter(curr => {
        if (curr.children === null || curr.children.length === 0) {
          delete curr.children
        }
        return replaceComponent(curr)
      })
      commit('SET_ALL_ROUTES', asyncRoutes)
      let accessedRoutes
      if (roles.includes('超级管理员')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      accessedRoutes.push({ path: '*',
        meta: {
          title: '404',
          icon: 'excel'
        },
        name: '404',
        redirect: '/404', hidden: true
      })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
      // commit('SET_ROUTES', asyncRoutes)
      // resolve(asyncRoutes)
    })
  },
  // 获取按钮
  generateButtons({ commit }, id) {
    return new Promise(async resolve => {
      // let accessedRoutes
      // 获取路由
      let buttons = await getButtonList({ roles__users__id: id })
      buttons = buttons.data
      // 替换组件，删除childern
      commit('SET_BUTTONS', buttons)
      resolve(buttons)
    })
  },
  // 门户页面点击后，获取当前页面路由
  currentRoutes({ state, commit }, obj) {
    let current_routes
    const { roles, forefathers_id } = obj
    // 获取门户路由下的子路由
    for (var i = 0; i < state.addRoutes.length; i++) {
      if (state.addRoutes[i].id === forefathers_id) {
        current_routes = state.addRoutes[i].children
        break
      }
    }
    // 根据权限筛选路由
    if (!roles.includes('超级管理员')) {
      current_routes = filterAsyncRoutes(current_routes, roles)
    }
    commit('SET_CURRENT_ROUTES', current_routes)
  },
  // 获取总服务器颁发的organization_no
  getOrganizationNo({ state, commit }) {
    return new Promise(async resolve => {
      // 获取路由
      if (state.organizationNo !== null) {
        resolve(state.organizationNo)
      } else {
        const response = await getSysValueInfo('organization_no')
        const data = response.data
        if (data) {
          commit('SET_ORGANIZATION_NO', data.value)
        }
        resolve(state.organizationNo)
      }
    })
  }
}

function replaceComponent(comp) {
  if (comp.component && typeof (comp.component) === 'string') {
    comp.component = componentMap[comp.component]
  }
  if (comp.children && comp.children.length > 0) {
    for (let i = 0; i < comp.children.length; i++) {
      comp.children[i] = replaceComponent(comp.children[i])
    }
  }
  return comp
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
