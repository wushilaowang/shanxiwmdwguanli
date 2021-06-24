import request from './request'
//get
export function requestGet(data) {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    method: data.method,
    url: data.url,
    data: data.param
  })
}
export function requestFunction(data) {
  return request({
    header: data.header,
    method: data.method,
    url: data.url,
    data: data.param
  })
}


export function requestPost(data) {
  return request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cookie": wx.getStorageSync('token'),
    },
    method: data.method,
    url: data.url,
    data: data.param
  })
}

//登录
export function login(param) {
  return request({
    url: '/login',
    data: param
  })
}

//单位信息
export function unitQuery(data) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/unit",
      data: data
  })
}

//材料得分详情
export function countDetail(unitId) {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: '/checkrecord/detailedResultByUnit/'+unitId,
    params: {
        year: 2020
    }
  })
}



//得分明细
export function assessCount() {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: "/checkrecord/assessCount/history",
    data: {
        year: 2020
    }
  })
}

//字典信息
export function getDictionary() {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: "/sys-param"
  })
}

//获取地域信息
export function getArea(data) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/district"
  })
}

//获取左侧菜单
export function getMenu() {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/menu"
  })
}

//获取角色权限信息
export function getRolePerm(data) {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/role/perms/user/"+data
  })
}

//请求头像
export function getHeadImg() {
  return request({
      header: {
        "cookie": wx.getStorageSync('token'),
      },
      url: "/user/headImg/current"
  })
}

//获取配置信息
export function getConfig() {
  return request({
      url: "/config"
  })
}

//获取当前用户登陆数量
export function getLoginNum() {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: "/user/loginNum"
  })
}

//url是变量
export function queryUnknownUrl(data) {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: data.url,
    data: data.data
  })
}

//查询附近单位
export function surroundLocation(data) {
  return request({
    header: {
      "cookie": wx.getStorageSync('token'),
    },
    url: "/unit/surroundLocation",
    data: data.data
  })
}
