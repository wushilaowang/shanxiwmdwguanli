// pages/index/index.js

import {queryUnknownUrl} from '../../service/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [
      "http://shx.oupusoft.com/oupu_sxwmdw/upload/show/181550",
      "http://shx.oupusoft.com/oupu_sxwmdw/upload/show/70131"
    ],
    showBar: false,
    isLoginPage: false,
    sysHeight: 0,
  },

  
  //前往登陆
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    //
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          sysHeight: res.windowHeight
        })
      }
    })
    //获取轮播图源
    let param = {};
    param.url = "/imginfo"
    queryUnknownUrl(param).then(res => {
      console.log(res)
      let resultArr = [];
      res.data.data.map(item => {
        if(item.enable == 1 && item.position == 1) {
          item.url = item.url.replace("http", "https")
          resultArr.push(item)
        }
      })
      this.setData({
        swiper: resultArr
      })
    })
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