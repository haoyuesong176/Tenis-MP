Component({

    data: {
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
                url: 'http://127.0.0.1:8000/course/api/field-unbook/',
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



        getUserBookData(callback) {

            const url = `http://127.0.0.1:8000/course/api/user-book-data/`;
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
                        blocks: data
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