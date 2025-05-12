// pages/tennis/tennis.js
Page({
  data: {
    navbarOpacity: 0,
    images: [
      '/images/court3.jpg',
      '/images/court2.jpg',
      '/images/court1.jpg',
    ],
    coaches: [
      { name: '教练A', img: '/images/coach1.jpg' },
      { name: '教练B', img: '/images/coach2.jpg' },
      { name: '教练C', img: '/images/coach3.jpg' }
    ],
    scrollTop: 0,
    opacity: 0,
    courtName: "坦尼斯网球俱乐部",
    distance: 11.5,
    venueAddress: "宝安区福永街道怀德西部商务大厦B区11楼"
  },

  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const maxScroll = 60; // 1/4屏幕高度
    let opacity = scrollTop / maxScroll;
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;

    this.setData({
      scrollTop,
      opacity: opacity.toFixed(2)  // 保留两位小数更平滑
    });
  },

  onBook() {
    wx.navigateTo({ url: '/pages/book/book' });
  },

  onMatch() {
    wx.navigateTo({ url: '/pages/match/match' });
  },

  makeCall() {
    wx.makePhoneCall({
      phoneNumber: '12345678900' // 替换成你的电话号码
    })
  },

  navigate() {
    wx.openLocation({
      latitude: 22.648295,      
      longitude: 113.830787,    
      name: '坦尼斯网球俱乐部',       
      address: '深圳市宝安区福永街道怀德西部商务大厦B区11楼' 
    })
  }

});
