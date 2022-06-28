import request from '@/utils/request'

// 查询EnergyConsumption列表
export function listEnergyConsumption(query) {
  return request({
    url: '/api/v1/energy-consumption',
    method: 'get',
    params: query
  })
}

// 查询EnergyConsumption详细
export function getEnergyConsumption(id) {
  return request({
    url: '/api/v1/energy-consumption/' + id,
    method: 'get'
  })
}

// 新增EnergyConsumption
export function addEnergyConsumption(data) {
  return request({
    url: '/api/v1/energy-consumption',
    method: 'post',
    data: data
  })
}

// 修改EnergyConsumption
export function updateEnergyConsumption(data) {
  return request({
    url: '/api/v1/energy-consumption/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除EnergyConsumption
export function delEnergyConsumption(data) {
  return request({
    url: '/api/v1/energy-consumption',
    method: 'delete',
    data: data
  })
}
// 导出 EnergyConsumption
export function exportEnergyConsumption(query) {
  return request({
    url: '/api/v1/energy-consumption/export',
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  })
}

// 导入 EnergyConsumption
export function importEnergyConsumption(data) {
  return request({
    url: '/api/v1/energy-consumption/import',
    method: 'post',
    data: data
  })
}

