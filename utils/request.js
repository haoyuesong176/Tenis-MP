// utils/request.js

const REFRESH_TOKEN_URL = `${getApp().globalData.ip_addr}/course/api/token/refresh/`;

function refreshToken() {
    return new Promise((resolve, reject) => {
        const refreshToken = wx.getStorageSync('refresh_token');
        if (!refreshToken) {
            reject(new Error('No refresh token'));
            return;
        }

        wx.request({
            url: REFRESH_TOKEN_URL,
            method: 'POST',
            data: {
                refresh: refreshToken
            },
            success(res) {
                if (res.statusCode === 200) {
                    const {
                        access,
                        refresh
                    } = res.data;
                    wx.setStorageSync('token', access);
                    if (refresh) {
                        wx.setStorageSync('refresh_token', refresh);
                    }
                    resolve(access);
                } else {
                    reject(res.data || 'Refresh failed');
                }
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

function handleRequest(url, options = {}) {
    let retry = false;

    function sendRequest(token) {
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                ...options,
                header: {
                    ...(options.header || {}),
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                success(res) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(res);
                    } else if (res.statusCode === 401 && !retry) {
                        retry = true;
                        refreshToken()
                            .then(newToken => {
                                sendRequest(newToken).then(resolve).catch(reject);
                            })
                            .catch(() => {
                                wx.showToast({
                                    title: '登录已过期，请重新登录'
                                });
                                wx.removeStorageSync('token');
                                wx.removeStorageSync('refresh_token');
                                setTimeout(() => {
                                    wx.reLaunch({
                                        url: '/pages/login/login',
                                        success: function (res) {
                                            console.log('跳转成功');
                                        },
                                        fail: function (err) {
                                            console.error('跳转失败', err);
                                        }
                                    });
                                }, 1000);  
                                reject(new Error('Token refresh failed'));
                            });
                    } else {
                        reject(res);
                    }
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }

    const token = wx.getStorageSync('token');
    return sendRequest(token);
}

export default handleRequest;