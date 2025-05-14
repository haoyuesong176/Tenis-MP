// pages/personal/personal.js
Page({
  data: {
    profileDict: {},
    scheduleItems: [{
        id: 1,
        time: '09:00',
        title: '篮球训练',
        location: '体育馆A区'
      },
      {
        id: 2,
        time: '12:30',
        title: '约球活动',
        location: '天元球场'
      },
      {
        id: 3,
        time: '15:00',
        title: '课程预约',
        location: '训练中心'
      },
      {
        id: 4,
        time: '18:30',
        title: '团队邀约',
        location: '滨江球场'
      }
    ]
  },

  onLoad() {
    this.getUserProfile();
  },

  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    this.setData({
      'profileDict.icon': avatarUrl // 更新页面显示的头像
    });

    wx.uploadFile({
      url: 'http://127.0.0.1:8000/course/api/update-user-icon/', // 你的后端接口
      filePath: avatarUrl,
      name: 'icon',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token'), // 若需要 token
        'Content-Type': 'multipart/form-data'
      },
      success(res) {
        const data = JSON.parse(res.data);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '头像上传成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.error('上传失败：', data);
        }
      },
      fail(err) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        console.error('上传失败：', err);
      }
    });
  },

  handleBookingTap() {
    wx.navigateTo({
      url: '/pages/mybooked/mybooked',
    });
  },

  handleTap() {
    console.log('模块点击事件');
  },

  getUserProfile(callback) {
    const url = `http://127.0.0.1:8000/course/api/user-profile/`;
    const that = this;
    const token = wx.getStorageSync('token');
  
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      success(res) {
        const data = res.data;
  
        // === 这里补全 icon 字段为完整 URL ===
        const host = 'http://127.0.0.1:8000';  // 可配置成变量
        if (data.icon && !data.icon.startsWith('http')) {
          data.icon = host + data.icon;  // 变成完整路径
        }
  
        that.setData({
          profileDict: data
        }, () => {
          console.log('User Profile fetched:', that.data.profileDict);
          if (typeof callback === 'function') {
            callback();
          }
        });
      },
      fail(err) {
        console.error('Failed to fetch user profile:', err);
      }
    });
  },
  

  // getUserProfile(callback) {

  //   const url = `http://127.0.0.1:8000/course/api/user-profile/`;
  //   const that = this;
  //   const token = wx.getStorageSync('token');

  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       'Authorization': 'Bearer ' + token,
  //       'Content-Type': 'application/json'
  //     },
  //     success(res) {
  //       const data = res.data;
  //       that.setData({
  //         profileDict: data
  //       }, () => {
  //         console.log('User Profile fetched:', that.data.profileDict);
  //         if (typeof callback === 'function') {
  //           callback();
  //         }
  //       });
  //     },
  //     fail(err) {
  //       console.error('Failed to fetch user profile:', err);
  //     }
  //   });
  // },
});