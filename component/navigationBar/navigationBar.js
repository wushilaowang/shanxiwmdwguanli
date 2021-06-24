// component/navigationBar.js
// let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList: {
      type: Array
    },
    showBar: Boolean,
    title: String,
    isLoginPage: Boolean,
  },
  
  
 //页面跳转
 handleMenuTransition(e) {
  // console.log(e)
  wx.switchTab({
    url: e.currentTarget.dataset.url,
  })
},
/**
 * 生命周期函数--监听页面加载
 */
lifetimes: {
  // created() {
  //   console.log(app.globalData.menu)
  //   console.log(app.globalData.rolePerm.menuIds)
  //   let menuList = app.globalData.menu
  //   let menuIds = app.globalData.rolePerm.menuIds
  //   let a = []
  //   menuList.map(item => {
  //     menuIds.forEach(item2 => {
  //       if(item2 == item.sysMenuId) {
  //         a.push(item)
  //       }
  //     })
  //   })
  //   let miniMenuList = []
  //   a.map(item => {
  //     app.globalData.miniMenu.map(item2 => {
  //       if(item2.name == item.menuName) {
  //         let key = "miniUrl";
  //         item[key] = item2.url
  //         miniMenuList.push(item)
  //       }
  //     })
  //   })
  //   this.setData({
  //     menuList: miniMenuList
  //   })
  //   console.log(this.data.menuList)
  // }
},
  /**
   * 组件的初始数据
   */
  data: {
    isShowMenu: false
  },
//返回
handleBackUpper() {
  this.triggerEvent('handleBack', {}, {composed: true})
  wx.navigateBack({
    delta: 1
  })
},
  /**
   * 组件的方法列表
   */
  methods: {
    //单个按钮返回
    handleSingleBack() {
      wx.navigateBack({
        delta: 1
      })
    },
    //返回
    handleBackUpper() {
      wx.navigateBack({
        delta: 1
      })
    },
    //点击菜单跳转
    handleMenuTransition(e) {
      // console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    //隐藏菜单
    handleHiddenMenu() {
      this.setData({
        isShowMenu: false
      })
    },
    handleShowMenu() {
      this.setData({
        isShowMenu: !this.data.isShowMenu
      })
    }
  },
})
