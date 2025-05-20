// utils/request.js：封装网络请求
const BASE_URL = "http://192.168.1.2:8000/course/api";  
// const BASE_URL = "http://127.0.0.1:8000/course/api";

function request(url, method = "GET", data = {}, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => reject(err)
    });
  });
}

module.exports = {
  request
};
