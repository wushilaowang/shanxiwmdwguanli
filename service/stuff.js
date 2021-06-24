import request from './request'

//标准应用
export function ruleapp() {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: '/ruleapp',
      data: {
          year: 2020
      }
  })
}

//查询当前标准下的考核标准
export function rule() {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/assessrule",
      data: {year: 2020}
  })
}

//根据条件查询考核统计
export function assessCountByQuery(data) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/checkrecord/assessCount/history",
      data: data
  })
}

//查询材料
export function queryStuff(data) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/stuff",
      data: data
  })
}

//获取考核状态
export function checkStatus(unitId) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/stuff/countUnitAssess",
      data: {
          year: 2020,
          unitid: unitId
      }
  })
}