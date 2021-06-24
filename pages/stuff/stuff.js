// pages/stuff/stuff.js
import {ruleapp, rule, checkStatus} from '../../service/stuff'
import {getRule} from '../../utils/util'
import {unitQuery, countDetail} from '../../service/login'

let app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showBar: true,
    queryUrl: "/unit",
    appMenuList: {},
    currentUnitId: 0,
    currentUnitName: '',
    stuffList: null,
    currentIndex: 0,
    showUnitQueryList: "none",
  },
  //
  handleBindListData(e) {
    console.log(e)
    if(e.detail != null) {
      this.loadAssess(e.detail);
      this.setData({
        currentUnitName: e.detail.fullname,
      })
    }else {
      this.setData({
        stuffList : null,
        currentUnitName: '',
      })
    }
  },
  //加载考核标准方法
  loadAssess(value) {
    let assessid = null;
    let detail = null;
    let checkStatusData = null;
    let ruleResult = null;
    Promise.all([ruleapp(), checkStatus(value.unitid), countDetail(value.unitid), rule()]).then(res => {
      if(value.type == 2) {
        wx.showToast({
          title: '文明村没有标准',
          icon: 'none'
        })
        this.setData({
          stuffList : null,
        })
        return
      }
      res[0].data.data.forEach((item) => {
        if(item.unittype == value.type) {
          assessid = item.assessid
        }
      });//标准id
      checkStatusData = res[1].data.data;//材料状况(带上报,审核中,归档)
      detail = res[2].data.data;//有得分的标准情况(总分,当前得分,分数类型)
      ruleResult = res[3].data.data;//查所有标准
      let rule = getRule(ruleResult, assessid);//数据整理
      if(rule.length > 1) {
        // console.log(rule);
        let temp = {}
        for(let i = 0; i < rule[1].length-1; i++) {
          for(let j=i+1; j<rule[1].length;j++) {
            if(rule[1][i].sortidx>rule[1][j].sortidx) {
              temp = rule[1][i];
              rule[1][i] = rule[1][j];
              rule[1][j] = temp
            }
          }
        }
        // console.log(rule[0]);
        rule[1].forEach(function (el, index) {
            el.item2.forEach(function (ele, nu) {
                //放入标准得分
                console.log(detail)
                detail.forEach(function (elem,num) {
                    if(elem.assessid == ele.assessid){
                        ele.earnScore = (ele.earnScore + elem.earnScore) > elem.totalscore ? elem.totalscore : (ele.earnScore + elem.earnScore)
                        el.singleScore += elem.earnScore
                    }
                });
                checkStatusData.forEach(function (eleme, numb) {
                  if(ele.assessid == eleme.assessid) {
                      ele.checkStatus = eleme.shenHeZhong
                  }
                })
            })
            rule[0].countScore += el.singleScore
        })
        this.setData({
          stuffList: rule 
        })
        // console.log(rule[0])
      }
    }).catch(err => {
      // console.log(err)
    })
  },
 

 
  //是否显示子材料和得分
  handleShowChild(event) {
    if(this.data.currentIndex == event.currentTarget.dataset.id) {
      this.setData({
        currentIndex: 0
      })
    }else {
      this.setData({
        currentIndex: event.currentTarget.dataset.id
      })
    }
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    //找到search组件
    this.detailSearch = this.selectComponent("#detailSearch")
    //执行查询
    this.detailSearch.handleQuery()
    //更改输入框的值
    if(options.unitName) {
      this.detailSearch.changeInput(options.unitName)
    }
    // console.log(app.globalData.unitInfo.unitid)
    this.setData({
      appMenuList: app.globalData.menuList,
      currentUnitId: options ? options.unitId : app.globalData.unitInfo.unitid,
      currentPage: 1,
      totalPage: 1
    })
    // console.log(this.data.currentUnitId)
    this.loadAssess({
      unitid: options.unitId,
      type: options.unitType
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
  onUnload: function (options) {

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