// pages/unit/unit.js
import {unitQuery, requestFunction} from "../../service/login"
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBar: true,
    appMenuList: {},
    unitTable: null,
    showInfomation: "none",
    unitLevel: null,
    queryUrl: "/unit",
    inputValue: '', //当前更改input的value
  },
  //当前更改input的值
  bindKeyInput(e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  //更改单位信息
  handleChangeInfo(e) {
    let unitTag = e.target.dataset.tag;
    let param = {};
    param['unitid'] = app.globalData.unitInfo.unitid; 
    param[unitTag] = e.detail.value;
    requestFunction({
      header: {method: 'put', "cookie": wx.getStorageSync('token'), "Content-Type": "application/x-www-form-urlencoded"},
      method: 'post',
      param: param,
      url: '/unit'
    }).then(res => {
      console.log(res)
    })
  },
  //绑定列表
  handleBindListData(e) {
    console.log(e)
    let levelNumber = e.detail.unitlevel;
    //单位等级
    let sysParamItem = app.globalData.sysParam.filter(item => {
      return(item.paramKind.toLowerCase() == 'unitlevel' && item.paramCode == levelNumber+'')
    })
    console.log(sysParamItem[0].paramValue)
    this.setData({
      unitTable: e.detail,
      unitLevel: sysParamItem[0].paramValue
    })
  },
  //显示单位简介
  handleShowInfomation() {
    if(this.data.showInfomation == "none") {
      this.setData({
        showInfomation: "block"
      })
    }else {
      this.setData({
        showInfomation: "none"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取组件
    this.unitSearch = this.selectComponent("#unitSearch")
    // console.log(this.unitSearch)
    //组件查询方法
    // this.unitSearch.handleQuery();
    this.setData({
      appMenuList: app.globalData.menuList
    })
    // console.log(app.globalData.unitInfo)
    let levelNumber = app.globalData.unitInfo.unitlevel;
    //单位等级
    let sysParamItem = app.globalData.sysParam.filter(item => {
      return(item.paramKind.toLowerCase() == 'unitlevel' && item.paramCode == levelNumber+'')
    })
    // console.log(sysParamItem)
    // console.log(sysParamItem[0].paramValue)
    this.setData({
      unitTable: app.globalData.unitInfo,
      unitLevel: sysParamItem[0].paramValue
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