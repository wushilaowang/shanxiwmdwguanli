// pages/home/home.js

import {getHeadImg, getConfig, getLoginNum} from "../../service/login"
import request from '../../service/request'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBar: true,
    isLoginPage: false,
    menuList: {},
    userInfo: {},
    headImgSrc: "",
    copyRight: "",
    loginNum: 0
  },

  //页面跳转
  handleRedirect(e) {
    let unitInfo = app.globalData.unitInfo
    // console.log(app.globalData.UnitInfo)
    if(e.currentTarget.dataset.value == "/pages/stuff/stuff"){
      e.currentTarget.dataset.value = e.currentTarget.dataset.value + "?unitId=" + unitInfo.unitid + "&unitType=" + unitInfo.type
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({method: "GET", url: "/unit",
    header: {
      "cookie": wx.getStorageSync('token'),
    },
       data: {
           year: (new Date()).getFullYear(), 
           unitlevel: 1,
           state: 1,
           _limit: 2,
           _page: 1}
      }).then(res => {
          console.log(res)
          let arr = []
          res.data.data.result.map(item => {
              arr.push(item.fullname)
          })
          console.log(arr.toString())

        var userArr = []
        arr.map(item => {
            request({method: "GET", url: "/user", 
            header: {
              "cookie": wx.getStorageSync('token'),
            },
            data: {
                unitName: item,
            }}).then(res => {
                console.log(res.data)
                if(res.data.data.records = 1) {
                    userArr.push(res.data.data.records)
                }
                console.log(userArr)
            })
        })
        //   arr.map(item => {
        //       generalGet({method: "POST", url: Store.state.port + 'role/user/6455', data: {
        //           'roleIds[]': 293,
        //           userId: item
        //       }})
        //   })
      })




    //获取用户登陆数量
    getLoginNum().then(res => {
      // console.log(res.data)
      this.setData({
        loginNum: res.data.data
      })
    })
    //获取配置信息
    getConfig().then(res => {
      // console.log(res.data.data)
      let configs = res.data.data;
      let copyRight = {};
      configs.map(item => {
        if(item.cfgkey == "companyInfo"){
          copyRight = item.description
        }
      })
      this.setData({
        copyRight: copyRight
      })
      // console.log(copyRight)
    })
    //获取头像信息
    getHeadImg().then(res => {
      // console.log(res.data.data)
      let headImgSrc = ""
      if(!res.data.data){
        headImgSrc = "https://shx.oupusoft.com/userPhoto.png"
      }else {
        headImgSrc = res.data.data.replace("http", "https")
      }
      this.setData({
        headImgSrc: headImgSrc,
      })
    })
    //加载菜单,登陆用户信息
    this.setData({
      menuList: app.globalData.menuList,
      userInfo: app.globalData.user
    })
    // console.log(this.data.headImgSrc)
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