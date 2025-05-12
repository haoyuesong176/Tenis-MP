const { request } = require("utils/request");

Page({
  data: {
    agreed: false,
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  openPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy',
    });
  },

  openTerms() {
    wx.navigateTo({
      url: '/pages/terms/terms',
    });
  },

  login() {
    wx.login({
      success: (res) => {
        const code = res.code;
        if (code) {
          // 把 code 发给后端服务器换取 token
          request("/wx-login/", "POST", { code })
            .then(response => {
              // 后端返回的 token
              const token = response.access;

              // 存到本地
              wx.setStorageSync("token", token);

              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });

              // 跳转到主页或其他页面
              console.log("hello")
              wx.switchTab({
                url: '/pages/tennis/tennis',
              });
            })
            .catch(err => {
              console.error("登录失败:", err);
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            });
        } else {
          console.error("wx.login 未获取到 code");
        }
      },
      fail: () => {
        wx.showToast({
          title: 'wx.login 调用失败',
          icon: 'none'
        });
      }
    });
  },

  onLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意协议',
        icon: 'none',
      });
      return;
    }

    this.login()
  }

});
