import request from '@/utils/request'

export function createSysValue(data) {
  return request({
    url: '/base/sys_value/',
    method: 'post',
    data
  })
}

export function getSysValueList(params) {
  return request({
    url: '/base/sys_value/',
    method: 'get',
    params
  })
}

export function getSysValueInfo(unique) {
  return request({
    url: `/base/sys_value/${unique}/`,
    method: 'get'
  })
}

export function deleteSysValue(unique) {
  return request({
    url: `/base/sys_value/${unique}/`,
    method: 'delete'
  })
}

export function deleteSysValues(params) {
  return request({
    url: `/base/sys_value/`,
    method: 'delete',
    params
  })
}

export function updateSysValue(unique, data) {
  return request({
    url: `/base/sys_value/${unique}/`,
    method: 'put',
    data
  })
}
