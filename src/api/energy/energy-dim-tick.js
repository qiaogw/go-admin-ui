import request from '@/utils/request'

// 查询EnergyDimTick列表
export function listEnergyDimTick(query) {
  return request({
    url: '/api/v1/energy-dim-tick',
    method: 'get',
    params: query
  })
}

// 查询EnergyDimTick详细
export function getEnergyDimTick(id) {
  return request({
    url: '/api/v1/energy-dim-tick/' + id,
    method: 'get'
  })
}

// 新增EnergyDimTick
export function addEnergyDimTick(data) {
  return request({
    url: '/api/v1/energy-dim-tick',
    method: 'post',
    data: data
  })
}

// 修改EnergyDimTick
export function updateEnergyDimTick(data) {
  return request({
    url: '/api/v1/energy-dim-tick/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除EnergyDimTick
export function delEnergyDimTick(data) {
  return request({
    url: '/api/v1/energy-dim-tick',
    method: 'delete',
    data: data
  })
}
// 导出 EnergyDimTick
export function exportEnergyDimTick(query) {
  return request({
    url: '/api/v1/energy-dim-tick/export',
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  })
}

// 导入 EnergyDimTick
export function importEnergyDimTick(data) {
  return request({
    url: '/api/v1/energy-dim-tick/import',
    method: 'post',
    data: data
  })
}

