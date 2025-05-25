Page({
    data: {
    },

    goToSubSettings(e) {
        const title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `/pages/settingsSub/index?title=${encodeURIComponent(title)}`
        });
    },

    // 2. REFRESH 怎么办？
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail;
        this.setData({
            'icon': avatarUrl 
        });

        wx.uploadFile({
            url: `${getApp().globalData.ip_addr}/course/api/update-user-icon/`,
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
});