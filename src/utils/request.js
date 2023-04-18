import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

import md5 from '@/utils/md5'
import da from 'element-ui/src/locale/lang/da'
// create an axios instance
var baseURL = process.env.VUE_APP_BASE_API
if (process.env.NODE_ENV === 'production') {
  // var hostname = window.document.location.hostname
  // if (hostname !== 'localhost' && hostname.split('.')[0] !== '192') {
  baseURL = window.g.baseURL
  // }
}
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // baseURL: window.document.location.origin + '/api/v1', // url = base url + request url
  timeout: 60000, // request timeout
  // 解除http状态码为200的限制
  validateStatus: function(status) {
    return status <= 500
  }
})

// 获取md5  当前路由地址，请求地址，请求方法，请求参数，请求data
function get_md5(path, url, method, params, data) {
  var new_data = JSON.stringify(data)
  params = JSON.stringify(params)
  if (data instanceof FormData) {
    new_data = data.get('file').name
  }
  return md5(path + url + method + params + new_data)
}

let pending = [] // 声明一个数组用于存储每个请求的取消函数和axios标识
let cancelToken = axios.CancelToken
let removePending = (config) => {
  if (config.method !== 'get') {
    var md5 = get_md5(router.currentRoute.fullPath, config.url, config.method, config.params, config.data)
    for (let i in pending) {
      if (pending[i].md5 === md5) { // 在当前请求在数组中存在时执行取消函数
        pending[i].f() // 执行取消操作
        pending.splice(i, 1) // 把pending记录删掉
      }
    }
  }
}
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (config.method === 'get') {
    //   config.paramsSerializer = function(params) {
    //     return qs.stringify(params, { arrayFormat: 'repeat' })
    //   }
    // }
    removePending(config)
    config.cancelToken = new cancelToken(function executor(c) { // 本次axios请求的配置添加cancelToken
      var md5 = get_md5(router.currentRoute.fullPath, config.url, config.method, config.params, config.data)
      pending.push({
        md5: md5,
        f: c
      })
    })
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {

    return Promise.reject(error) // 返回接口返回的错误信息
    // console.log(123,error)
    // do something with request error
    // console.log(error) // for debug
    // return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response.config)
    removePending(response.config)
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.message !== '校验错误') {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // 刷新当前页面
            location.reload()
          })
        })
      }
      // 根据后台返回的数据范围的结果提示
      if (res.message === '校验错误') {
        return Promise.reject(res.data)
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  // axios内部运行错误
  error => {
    // console.log('err' + error) // for debug

    if (error.__CANCEL__) {
      console.log('操作过于频繁')
      error.message = '操作过于频繁'
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
