import request from '@/utils/request'

export function getOperationLogList(params) {
  return request({
    url: '/base/log/operation',
    method: 'get',
    params
  })
}
export function getLoginLogList(params) {
  return request({
    url: '/base/log/login',
    method: 'get',
    params
  })
}
