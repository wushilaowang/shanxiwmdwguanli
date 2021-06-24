

export default function request(options) {
  console.log(options.header)
  const baseUrl = 'https://shx.oupusoft.com/oupu_sxwmdw'//'http://yangling.shaanxiwenming.cn/oupu_sx';
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'get',
      header: options.header || {},
      data: options.data,
      success: function(res) {
        if(res.mesage == "不允许访问") {
          wx.showToast({
            title: '请重新登陆',
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else {
          resolve(res)
        }
      },
      fail: reject
    })
  })
}