// 手动拼接FormData字符串
// 函数边界处理没怎么做，各位可自行补充
// 数组和obj的情况没有处理，可以用postman发个请求看看格式，很简单的
function createFormData(params = {}, boundary = '') {
  let result = '';
  for (let i in params) {
    result += `\r\n--${boundary}`;
    result += `\r\nContent-Disposition: form-data; name="${i}"`;
    result += '\r\n';
    result += `\r\n${params[i]}`
  }
  // 如果obj不为空，则最后一行加上boundary
  if (result) {
    result += `\r\n--${boundary}`
  }
  return result
}

// 通用post请求
export const formDataPost = function (url, params) {
  return new Promise(function (resolve, reject) {
    // 生成一个boundary字符串
    const boundary = `----FooBar${new Date().getTime()}`;
    const formData = createFormData(params, boundary);
    console.log(formData);
    wx.request({ // 这里我用的taro，改成wx.request也一样
      url,
      method: 'POST',
      credentials: 'include', //设置传递cookies
      dataType: 'json',
      header: {
        "cookie": wx.getStorageSync('token'),
        'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`//`multipart/form-data; boundary=${boundary}`,
      },
      data: formData,
      timeout: 5000,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (error) {
        reject(error);
      }
    })
  });
}