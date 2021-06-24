// pages/notification/notification.js
let app = getApp()
let WxParse = require('../../wxParse/wxParse')
import {queryUnknownUrl} from "../../service/login"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBar: true,
    appMenuList: {},
    policyList: [],//测评指标
    noticeList: [],//通知
  },

  //
  handleNotice(e) {
    let that = this
    let content = e.currentTarget.dataset.value;
    console.log(content)
    content = content.replace("<img style=\"", "<img style=\"width:16rpx; height:16rpx; ")
    console.log(content)
    console.log(e)
    WxParse.wxParse("notice", 'html', content, that, 5)
  } ,
  //打开pdf
  wxParseTagATap(e) {
    console.log(e)
    let realSrc = e.currentTarget.dataset.src
    e.currentTarget.dataset.src = realSrc.replace("http", "https");
    console.log(e.currentTarget.dataset.src)
    wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function(res) {
        let filePath = res.tempFilePath
        console.log(res.tempFilePath)
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function(res) {
            console.log(res)
          },
          fail: function(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        console.log('下载失败')
      }
    })
  },
  //查看指标
  handlePolicy(e) {
    let realUrl = e.currentTarget.dataset.value;
    realUrl = realUrl.replace("http", "https")
    wx.downloadFile({
      url: realUrl,
      success: function(res) {
        console.log(realUrl)
        console.log(res.tempFilePath)
        let filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function(res) {
            console.log(res)
          },
          fail: function(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param1 = {
      url: "/policy",
      data: {
        _limit: 10,
        _page: 1,
        year: 2020
      }
    }
    let param2 = {
      url: "/notice",
      data: {
        _limit: 10,
        _page: 1,
        year: 2020
      }
    }
    //加载指标和通知
    Promise.all([queryUnknownUrl(param1), queryUnknownUrl(param2)]).then(res => {
      // console.log(res[1])
      let notice = res[1].data.data.result
      let noticeArr = []
      
      let timeNow = new Date().getTime()
      notice.map(item => {
        let expTime = new Date(item.expdate).getTime();//通知过期时间
        if(expTime > timeNow) {
          noticeArr.push(item)
        }
      })
      // console.log(noticeArr)
      this.setData({
        appMenuList: app.globalData.menuList,
        policyList: res[0].data.data.result,
        noticeList: noticeArr,
      })
    })
    // queryUnknownUrl(param).then(res => {
    //   console.log(res)
    //   this.setData({
    //     appMenuList: app.globalData.menuList,
    //     policyList: res.data.data.result
    //   })
    // })
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