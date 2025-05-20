Component({

    data: {
        // ip_addr: "http://172.17.13.136:8000",
        ip_addr: "http://192.168.1.2:8000",
        blocks: [],
    },

    methods: {
        onLoad() {
            this.getUserBookData()
        },

        onTabsChange(event) {
            console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
        },

        handleBack() {
            console.log('go back');
        },

        handleUnbook(e) {
            const recordId = e.currentTarget.dataset.recordId;
            this.requestUnBook(recordId, (success) => {
                this.getUserBookData();
            });
        },

        requestUnBook(recordId, callback) {

            const token = wx.getStorageSync('token');

            wx.request({
                // url: 'http://127.0.0.1:8000/course/api/field-unbook/',
                url: `${this.data.ip_addr}/course/api/field-unbook/`,
                method: 'POST',
                header: {
                    'Authorization': 'Bearer ' + token, // 关键所在！
                    'content-type': 'application/json', // 默认值
                },
                data: {
                    id_list: [recordId]
                },
                success: (res) => {
                    if (res.statusCode === 200 && res.data) {
                        wx.showToast({
                            title: '取消成功'
                        });
                        console.log('取消成功:', res.data);
                        if (typeof callback === 'function') {
                            callback(true);
                        }
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '取消失败，请重试'
                        });
                        console.error('取消失败:', res.data);
                        if (typeof callback === 'function') {
                            callback(false); // 执行失败回调
                        }
                    }
                },
                fail: (err) => {
                    wx.showToast({
                        icon: 'none',
                        title: '网络异常，请检查网络'
                    });
                    console.error('请求失败:', err);
                    if (typeof callback === 'function') {
                        callback(false); // 执行失败回调
                    }
                }
            });

        },

        // 获取半小时后的时间函数
        getNextHalfHour(time) {
            const [hour, minute] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hour);
            date.setMinutes(minute + 30);

            const nextHour = String(date.getHours()).padStart(2, '0');
            const nextMinute = String(date.getMinutes()).padStart(2, '0');

            return `${nextHour}:${nextMinute}`;
        },

        getUserBookData(callback) {
            const url = `${this.data.ip_addr}/course/api/user-book-data/`;
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

                    // 获取当前时间
                    const now = new Date();

                    // 初始化两个数组
                    const upcoming = [];
                    const finished = [];

                    // 处理数据
                    data.forEach(item => {
                        // 解析日期 + 时间
                        const [year, month, day] = item.date.split('-');
                        const [hours, minutes] = item.time.split(':');

                        // 创建预约时间对象
                        const bookingTime = new Date(year, month - 1, day, hours, minutes);

                        // 添加 week 字段
                        const weekDay = bookingTime.getDay();
                        const weekLabels = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                        item.week = weekLabels[weekDay];

                        // 添加 end_time 字段
                        item.end_time = that.getNextHalfHour(item.time);

                        // 将 price 转为保留两位小数的字符串
                        item.price = parseFloat(item.price).toFixed(2); // 转成字符串格式

                        // 判断是未开始还是已结束
                        const diffMinutes = (now - bookingTime) / 1000 / 60; // 时间差（分钟）
                        if (diffMinutes > 30) {
                            finished.push(item);
                        } else {
                            upcoming.push(item);
                        }
                    });

                    // 更新数据
                    that.setData({
                        blocks: {
                            upcoming: upcoming,
                            finished: finished
                        }
                    }, () => {
                        console.log('User book data fetched:', that.data.blocks);
                        if (typeof callback === 'function') {
                            callback();
                        }
                    });
                },
                fail(err) {
                    console.error('Failed to fetch user book data:', err);
                }
            });
        },
    },
});