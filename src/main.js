import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/elementVariables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/errorLog.js' // error log
import * as filters from './filters' // global filters
import mySearch from '@/components/myComponents/search'
import myTable from '@/components/myComponents/table'
import myPagination from '@/components/myComponents/pagination'
import myForm from '@/components/myComponents/form'
import myButton from '@/components/myComponents/button'
import myFilterTag from '@/components/myComponents/filterTag'
import checkPermission from '@/directive/permission/permission'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
// import '@/theme/index.css'
import { hiPrintPlugin } from 'vue-plugin-hiprint'
import drawFlow from '@/components/myComponents/drawFlow'
import vueEsign from 'vue-esign'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// 引入mockjs,和mockjs里用的axios
// import axios from 'axios'
// Vue.prototype.$axios = axios
// import '@/mock/index.js'
Vue.use(vueEsign)
Vue.use(Element, {
  size: 'small'// set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
Vue.use(drawFlow)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('permission', checkPermission)
Vue.directive('elDragDialog', elDragDialog)
Vue.config.productionTip = false
Vue.prototype.$url = process.env.VUE_APP_BASE_API

// 注册全局组件、混入
Vue.component('mySearch', mySearch)
Vue.component('myTable', myTable)
Vue.component('myPagination', myPagination)
Vue.component('myForm', myForm)
Vue.component('myButton', myButton)
Vue.component('myFilterTag', myFilterTag)

Vue.use(hiPrintPlugin, '$hiPrint', false)
hiPrintPlugin.disAutoConnect()

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: h => h(App)
})
