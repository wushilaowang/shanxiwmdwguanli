// pages/queryStuff/queryStuff.js
import {queryStuff} from '../../service/stuff'
const Base64 = require('../../utils/base64')
let WxParse = require('../../wxParse/wxParse')
let app = getApp()

Page({
  //滚动
  scroll(e) {
    let scrollTop = e.detail.scrollTop
    if(scrollTop < this.data.scrollHeight/2) {
      this.setData({
        showBacktop: false
      })
    }else {
      this.setData({
        showBacktop: true
      })
    }
  },
  //加载材料内容
  handleBindListData(e) {
    console.log(e)
    this.setData({
      showStuffContent: true,
      currentStuff: e.detail
    })
    let that = this
    let content = e.detail;
    if(content && content.content) {
      if(e.detail.content.substring(0, 4) == "base") {
        content = decodeURIComponent(Base64.decode(e.detail.content.substring(13, e.detail.content.length)))
      }
      let param = {
        that: that,
        data: content
      }
      this.loadWxparse(param)
    } else {
      wx.showToast({
        title: '没有内容',
        icon: 'none'
      })
      that.setData({
        showStuffContent: false
      })
    }
    
  },
  //回到顶部
  handleBacktop() {
    this.setData({
      scrollTop: 0
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    showStuffContent: false,
    queryUrl: "/stuff",
    showBar: true,
    showDate: false,
    appMenuList: {},
    stuffList: [],
    showList: 'none',
    article: '',
    inputValue: '' ,
    scrollTop: 0,//距顶部距离
    scrollHeight: wx.getSystemInfoSync().windowHeight,//高度
    showBackTop: false,
    currentStuff: {}
  },
  //打开pdf
  wxParseTagATap(e) {
    let realSrc = e.currentTarget.dataset.src
    e.currentTarget.dataset.src = realSrc.replace("http", "https");
    // console.log(e.currentTarget.dataset.src)
    wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function(res) {
        let filePath = res.tempFilePath
        // console.log(res.tempFilePath)
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function(res) {
            // console.log(res)
          },
          fail: function(res) {
            // console.log(res)
          }
        })
      },
      fail: function(res) {
        // console.log('下载失败')
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(app.globalData.userPerm)
    app.globalData.userPerm.forEach(item => {
      if(item.sysMenuId == 8076) {
        this.setData({
          showDate: true
        })
      }
    })
    //判断是否为普通用户
    let hasNormalUnit = false;
    app.globalData.user.roles.map(item => {
      if(item == "材料上报管理员") {
        hasNormalUnit = true;
      }
    })
    if(hasNormalUnit) {
      //获取组件
      this.stuffSearch = this.selectComponent("#stuffSearch")
      // console.log(this.stuffSearch)
      //组件查询方法
      this.stuffSearch.handleQuery();
      //菜单数据
      this.setData({
        appMenuList: app.globalData.menuList
      })
    }
    if(options.name) {
      this.stuffSearch = this.selectComponent("#stuffSearch")
      this.stuffSearch.handleRedirectQuery(options.name);
    }
  },



  //wxparse
  loadWxparse(data) {
    console.log(data.data)
    if(data.data.indexOf('%') > -1) {
      data.data = data.data.replace(/%/g, '%25')
    }
    WxParse.wxParse("test", 'html', decodeURIComponent(data.data), data.that, 5)
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