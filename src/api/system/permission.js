import request from '@/utils/request'

export function getRouteList() {
  return request({
    url: '/base/route/',
    method: 'get'
  })
}

export function getButtonList(params) {
  return request({
    url: '/base/button/',
    method: 'get',
    params
  })
}

export function getPermissionList(params) {
  return request({
    url: '/base/permission/',
    method: 'get',
    params
  })
}
