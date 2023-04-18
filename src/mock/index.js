import { UsersData } from './mockData/index.js'

// ajax  拦截器
import axios from 'axios'
// yarn add axios-mock-adapter
import MockAdapter from 'axios-mock-adapter'
// 初始化 拦截器对象
const mock = new MockAdapter(axios)
mock.onPost('/list').reply(config => {
  // //console.log(config)
  return [200, UsersData]
})

export default axios
