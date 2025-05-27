const request = require('../../utils/request').default;

Page({
    data: {
        profileDict: {},
        todaySchedule: [],
    },

    onShow() {
        this.getUserProfile(() => {
            this.getTodaySchedule();
        });
    },

    getTodaySchedule(e) {
        const that = this;

        request(`${getApp().globalData.ip_addr}/course/api/user-today-schedule/`, {
                method: 'GET',
            })
            .then(res => {
                wx.hideLoading();

                if (res.statusCode === 200) {
                    const scheduleList = res.data.map(item => {
                        const startTime = item.time;
                        const endTime = that.getNextHalfHour(startTime);
                        return {
                            ...item,
                            formattedTime: `${startTime} - ${endTime}`
                        };
                    });

                    that.setData({
                        todaySchedule: scheduleList
                    });

                    console.log(that.data.todaySchedule);
                } else {
                    wx.showToast({
                        title: '加载日程失败',
                        icon: 'none'
                    });
                    console.error('获取日程失败:', res);
                }
            })
            .catch(err => {
                wx.hideLoading();
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
                console.error('请求失败:', err);
            });
    },

    handleBookedTap() {
        wx.navigateTo({
            url: '/pages/mybooked/mybooked',
        });
    },

    handleMatchingTap() {
        wx.navigateTo({
            url: '/pages/mymatching/mymatching',
        });
    },

    handleMatchedTap() {
        wx.navigateTo({
            url: '/pages/mymatched/mymatched',
        });
    },

    handleTap() {
        console.log('模块点击事件');
    },

    handleSettingsTap() {
        wx.navigateTo({
            url: '/pages/settings/index/index',
        });
    },

    getUserProfile(callback) {
        const that = this;
        const url = `${getApp().globalData.ip_addr}/course/api/user-profile/`;

        request(url, {
                method: 'GET',
            })
            .then(res => {
                const data = res.data;

                // === 这里补全 icon 字段为完整 URL ===
                const host = getApp().globalData.ip_addr;
                if (data.icon && !data.icon.startsWith('http')) {
                    data.icon = host + data.icon; // 变成完整路径
                }

                that.setData({
                    profileDict: data
                }, () => {
                    console.log('User Profile fetched:', that.data.profileDict);
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            })
            .catch(err => {
                console.error('Failed to fetch user profile:', err);
            });
    },


    getNextHalfHour(time) {
        const [hour, minute] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute + 30);

        const nextHour = String(date.getHours()).padStart(2, '0');
        const nextMinute = String(date.getMinutes()).padStart(2, '0');

        return `${nextHour}:${nextMinute}`;
    },

});