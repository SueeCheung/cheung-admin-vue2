import request from '@/utils/request'

export function getSysMessageList(params) {
  return request({
    url: '/message/sys_message/',
    method: 'get',
    params
  })
}

export function updateSysMessage(unique, data) {
  return request({
    url: `/message/sys_message/${unique}/`,
    method: 'put',
    data
  })
}

export function getHasMessage() {
  return request({
    url: '/message/message/',
    method: 'get'
  })
}

export function readMessage() {
  return request({
    url: '/message/message/',
    method: 'post'
  })
}

export function deleteSysMessage(unique) {
  return request({
    url: `/message/sys_message/${unique}/`,
    method: 'delete'
  })
}
