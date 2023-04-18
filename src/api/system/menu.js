import request from '@/utils/request'

export function createMenu(data) {
  return request({
    url: '/base/menu/',
    method: 'post',
    data
  })
}

export function getMenuList(params) {
  return request({
    url: '/base/menu/',
    method: 'get',
    params
  })
}

export function deleteMenu(unique) {
  return request({
    url: `/base/menu/${unique}/`,
    method: 'delete'
  })
}

export function deleteMenus(params) {
  return request({
    url: `/base/menu/`,
    method: 'delete',
    params
  })
}

export function getMenuInfo(unique) {
  return request({
    url: `/base/menu/${unique}/`,
    method: 'get'
  })
}

export function updateMenu(unique, data) {
  return request({
    url: `/base/menu/${unique}/`,
    method: 'put',
    data
  })
}
