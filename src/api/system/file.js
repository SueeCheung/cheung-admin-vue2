import request from '@/utils/request'

export function createFile(data) {
  return request({
    url: '/base/file/',
    method: 'post',
    // headers:{

    //   'content-type':'multipart/form-data'

    //   },
    data
  })
}

export function updateFile(unique, data) {
  return request({
    url: `/base/file/${unique}/`,
    method: 'put',
    data
  })
}

