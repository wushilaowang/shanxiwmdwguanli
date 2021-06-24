// pages/assessCount/assessCount.js
import {assessCount} from '../../service/login'
import {assessCountByQuery} from '../../service/stuff'
let app = getApp()

Page({
    //手指离开隐藏单位全称
    touchEndUnit() {
      this.setData({
        showUnitName: false
      })
    },
    //显示单位全称
    touchStartUnit() {
      this.setData({
        showUnitName: true
      })
    },
    //绑定单位数据
    handleBindListData(e) {
      console.log(e)
      if(e.detail != null) {
        this.setData({
          listData: e.detail,
          currentUnit: e.detail,
          currentUnitId: e.detail.unitid,
          currentUnitType: e.detail.type,
          shwoDetail: 'block'
        })
      }else {
        this.setData({
          listData : null,
        })
      }
    },
    //查看详情
    handleDetail() {
      wx.navigateTo({
        url: '/pages/stuff/stuff?unitId=' + this.data.currentUnit.unitid + '&unitType=' + this.data.currentUnit.type + '&unitName=' + this.data.currentUnit.fullname  ,
      })
    },
   
  /**
   * 页面的初始数据
   */
  data: {
    queryUrl: "/checkrecord/assessCount/history",
    showBar: true,//是否显示头部栏返回/菜单按钮
    currentUnit: {},
    appMenuList: {},//导航菜单
    listData: null,//分数列表
    queryResultList: null,//查询结果list
    shwoDetail: 'none',
    showUnitName: false,
  },
  
  
  
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否为普通用户
    let hasNormalUnit = false;
    app.globalData.user.roles.map(item => {
      if(item == "材料上报管理员") {
        hasNormalUnit = true;
      }
    })
    if(hasNormalUnit) {
      //获取组件
      this.countSearch = this.selectComponent("#countSearch")
      //组件查询方法
      this.countSearch.handleQuery();
      assessCount().then(res => {
        // console.log(res)
        this.setData({
          appMenuList: app.globalData.menuList,
          listData: res.data.data[0],
          currentUnit: res.data.data[0],
          currentUnitId: res.data.data[0].unitid,
          currentUnitType: res.data.data[0].type,
          shwoDetail: 'block'
        })
        // console.log(res.data.data[0])
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