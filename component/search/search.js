// component/search/search.js

import {queryUnknownUrl} from "../../service/login"

let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    queryUrl: String,
    showDate: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputVal: "",
    showList: false,
    currentPage: 1,
    totalPage: 1,
    queryList: Array,
    checkStatus: [],
    recordList: [],//审核记录
    showRecordList: false,//是否显示审核记录
    showAuditor: false,//
    date: new Date().getFullYear(),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //设置时间
    handleDateChange(e) {
      console.log(e.detail)
      this.setData({
        date: e.detail.value
      })
    },
    touchStartAutidor() {
      this.setData({
        showAuditor: true
      })
    },
    touchEndAutidor() {
      this.setData({
        showAuditor: false
      })
    },
    //复选框勾选值绑定
    handleCheckBoxChange(e) {
      this.setData({
        checkStatus: e.detail.value
      })
    },
    //关闭审核记录
    handleClose() {
      this.setData({
        showRecordList: false
      })
    },
    //审核记录
    handleRecord(e) {
      let param = {
        url: "/checkrecord/historyList/"+e.currentTarget.dataset.value
      }
      queryUnknownUrl(param).then(res => {
        // console.log(res)
        this.setData({
          recordList: res.data.data,
          showRecordList: true
        })
      })
    },
    //绑定input
    handleInputVal(e) {
      this.setData({
        inputVal: e.detail.value
      })
    },
    //清空输入框
    handleClear() {
      console.log(1)
      this.setData({
        inputVal: ''
      })
    },
    //已有单位名称跳转查询
    handleRedirectQuery(e) {
      this.setData({
        inputVal: e
      })
      this.handleQuery()
    },
    //查询
    async handleQuery() {
      // this.triggerEvent("query", {query: this.data.inputVal}, "")
      this.setData({
        currentPage: 1,
        showList: true
      })
      
        await this.bindQueryResult();
      // }
    },
    //绑定查询结果
    async bindQueryResult() {
      let that = this;
      let param = {
        url: this.properties.queryUrl,
        data: {
          _limit: 10,
          _page: this.data.currentPage,
          fullname: this.data.inputVal,
        }
      }
      //查询材料
      if(this.properties.queryUrl == "/stuff") {
        let arr = this.data.checkStatus;
        let resultUrl = ""
        if(arr.length > 0) {//如果审核状态有勾选
          resultUrl = arr.map(item => {
            return "status[]="+item
          }).join('&')
        }
        let result = {}
        let unitName = this.data.inputVal? this.data.inputVal: ''
        result.url = this.properties.queryUrl+"?" + resultUrl+"&_limit=10"+"&_page="+this.data.currentPage+"&unitname="+unitName+"&year="+this.data.date
        // console.log(param.url)
        await queryUnknownUrl(result).then(res => {
          console.log(res)
          //登陆过期没有权限
          if(res.data.status == 403){
            wx.showToast({
              title: res.data.data.message,
              icon: "none"
            })
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }else {
            this.setData({
              queryList: res.data.data.result,
              totalPage: res.data.data.totalPage
            }) 
          }
          
          
        })
      }else {
        //考核统计
        if(this.properties.queryUrl == "/checkrecord/assessCount/history"){
          param.data.unitName = this.data.inputVal
          param.data.year = this.data.date
        }
        await queryUnknownUrl(param).then(res => {
          console.log(res.data)
          this.setData({
            queryList: res.data.data.result,
            totalPage: res.data.data.totalPage
          }) 
          // console.log(this.data.queryList)
        })
      }
      //点击搜索,有结果返回列表第一个
      console.log(this.data.queryList)
      if(this.data.queryList.length > 0) {
        this.triggerEvent('itemClick', this.data.queryList[0]);
      }else {
        this.triggerEvent('itemClick', null)
      }
      
    },
    //上一页
    handlePreviousPage() {
      if(this.data.currentPage > 1) {
        this.setData({
          currentPage: this.data.currentPage - 1
        })
        this.bindQueryResult()
      }else {
        wx.showToast({
          title: '不能再往上翻了',
          icon: 'none'
        })
      }
    },
    //下一页
    handleNextPage() {
      if(this.data.currentPage < this.data.totalPage) {
        this.setData({
          currentPage: this.data.currentPage + 1
        })
        console.log(this.data.currentPage)
        this.bindQueryResult()
      }else {
        wx.showToast({
          title: '不能再往后翻了',
        })
      }
    },
    //显示列表
    handleShowList() {
      this.setData({
        showList: !this.data.showList
      })
    },
    //列表项点击
    handleItemClick(e) {
      console.log(e)
      this.triggerEvent("itemClick", e.currentTarget.dataset.value, "")
      // console.log(e.currentTarget.dataset.value.fullname)
      this.setData({
        showList: false,
        inputVal: e.currentTarget.dataset.value.fullname
      })
    },
    //更改输入框
    changeInput(e) {
      let that = this;
      that.setData({
        inputVal: e
      })
    }
  }
})
