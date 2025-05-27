const request = require('../../../utils/request').default;

Page({
    data: {
        profileDict: {},
    },

    onLoad() {
        this.getUserProfile();
    },

    goToSubSettings(e) {
        const title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `/pages/settingsSub/index?title=${encodeURIComponent(title)}`
        });
    },

    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail;

        this.setData({
            'profileDict.icon': avatarUrl
        });
    },

    // onChooseAvatar(e) {
    //     const {
    //         avatarUrl
    //     } = e.detail;

    //     wx.uploadFile({
    //         url: `${getApp().globalData.ip_addr}/course/api/update-user-icon/`,
    //         filePath: avatarUrl,
    //         name: 'icon',
    //         header: {
    //             'Authorization': 'Bearer ' + wx.getStorageSync('token'), // 若需要 token
    //             'Content-Type': 'multipart/form-data'
    //         },
    //         success(res) {
    //             const data = JSON.parse(res.data);
    //             if (res.statusCode === 200) {
    //                 this.setData({
    //                     'profileDict.icon': avatarUrl 
    //                 });
    //                 wx.showToast({
    //                     title: '头像上传成功',
    //                     icon: 'success'
    //                 });
    //             } else {
    //                 wx.showToast({
    //                     title: '上传失败',
    //                     icon: 'none'
    //                 });
    //                 console.error('上传失败：', data);
    //             }
    //         },
    //         fail(err) {
    //             wx.showToast({
    //                 title: '上传失败',
    //                 icon: 'none'
    //             });
    //             console.error('上传失败：', err);
    //         }
    //     });
    // },

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

    submitSave(e) {
        // 当需要获取输入框的值时执行此代码
        var nicknameInput = document.getElementById('nicknameInput'); // 获取输入框元素
        var inputValue = nicknameInput.value; // 获取输入框的当前值

        // 现在inputValue变量包含了输入框中的数据
        console.log(inputValue); // 打印出来查看效果
    }

});