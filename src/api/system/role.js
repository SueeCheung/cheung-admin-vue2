import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/base/role/',
    method: 'get',
    params
  })
}

export function createRole(data) {
  return request({
    url: '/base/role/',
    method: 'post',
    data
  })
}

export function getRoleInfo(unique) {
  return request({
    url: `/base/role/${unique}`,
    method: 'get'
  })
}

export function deleteRole(unique) {
  return request({
    url: `/base/role/${unique}/`,
    method: 'delete'
  })
}
export function deleteRoles(params) {
  return request({
    url: `/base/role/`,
    method: 'delete',
    params
  })
}

export function updateRole(unique, data) {
  return request({
    url: `/base/role/${unique}/`,
    method: 'put',
    data
  })
}
