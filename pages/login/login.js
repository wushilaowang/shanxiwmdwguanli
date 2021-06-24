// pages/login/login.js
import {login, unitQuery, getDictionary, getArea, getMenu, getRolePerm} from '../../service/login'

import {md5} from '../../utils/md5'
let app = getApp()

Page({
  //登录
  handleLogin(event) {
    // console.log(event)
    if(event.detail.value.password.trim == '' || event.detail.value.username.trim == '') {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none'
      })
    }else {
      let param = {
          username: event.detail.value.username,
          password: event.detail.value.password
      }
      login(param).then(res => {
        console.log(res)
        if(res.status == 500){
          wx.showToast({
            title: "服务器出错",
            icon: 'none'
          })
        }else if(res.data.status == 1003 || res.data.status == 1004) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }else {
          this.setData({
            loginButton: {
              disabled: true,
              text: "登陆中"
            }
          })
          console.log(res)
          app.setUser(res.data.data)
          app.setWatchUser(res.data.data)
          let unitName = res.data.data.unitName
          wx.setStorageSync("token", res.cookies[0])
          //存账户信息
          let password = ''
          if(this.data.isRemember) {//记住密码,base64加密存storage
            let base = new md5()
            password = base.encode(event.detail.value.password)
          }
          wx.setStorage({
            data: {
              username: event.detail.value.username,
              password: password,
              isRemember: this.data.isRemember
            },
            key: 'user',
          })  

          Promise.all([getArea(), unitQuery(param), getDictionary(), getRolePerm(app.globalData.user.id), getMenu()]).then(res => {
            //获取地域信息
            app.setArea(res[0].data.data);
            //获取单位信息
            // app.setUnitInfo(res[1].data.data[0])
            let unitArray = res[1].data.data
            unitArray.map(item => {
              if(item.unitid == app.globalData.user.unitId) {
                // console.log(item)
                app.setUnitInfo(item)
              }
            })
            // console.log(res[1].data.data)
            //获取字典信息
            app.setSysParam(res[2].data.data)
            //获取用户权限
            //获取左侧菜单栏
            let menuList = null
            let menuIds = res[3].data.data.menuIds
            let miniMenuList = []
            menuList = res[4].data.data
            // console.log(menuList)
            let a = []
            //权限
            menuList.map(item => {
              menuIds.forEach(item2 => {
                if(item2 == item.sysMenuId) {
                  a.push(item)
                }
              })
            })
            app.setUserPerm(a)
            console.log(a)
            a.map(item => {
              app.globalData.miniMenu.map(item2 => {//小程序url配置

                if(item2.sysMenuId == item.sysMenuId) {
                  let key1 = "miniUrl";
                  item[key1] = item2.url
                  let key2 = "miniIcon";
                  item[key2] = item2.icon
                  miniMenuList.push(item);
                  item.menuName = item2.name
                }
              })
            })
            app.setMenuList(miniMenuList)
            
            //登陆成功页面跳转
            wx.redirectTo({
              // url: "/pages/unit/unit"
              url: '/pages/home/home',
            })
            setTimeout(() => {
              this.setData({
                loginButton: {
                  disabled: false,
                  text: "登陆"
                }
              })
            }, 3000);
          }).catch(err => {
            // console.log(err)
            this.setData({
              loginButton: {
                disabled: false,
                text: "登陆"
              }
            })
          })
        }
      })
      
    }
  },
  //清缓存
  handleClear() {
    wx.clearStorage()
  },
  //记住密码
  handleRememberPwd(e) {
    this.setData({
      isRemember: !this.data.isRemember
    })
    // console.log(this.data.isRemember)
  },
  /**
   * 页面的初始数据
   */
  data: {
    loginButton: {
      disabled: false,
      text: "登陆"
    },
    title: '登陆页',
    showBar: false,
    isLoginPage: true,
    showDialog: true,
    content: "aaa",
    isRemember: true,
    formUsername: '',
    formPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let base = new md5()
    let storageUser = wx.getStorageSync('user')
    if(storageUser != '') {
      this.setData({
        formUsername: storageUser.username,
        //base64解密
        formPassword: base.decode(storageUser.password),
        isRemember: storageUser.isRemember
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})