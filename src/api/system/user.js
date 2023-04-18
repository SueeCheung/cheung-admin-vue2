import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/base/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/base/user/info/',
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/base/user/',
    method: 'post',
    data
  })
}

export function getUserList(params) {
  return request({
    url: '/base/user/',
    method: 'get',
    params
  })
}

export function deleteUser(unique) {
  return request({
    url: `/base/user/${unique}/`,
    method: 'delete'
  })
}

export function deleteUsers(params) {
  return request({
    url: `/base/user/`,
    method: 'delete',
    params
  })
}

export function getUserInfo(unique) {
  return request({
    url: `/base/user/${unique}/`,
    method: 'get'
  })
}

export function updateUser(unique, data) {
  return request({
    url: `/base/user/${unique}/`,
    method: 'put',
    data
  })
}
