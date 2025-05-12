// pages/personal/personal.js
Page({
  data: {
    scheduleItems: [
      { id: 1, time: '09:00', title: '篮球训练', location: '体育馆A区' },
      { id: 2, time: '12:30', title: '约球活动', location: '天元球场' },
      { id: 3, time: '15:00', title: '课程预约', location: '训练中心' },
      { id: 4, time: '18:30', title: '团队邀约', location: '滨江球场' }
    ]
  },

  handleTap() {
    console.log('模块点击事件');
  }
});