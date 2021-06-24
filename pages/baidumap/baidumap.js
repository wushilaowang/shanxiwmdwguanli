// pages/baidumap/baidumap.js
//NGJBZ-5CA3K-HBMJP-AU4RT-UKHQT-UWFA6

const chooseLocation = requirePlugin('chooseLocation');
let app = getApp()
import {unitQuery, queryUnknownUrl, surroundLocation, requestGet} from '../../service/login'
Page({
  //地图选点
  chooseLocation1() {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        const key = 'NGJBZ-5CA3K-HBMJP-AU4RT-UKHQT-UWFA6'; //使用在腾讯位置服务申请的key
        const referer = '文明单位路线规划'; //调用插件的app的名称
        // console.log(res)
        const location = JSON.stringify({
          latitude: res.latitude,
          longitude: res.longitude
        });
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
        });
      }
    })
  },
  //回到自己位置
  handleGoOrigin() {
    this.wxmap = wx.createMapContext('map')
    this.wxmap.moveToLocation()
  },
  //圈
  getCenterLocation(data) {
    this.wxmap = wx.createMapContext('map')
    var that=this;
    this.wxmap.getCenterLocation({
      success(res) {
        that.setData({
            circles: [{
            radius: 5000,
            longitude: data.longitude,
            latitude: data.latitude,
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            strokeWidth: 0.2
          }]
        });
      }
    })
  },
  
  
  //监听页面加载
  onLoad() {
    //菜单数据
    this.setData({
      appMenuList: app.globalData.menuList
    })
    let that = this
    //绑定区域数据
    this.getArea()
    //获得当前定位,地图上自己的点
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getCenterLocation(res);
        // let param = {};
        // param = {
        //   data: {
        //     latitude: res.latitude,
        //     longitude: res.longitude,
        //     radius: 5000
        //   }
        // }
        //查询周围单位
        // surroundLocation(param).then(res => {
        //   console.log(res);
        //   let markList = []
        //   res.data.data.map(item => {
        //     markList.push({
        //       title: item.fullname,
        //       iconPath: "/assets/image/other/mark.png",
        //       id: item.unitid,
        //       longitude: item.longitude,
        //       latitude: item.latitude,
        //       callout: {
        //         content: item.fullname+'\n联系人：'+item.publicman+'\n联系方式：'+item.publicmantel+'\n地址：'+item.address,
        //         borderWidth: 1,
        //         padding: 5,
        //         borderRadius: 4
        //       },
        //       width: 30,
        //       height: 30
        //     })
        //   })
        //   // console.log(markList)
        //   that.setData({
        //     markers: markList
        //   })
        // })
      },
      fail: function(res) {
        // console.log(res)
        wx.showToast({
          title: '获取定位失败,请清除小程序缓存',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  //绑定查询input的值
  getInputValue(e) {
    // console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  //picker值改变
  bindMultiPickerChange: function (e) {
    // console.log(e)
    this.setData({
      multiIndex: [e.detail.value[0], e.detail.value[1]]
    })
    if(e.detail.value[0] != 0) {//选择的是陕西省
      // console.log(e.detail.value[0])
      let key = e.detail.value[0]
      // console.log(this.data.areaResultList[key])
      //市districtid
      this.data.areaResultList[key][1].parentId
      //区districtid
      // console.log(this.data.areaResultList[key][e.detail.value[1]].id)
      if(this.data.areaResultList[key][e.detail.value[1]].id != 0) {//选择了区级
        this.setData({
          areaDistrictId : this.data.areaResultList[key][e.detail.value[1]].id
        })
      }else {//未选区级
        let shiDistriceArray = 
        this.data.areaResultList[key].map(item => {
          return item.id
        })
        // console.log(shiDistriceArray)
        shiDistriceArray.shift()
        this.setData({
          areaDistrictId : shiDistriceArray
        })
      }
    }else {
      this.setData({
        areaDistrictId: ''
      })
    }
  },
  //picker列改变
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
    if(e.detail.column == 0) {
      let a = this.data.multiArray
      if(e.detail.value != 0) {
        a[1] = this.data.areaResultList[e.detail.value].map(item => {
          return item.name
        })
     }else {
       a[1] = []
     }
      console.log(a)
      this.setData({
        multiArray: a
      })
    }
  },
  //选择地区
  getArea() {
    // console.log(app.globalData.area)
    let level2 = [['陕西省']]
    let level3 = []
    let level4 = {}
    app.globalData.area.map((item, index) => {
      //取出area中市级作为列1
      if(item.districtParent == 1) {
        level2.push(item.districtName)
        let key = index
        level4[key] = []
        app.globalData.area.map(item2 => {
          if(item.districtId == item2.districtParent) {
            // level3.push(item2.districtName)
            //{市级index:[{name:县级名, id:districtId]}
            level4[key].push({name: item2.districtName, id: item2.districtId, parentId: item.districtId})
          }
        })
        level4[key].unshift({name: '选择全部', id: 0})
      }
    })
    // console.log(level4)
    
    let arrayList = []
    // console.log([])
    arrayList.push(level2);
    arrayList.push([])
    this.setData({
      area: app.globalData.area,
      multiArray: arrayList,
      areaResultList: level4
    })
    console.log(arrayList)
  },
  //mark点击
  markertap(e) {
    // console.log(e)
    this.data.markers.map(item => {
      if(item.id ==e.markerId) {
        console.log(item)
        this.setData({
          isShowGoThere: "block",
          currentMarker: item,
        })
      }
    })
    
  },
  //显示隐藏 往年成绩 查看材料
  handleShowDetail() {
    if(this.data.isShowDetail == 'none') {
      this.setData({
        isShowDetail: "block",
      })
    } else {
      this.setData({
        isShowDetail: "none",
      })
    }
  },
  //查看材料
  handleGoQueryStuff() {
    wx.navigateTo({
      url: '/pages/queryStuff/queryStuff?name=' + this.data.currentMarker.title,
    })
  },
  //关闭往年成绩
  handleGradeClose() {
    this.setData({
      isShowGrade: 'none'
    })
  },
  //查询往年成绩
  async handleBeforeGrade() {
    let grades = []
    wx.showLoading({
      title: '加载中',
    })
    await requestGet({method: 'GET', url: "/checkrecord/assessCount/history", param: {
      year: new Date().getFullYear(),
      unitName: this.data.currentMarker.title,
      _limit: 10, 
      page:1
    }
    }).then(res => {
      console.log(res)
      if(res.data.data.length == 1) {
        grades.push(res.data.data[0])
        
      wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '查询成绩失败',
          icon: 'none'
        })

      }
    })
    await requestGet({method: 'GET', url: "/checkrecord/assessCount/history", param: {
        year: new Date().getFullYear() - 1,
        unitName: this.data.currentMarker.title,
        _limit: 10, 
        page:1
      }
    }).then(res => {
      console.log(res)
      if(res.data.data.length == 1) {
        grades.push(res.data.data[0])
      } else {
        wx.showToast({
          title: '查询成绩失败',
          icon: 'none'
        })
      }
    })
    await requestGet({method: 'GET', url: "/checkrecord/assessCount/history", param: {
        year: new Date().getFullYear() - 2,
        unitName: this.data.currentMarker.title,
        _limit: 10, 
        page:1
      }
    }).then(res => {
      console.log(res)
      if(res.data.data.length == 1) {
        grades.push(res.data.data[0])
      } else {
        wx.showToast({
          title: '查询成绩失败',
          icon: 'none'
        })
      }
    })
    console.log(grades)
    if(grades.length > 0) {
      this.setData({
        beforeYearsGrade: grades,
        isShowGrade: 'block'
      })
    }
  },
  //隐藏到这里去
  handleHiddenGothere() {
    if(this.data.isShowGoThere == 'block') {
      this.setData({
        isShowGoThere: "none",
      })
    }
  },
  //到这里去
  handleGoThere() {
    let plugin = requirePlugin('routePlan');
    let key = 'NGJBZ-5CA3K-HBMJP-AU4RT-UKHQT-UWFA6';  //使用在腾讯位置服务申请的key
    let referer = 'CivilizationScoreQuery';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': this.data.currentMarker.title,
        'latitude': this.data.currentMarker.latitude,
        'longitude': this.data.currentMarker.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  //获取单位地图数据
  handleQueryUnit() {
    let param = {
      fullname: this.data.inputValue,
      _page: 1,
      _limit: 40,
      state: 1,
    };
    
    let result = []
    if(this.data.areaDistrictId.length > 1) {
      let result = {};
      let realUrl = "/unit?funllname="+this.data.inputValue+"&_page=1&_limit=40&state=1"
      let district = this.data.areaDistrictId.map(item => {
        return "districtids[]="+item
      }).join("&")
      realUrl = realUrl + "&" + district
      result.url = realUrl
      // console.log(district)
      queryUnknownUrl(result).then(res => {
        // console.log(res)
        result = res.data.data.result
        this.setMapData(result)
      })
    }else {
      if(this.data.areaDistrictId != 0) {
        param['districtids[]'] = this.data.areaDistrictId
      }
      unitQuery(param).then(res => {
        // console.log(res.data.data.result)
        result = res.data.data.result
        this.setMapData(result)
      })
    }
  },
  //
  setMapData(result) {
    let markList = []
      //单位的地图信息
      result.map((e, i) => {
        if(e.coordinate.length > 10 && e.coordinate.length < 34) {
          let longitude = ''
          let latitude = ''
          if(e.coordinate.indexOf('	') != -1) {
            latitude = e.coordinate.split('	')[1].trim();
            longitude = e.coordinate.split('	')[0].trim();
            // console.log(latitude+" "+longitude)
          }else {
            latitude = e.coordinate.split(',')[1];
            longitude = e.coordinate.split(',')[0]
          }
          markList.push({
            title: e.fullname,//+'\n联系人：'+e.publicman+'\n联系方式：'+e.publicmantel+'\n地址：'+e.address,
            iconPath: "/assets/image/other/mark.png",
            id: e.unitid,
            longitude: longitude,
            latitude: latitude,
            callout: {
              content: e.fullname+'\n联系人：'+e.publicman+'\n联系方式：'+e.publicmantel+'\n地址：'+e.address,
              borderWidth: 1,
              padding: 5,
              borderRadius: 4
            },
            width: 30,
            height: 30
          })
        }
     })
     console.log(markList)
     
     if(markList.length < 1) {
      wx.showToast({
        title: '查询不到当前位置信息',
        icon: "none",
        duration: 1500
      })
        this.setData({
          markers: null,
          longitude: null,
          latitude: null,
        })
     }else {
      this.setData({
        markers: markList,
        longitude: markList[0].longitude,
        latitude: markList[0].latitude
      })
    }
  },
  data: {
    showBar: true,
    currentMarker: {},
    isShowGoThere: "none",
    isShowDetail: 'none',
    beforeYearsGrade: [],
    isShowGrade: 'none',
    longitude: 108.835576,
    latitude: 34.526733,
    areaDistrictId: 0,
    inputValue: '',
    multiArray: [['陕西省']],
    multiIndex: [0, 0],
    area: null,
    areaResultList: null,
    markers: [{
      iconPath: "/assets/image/other/mark.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 30,
      height: 30
    }],
    circles:[{
      latitude: '108.93984',
      longitude: '34.34127',
      color: '#FF0000DD',
      fillColor: '#7cb5ec88',
      radius: 200,
      strokeWidth: 1
    }],
    mapHeight: 80
  },
  onShow() {
    const location = chooseLocation.getLocation();
    // console.log(location != null && location)
  }
})