import request from '@/utils/request'

export function createSysType(data) {
  return request({
    url: '/base/sys_type/',
    method: 'post',
    data
  })
}

export function getSysTypeList(params) {
  return request({
    url: '/base/sys_type/',
    method: 'get',
    params
  })
}

export function getSysTypeInfo(unique) {
  return request({
    url: `/base/sys_type/${unique}/`,
    method: 'get'
  })
}

export function deleteSysType(unique) {
  return request({
    url: `/base/sys_type/${unique}/`,
    method: 'delete'
  })
}

export function deleteSysTypes(params) {
  return request({
    url: `/base/sys_type/`,
    method: 'delete',
    params
  })
}

export function updateSysType(unique, data) {
  return request({
    url: `/base/sys_type/${unique}/`,
    method: 'put',
    data
  })
}
