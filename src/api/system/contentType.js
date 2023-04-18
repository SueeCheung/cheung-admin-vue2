import request from '@/utils/request'

export function getContentTypeList(params) {
  return request({
    url: '/base/content_type/',
    method: 'get',
    params
  })
}
