Page({
    data: {
        profileDict: {},
    },

    goToSubSettings(e) {
        const title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `/pages/settings/${encodeURIComponent(title)}/${encodeURIComponent(title)}`
        });
    },

});