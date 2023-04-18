import variables from '@/styles/elementVariables.scss'
import defaultSettings from '@/settings'
import { getSysValueInfo } from '@/api/system/sysValue'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  system_name: null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SYSTEM_NAME_SETTING: (state, title) => {
    // eslint-disable-next-line no-prototype-builtins
    state.system_name = title
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  getSystemName({ state, commit }) {
    return new Promise(async resolve => {
      // 获取路由
      if (state.system_name !== null) {
        resolve(state.system_name)
      } else {
        const response = await getSysValueInfo('system_name')
        const data = response.data
        if (data) {
          commit('SYSTEM_NAME_SETTING', data.value)
        }
        resolve(state.system_name)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

