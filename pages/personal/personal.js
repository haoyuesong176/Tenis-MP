// pages/personal/personal.js
Page({
    data: {
        ip_addr: "http://192.168.1.2:8000",
        // ip_addr: "http://127.0.0.1:8000",
        profileDict: {},
        todaySchedule: [],
    },

    onLoad() {
        this.getUserProfile();
    },

    onShow() {
        this.getTodaySchedule();
    },

    getTodaySchedule(e) {
        const that = this;
    
        wx.request({
            url: `${this.data.ip_addr}/course/api/user-today-schedule/`,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                'Content-Type': 'application/json'
            },
            success(res) {
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
            },
            fail(err) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
                console.error('请求失败:', err);
            }
        });
    },

    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail;
        this.setData({
            'profileDict.icon': avatarUrl // 更新页面显示的头像
        });

        wx.uploadFile({
            // url: 'http://127.0.0.1:8000/course/api/update-user-icon/', 
            url: `${this.data.ip_addr}/course/api/update-user-icon/`,
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

    getUserProfile(callback) {
        // const url = `http://127.0.0.1:8000/course/api/user-profile/`;
        const url = `${this.data.ip_addr}/course/api/user-profile/`;
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
                // const host = 'http://127.0.0.1:8000'; 
                const host = that.data.ip_addr; 
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
            },
            fail(err) {
                console.error('Failed to fetch user profile:', err);
            }
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