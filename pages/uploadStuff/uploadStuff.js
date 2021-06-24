// pages/uploadStuff.js
const app = getApp()
import {requestGet, requestPost} from '../../service/login'
import {md5} from '../../utils/md5'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    assess: null,
    showAssess: false,
    currentChoseAssess: '', //当前选择的标准
    title: '',  //标题
    fileNameArr: [],  //插入文件时的路径文件名信息
    videoPath: [], //视频路径
    editorCtx: null, // 编辑器
  },
  //点击标准按钮显示标准
  handleClickAssess() {
    console.log(this.data.assess)
    this.setData({
      showAssess: true
    })
  },
  //标题
  handleTitleChange(e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  //保存
  handleSave() {
    let that = this
    console.log(this.data.title + this.data.currentChoseAssess)
    if(this.data.title == '' || this.data.currentChoseAssess == '') {
      wx.showToast({
        title: '标题未填写或标准未选择',
        icon: 'none'
      })
    } else {
      this.editorCtx.getContents({
        success: res=> {
          console.log(res)
          //视频
          for(let i = 0; i < that.data.videoPath.length; i ++){
            if(res.html.indexOf('$video$') != -1) {
              let str1 = res.html.replace('$video$', `\n<video class="video-iframe" height="180" width="320" style="border:none"
               controls="" src="https://shx.oupusoft.com/oupu_sxwmdw/upload/show/${that.data.videoPath[i]}"></video>\n`);
              res.html = str1;
            }
          }

          let reg = / wx:nodeid="[0-9]*"/g
          let regString = res.html.replace(reg, '')
          //附件
          that.data.fileNameArr.forEach(item => {
            console.log(regString.indexOf(item.name))
            if(regString.indexOf(item.name) != -1) {
              regString = regString.replace('<a>'+item.name+'</a>', '<a href="http://shx.oupusoft.com/oupu_sxwmdw' + item.path + '" title="'+item.name+'" target="_blink">'+item.name+'</a>')
              console.log(regString)
            }
          })
          let encodeString = encodeURIComponent(regString)
          let base64 = new md5()
          console.log(regString)
          let base64String = 'base64String:' + base64.encode(encodeString)
          
          requestPost({url: '/stuff', method: 'POST', param: {
            name: that.data.title,
            content: base64String,
            state: 1,
            assessid: that.data.currentChoseAssess.assessid
          }
          }).then(res => {
            console.log(res)
            if(res.data.message == '请求成功！') {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                title: res.data.message.split(':')[1],
                icon: 'none',
                duration: 3000
              })
            }
            
            
          })
          
          
        },
        fail: err => {
          console.log(err)
        }
      })
    } 
  },
  
  //上传
  handleUpload() {
    let that = this
    console.log(this.data.title + this.data.currentChoseAssess)
    if(this.data.title == '' || this.data.currentChoseAssess == '') {
      wx.showToast({
        title: '标题未填写或标准未选择',
        icon: 'none'
      })
    } else {
      this.editorCtx.getContents({
        success: res=> {
          //上传视频
          for(let i = 0; i < that.data.videoPath.length; i ++){
            if(res.html.indexOf('$video$') != -1) {
              let str1 = res.html.replace('$video$', `\n<video class="video-iframe" height="180" width="320" style="border:none"
              controls="" src="https://shx.oupusoft.com/oupu_sxwmdw/upload/show/${that.data.videoPath[i]}"></video>\n`);
              res.html = str1;
            }
          }
          //上次附件
          console.log(res)
          let reg = / wx:nodeid="[0-9]*"/g
          let regString = res.html.replace(reg, '')
          that.data.fileNameArr.forEach(item => {
            console.log(regString.indexOf(item.name))
            if(regString.indexOf(item.name) != -1) {
              regString = regString.replace('<a>'+item.name+'</a>', '<a href="http://shx.oupusoft.com/oupu_sxwmdw' + item.path + '" title="'+item.name+'" target="_blink">'+item.name+'</a>')
              console.log(regString)
            }
          })
          let encodeString = encodeURIComponent(regString)
          let base64 = new md5()
          console.log(regString)
          let base64String = 'base64String:' + base64.encode(encodeString)
          
          requestPost({url: '/stuff', method: 'POST', param: {
            name: that.data.title,
            content: base64String,
            state: 2,
            assessid: that.data.currentChoseAssess.assessid
          }
          }).then(res => {
            console.log(res)
            if(res.data.message == '请求成功！') {
              wx.showToast({
                title: '上传成功',
                icon: 'none'
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                title: res.data.message.split(':')[1],
                icon: 'none',
                duration: 3000
              })
            }
            
            
          })
          
          
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
    console.log(editorHeight)
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.editorCtx.setContents({ html: '' })
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  //插入图片
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 5,
      success: function(res) {
        console.log(res.tempFiles)
        //测试直接插入图片
        // that.editorCtx.insertImage({
        //   src: 'https://shx.oupusoft.com/oupu_sxwmdw/upload/885127',
         
        //   width: '50%',
        //   success: function () {
        //     console.log('insert image success')
        //   }
        // })
        // that.editorCtx.insertText({
        //   text: '\n'
        // })
        wx.uploadFile({
          filePath: res.tempFiles[0].path,
          name: 'upfile',
          url: 'https://shx.oupusoft.com/oupu_sxwmdw/upload/ueditorUpload?action=uploadimage&user_id=' + app.globalData.unitInfo.unitid,
          header: {
            "cookie": wx.getStorageSync('token'),
          },  
          success: result => {
            console.log(result)
            console.log(JSON.parse(result.data))
            let img = {name: res.tempFiles[0].name, path: JSON.parse(result.data).url}
            // console.log(a)
            that.editorCtx.insertImage({
              src: 'https://shx.oupusoft.com/oupu_sxwmdw' + img.path,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '50%',
              success: function () {
                console.log('insert image success')
                that.editorCtx.insertText({
                  text: '\n'
                })
              }
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
    
  },

  //获取editor html内容
  getEditorHtml() {
    console.log(12345)
    let that = this;
    wx.createSelectorQuery().select('#editor').context(function (res) {
      console.log(res.context)
  })
},
  //上传视频
  handleVideoUpload() {
    let that = this
    wx.chooseVideo({
      maxDuration: 10,
      success: function(res) {
        console.log(res)
        let suffixe = res.tempFilePath.substring(res.tempFilePath.length-3, res.tempFilePath.length -1);
        if((suffixe.toLowerCase != 'mov' || suffixe.toLowerCase != 'mp4') && res.size > 1024 * 1024 * 60) {
          wx.showToast({
            title: '请选择60M以下的mov或mp4文件',
            icon: 'none'
          })
        }
        wx.showLoading({
          title: '文件上传中',
          mask: true
        })
        wx.uploadFile({
          filePath: res.tempFilePath,
          name: 'upfile',
          url: 'https://shx.oupusoft.com/oupu_sxwmdw/upload/ueditorUpload?action=uploadvideo&encode=utf-8&user_id=' + app.globalData.unitInfo.unitid,
          header: {
            "cookie": wx.getStorageSync('token'),
          },  
          success: result => {
            console.log(JSON.parse(result.data).url.split('/')[2])
            wx.hideLoading()
            const query = wx.createSelectorQuery()
            console.log(query.select('#editor'))
            console.log(that.getEditorHtml())
            //editor中插入文件名
            that.editorCtx.getContents({
              success: res => {
                console.log(res)
                that.editorCtx.setContents({
                  // html: res.html + '\n<video class="video-iframe" height="180" width="320" style="border:none" controls="" src="https://shx.oupusoft.com/oupu_sxwmdw/upload/show/'+JSON.parse(result.data).url.split('/')[2]+'"></video>\n'
                  
                  html: res.html + '\n$video$'
                })
                //编辑器无法显示视频,视频路径存入,
                let videoPathArr = that.data.videoPath;
                videoPathArr.push(JSON.parse(result.data).url.split('/')[2]);
                that.setData({
                  videoPath: videoPathArr,
                })
                that.editorCtx.blur(); //失去键盘焦点
              }
            })
            console.log(result)
            let arr = that.data.fileNameArr
            arr.push({name: res.tempFilePath, path: JSON.parse(result.data).url})
            console.log(arr)
            console.log(that.data.fileNameArr)
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: function(err) {
        console.log(err)
      }
    
    })
  },

  //上传文件
  insertFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: function(res) {
        console.log(res.tempFiles)
        let fileNmae = res.tempFiles[0].name
        let fileNameArr = fileNmae.split('.');
        if(fileNameArr[fileNameArr.length - 1].toLowerCase != 'pdf' && res.tempFiles[0].size > 1024 * 1024 * 10) {
          wx.showToast({
            title: '请选择10M以下的pdf文件',
            icon: 'none'
          })
        } else {
        wx.showLoading({
          title: '文件上传中',
          mask: true
        })
        wx.uploadFile({
          filePath: res.tempFiles[0].path,
          name: 'upfile',
          url: 'https://shx.oupusoft.com/oupu_sxwmdw/upload/ueditorUpload?action=uploadfile&encode=utf-8&user_id=' + app.globalData.unitInfo.unitid,
          header: {
            "cookie": wx.getStorageSync('token'),
          },  
          success: result => {
            console.log(result)
            wx.hideLoading()
            const query = wx.createSelectorQuery()
            console.log(query.select('#editor'))
            //editor中插入文件名
            that.editorCtx.getContents({
              success: res => {
                console.log(res)
                that.editorCtx.setContents({
                  html: res.html + '\n<a>' + fileNmae + '</a>\n'
                })
                that.editorCtx.blur()
              }
            })
            console.log(result)
            let arr = that.data.fileNameArr
            arr.push({name: res.tempFiles[0].name, path: JSON.parse(result.data).url})
            console.log(arr)
            console.log(that.data.fileNameArr)
          },
          fail: err => {
            console.log(err)
          }
        })
      }
      },
      fail: function(err) {
        console.log(err)
      }
    
    })
  },
  //点击标准
  handleChoseAssess(e) {
    console.log(e.detail)
    // console.log(e.currentTarget.dataset.assessid.assess.assessid)
    this.setData({
      currentChoseAssess: e.detail,
      showAssess: false,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onEditorReady();
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    });
    //获取当前单位类型的标准根id
    const assessIds = []
    requestGet({url: '/ruleapp/currentUnit', method: 'get'}).then(res =>{
      // console.log(res.data)
      res.data.data.forEach(item => {
        assessIds.push(item.assessid)
      })
      return requestGet({url: '/assessrule?year=' + new Date().getFullYear(), method: "get"})
    }).then(res => {
      console.log(res)
      let parent = []
      console.log(assessIds)
      assessIds.forEach(item => {
        res.data.data.forEach(item1 => {
          if(item == item1.assessid) {
            let childArr =[]
            res.data.data.forEach(item2 => {
              if(item2.parent == item1.assessid) {
                let grandChildren = []
                res.data.data.forEach(item3 => {
                  if(item3.parent == item2.assessid) {
                    let grandgrandChildren = []
                    res.data.data.forEach(item4 => {
                      if(item4.parent == item3.assessid) {
                        grandgrandChildren.push({assess: item4, spread: false, children: []})
                      }
                    })
                    grandChildren.push({assess: item3, spread: false, children: grandgrandChildren})
                  }
                })
                childArr.push({assess: item2, spread: false, children: grandChildren})
              }
            })
            parent.push({assess: item1, spread: false, children: childArr})
          }
        })
      })
      console.log(parent)
      //标准排序
      function compare(arg) {
        return function(a, b) {
            return a['assess'][arg] - b['assess'][arg];
        }
      }
      for(let i = 0; i < parent.length; i++) {
        if(parent[i].children.length > 1) {
          parent[i].children.sort(compare('sortidx'))
          for(let j = 0; j < parent[i].children.length; j++) {
            if(parent[i].children[j].children.length > 0) {
              parent[i].children[j].children.sort(compare('sortidx'))
              for(let k = 0; k < parent[i].children[j].children.length; k++) {
                if(parent[i].children[j].children[k].children.length > 0) {
                  parent[i].children[j].children[k].children.sort(compare('sortidx'))
                }
              }
            }
          }
        }
      }
      that.setData({
        assess: parent
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