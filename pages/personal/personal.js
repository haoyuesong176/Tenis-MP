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
});