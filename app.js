//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    user: null,//登录时的信息
    unitInfo: null,//单位信息
    sysParam: null,//字典信息
    area: null,//地域信息 
    menu: null,//菜单信息
    menuList: null,//有权限的菜单(小程序)
    userPerm: null,
    watchUser: null,//当前要查看的单位
    miniMenu: [
      {sysMenuId: 1004, name: '单位管理', url: "/pages/unit/unit", icon: "../../assets/image/tabbar/group3.png"},
      {sysMenuId: 1012, name: '单位地图', url: "/pages/baidumap/baidumap", icon: "../../assets/image/tabbar/map3.png"},
      {sysMenuId: 2002, name: '材料查询管理', url: "/pages/queryStuff/queryStuff", icon: "../../assets/image/tabbar/instruction3.png"},
      {sysMenuId: 4001, name: '考核统计查询', url: "/pages/assessCount/assessCount", icon: "../../assets/image/tabbar/detail3.png"},
      // {sysMenuId: 2003, name: '考核明细查询', url: "/pages/stuff/stuff", icon: "../../assets/image/tabbar/count3.png"},
      {sysMenuId: 8001, name: '通知管理', url: "/pages/notification/notification", icon: "../../assets/image/tabbar/notice3.png"},
      {sysMenuId: 2001, name: '材料上报', url: "/pages/uploadStuff/uploadStuff", icon: "../../assets/image/tabbar/upload.png"},
    ]//小程序菜单
  },
  setMenuList(data) {
    this.globalData.menuList = data
  },
  setUserPerm(data) {
    this.globalData.userPerm = data
  },
  setUser(data) {
    this.globalData.user = data
  },
  setMenu(data) {
    this.globalData.menu = data
  },
  setUnitInfo(data) {
    this.globalData.unitInfo = data
  },
  setSysParam(data) {
    this.globalData.sysParam = data
  },
  setArea(data) {
    this.globalData.area = data
  },
  setWatchUser(data) {
    this.globalData.watchUser = data
  }
})

// "tabBar": {
//   "selectedColor": "#ff0000",
//   "list": [
//     {
//     "pagePath": "pages/unit/unit",
//     "text": "单位信息",
//     "iconPath": "/assets/image/tabbar/group.png",
//     "selectedIconPath": "/assets/image/tabbar/group-active.png"
//     },
//     {
//       "pagePath": "pages/assessCount/assessCount",
//       "text": "考核统计",
//       "iconPath": "/assets/image/tabbar/count.png",
//       "selectedIconPath": "/assets/image/tabbar/count-active.png"
//     },
//     {
//       "pagePath": "pages/stuff/stuff",
//       "text": "成绩明细",
//       "iconPath": "/assets/image/tabbar/instruction.png",
//       "selectedIconPath": "/assets/image/tabbar/instruction-active.png"
//     },
//     {
//       "pagePath": "pages/baidumap/baidumap",
//       "text": "地图",
//       "iconPath": "/assets/image/tabbar/map.png",
//       "selectedIconPath": "/assets/image/tabbar/map-active.png"
//     }
//   ]
// },