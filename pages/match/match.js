const request = require('../../utils/request').default;

Page({
    data: {
        mode: true,
        blocks: [],
        matchedBlockIds: [],
        matchedBlocks: {},
        dates: [],
        selectedDateIndex: 0,
        fields: [],
        timeSlots: [],
        totalPrice: '0.00',
        selectedHours: 0,
        onBooking: false,
        fieldDict: {},
        level: "1.0",
        payment_type: 1
    },

    initDates() {
        const today = new Date();
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dates = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');

            dates.push({
                date: `${yyyy}-${mm}-${dd}`,
                label: weekDays[date.getDay()]
            });
        }
        this.setData({
            dates
        });
    },

    onLoad() {
        this.initDates()
        this.updateDate(this.data.dates[0].date, () => {
            const fieldDict = this.data.fieldDict;
            const timeSlots = Object.keys(fieldDict);
            const fields = timeSlots.length > 0 ? Object.keys(fieldDict[timeSlots[0]]) : [];
            this.setData({
                timeSlots,
                fields
            });
        });
    },

    goBack() {
        wx.navigateBack();
    },

    selectDate(e) {
        const index = e.currentTarget.dataset.index;
        const selectedDate = this.data.dates[index].date;

        this.setData({
            selectedDateIndex: index
        });

        // Get Today's Schedule
        this.updateDate(selectedDate)

        this.setData({
            totalPrice: '0.00',
            selectedHours: 0,
            onBooking: false
        });
    },


    updateDate(selectedDate, callback) {
        console.log('Selected Date:', selectedDate);

        const url = `${getApp().globalData.ip_addr}/course/api/field-data/?date=${selectedDate}`;
        const that = this;

        request(url, {
                method: 'GET'
            })
            .then(res => {
                const data = res.data;
                that.setData({
                    fieldDict: data
                }, () => {
                    console.log('Field data fetched:', that.data.fieldDict);
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            })
            .catch(err => {
                console.error('Failed to fetch field data:', err);
                wx.showToast({
                    title: '加载失败，请检查网络或重新登录',
                    icon: 'none'
                });
            });
    },

    selectMatchedSlot(e) {
        const time = e.currentTarget.dataset.time;
        const field = e.currentTarget.dataset.field;
        const status = this.data.fieldDict[time][field].status;
        const id = this.data.fieldDict[time][field].id;
        const timeEnd = this.getNextHalfHour(time);

        if (status === 3 || status === 0) {
            const url = `${getApp().globalData.ip_addr}/course/fields/${id}/matching-user/`;

            request(url, {
                    method: 'GET'
                })
                .then(res => {
                    if (res.statusCode === 200 && res.data) {
                        const userInfo = res.data;

                        const matchedUserInfo = {
                            nickname: userInfo.nickname,
                            level: userInfo.level,
                            icon: userInfo.icon,
                            date: this.data.dates[this.data.selectedDateIndex].date,
                            week: this.data.dates[this.data.selectedDateIndex].label,
                            duration: `${time} - ${timeEnd}`,
                            time: time,
                            field: field,
                            status: status,
                        };

                        const newMatchedBlocks = {
                            ...this.data.matchedBlocks
                        };
                        newMatchedBlocks[id] = matchedUserInfo;

                        this.setData({
                            matchedUserInfo,
                            matchedVisible: true,
                            matchedBlocks: newMatchedBlocks
                        });

                        console.log(this.data.matchedBlocks);
                    } else {
                        wx.showToast({
                            title: '获取用户信息失败',
                            icon: 'none'
                        });
                    }
                })
                .catch(err => {
                    console.error('请求失败:', err);
                    wx.showToast({
                        title: '网络请求失败或登录已过期',
                        icon: 'none'
                    });
                });
        }
    },

    selectMatchingSlot(e) {
        const {
            time,
            field
        } = e.currentTarget.dataset;
        const fieldDict = this.data.fieldDict;

        // 检查 time 和 field 是否存在
        if (fieldDict[time] && fieldDict[time][field]) {
            const currentStatus = fieldDict[time][field].status;

            // 仅当 status 为 0 或 1 时才允许切换
            if (currentStatus === 0 || currentStatus === 1) {
                fieldDict[time][field].status = currentStatus === 1 ? 0 : 1;

                // 遍历 fieldDict，统计 status === 0 的数量
                let selectedCount = 0;
                const timeSlots = Object.keys(fieldDict);

                for (const timeKey of timeSlots) {
                    const fields = Object.keys(fieldDict[timeKey] || {});
                    for (const fieldKey of fields) {
                        if (fieldDict[timeKey][fieldKey].status === 0) {
                            selectedCount++;
                        }
                    }
                }

                // 计算总价格与时间
                const totalPrice = (selectedCount * 50).toFixed(2);
                const selectedHours = (selectedCount * 0.5).toFixed(1);
                const onBooking = selectedCount > 0;

                // 更新数据
                this.setData({
                    fieldDict,
                    totalPrice,
                    selectedHours,
                    onBooking,
                    timeSlots
                });
            }
        }
    },

    onVisibleChange(e) {
        this.setData({
            visible: e.detail.visible,
        });
    },

    onMatchedVisibleChange(e) {
        this.setData({
            matchedVisible: e.detail.visible,
        });
    },

    onMatchedConfirmVisibleChange(e) {
        this.setData({
            matchedConfirmVisible: e.detail.visible,
        });
    },

    updateMatchedSelectedBlocks() {
        const fieldDict = this.data.fieldDict;
        const selectedBlockIds = [];

        for (const timeStart in fieldDict) {
            const fieldsObj = fieldDict[timeStart];

            for (const field in fieldsObj) {
                if (fieldsObj[field].status === 0) {
                    selectedBlockIds.push(fieldsObj[field].id);
                }
            }
        }

        this.setData({
            matchedBlockIds: selectedBlockIds
        });
    },

    submitOrder() {
        if (!this.data.onBooking) {
            wx.showToast({
                title: '请先选择场次',
                icon: 'none'
            });
            return;
        }
        if (this.data.mode) {
            this.updateSelectedBlocks()
            this.setData({
                visible: true
            });
        } else {
            this.updateMatchedSelectedBlocks();
            this.setData({
                matchedConfirmVisible: true
            });
        }
    },


    submitMatching(callback) {
        const blocks = this.data.blocks;

        if (blocks.length === 0) {
            wx.showToast({
                title: '请选择要预约的场地时段'
            });
            if (typeof callback === 'function') {
                callback(false); // 执行失败回调（可选）
            }
            return;
        }

        const id_list = blocks.map(block => block.id);

        // 组装请求数据
        const requestData = {
            id_list: id_list,
            payment_type: this.data.payment_type,
            min_level: this.data.level
        };

        // 调用 handleRequest 发送请求
        request(`${getApp().globalData.ip_addr}/course/api/field-matching/`, {
                method: 'POST',
                data: requestData
            })
            .then(res => {
                if (res.statusCode === 200 && res.data) {
                    wx.showToast({
                        title: '预约成功'
                    });
                    console.log('预约成功:', res.data);
                    if (typeof callback === 'function') {
                        callback(true); // 执行成功回调
                    }
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '预约失败，请重试'
                    });
                    console.error('预约失败:', res.data);
                    if (typeof callback === 'function') {
                        callback(false); // 执行失败回调
                    }
                }
            })
            .catch(err => {
                wx.showToast({
                    icon: 'none',
                    title: '网络异常，请检查网络'
                });
                console.error('请求失败:', err);
                if (typeof callback === 'function') {
                    callback(false); // 执行失败回调
                }
            });
    },


    submitMatched(callback) {
        const id_list = this.data.matchedBlockIds;

        if (id_list.length === 0) {
            wx.showToast({
                title: '请选择要预约的场地时段'
            });
            if (typeof callback === 'function') {
                callback(false); // 执行失败回调（可选）
            }
            return;
        }

        // 请求数据
        const requestData = {
            id_list: id_list
        };

        // 调用 handleRequest 发送请求
        request(`${getApp().globalData.ip_addr}/course/api/field-matched/`, {
                method: 'POST',
                data: requestData
            })
            .then(res => {
                if (res.statusCode === 200 && res.data) {
                    wx.showToast({
                        title: '预约成功'
                    });
                    console.log('预约成功:', res.data);
                    if (typeof callback === 'function') {
                        callback(true); // 执行成功回调
                    }
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '预约失败，请重试'
                    });
                    console.error('预约失败:', res.data);
                    if (typeof callback === 'function') {
                        callback(false); // 执行失败回调
                    }
                }
            })
            .catch(err => {
                wx.showToast({
                    icon: 'none',
                    title: '网络异常，请检查网络'
                });
                console.error('请求失败:', err);
                if (typeof callback === 'function') {
                    callback(false); // 执行失败回调
                }
            });
    },


    confirmOrder() {

        // send request 
        this.submitMatching((success) => {
            const selectedDate = this.data.dates[this.data.selectedDateIndex].date;
            this.updateDate(selectedDate);
        });

        this.setData({
            totalPrice: '0.00',
            selectedHours: 0,
            onBooking: false
        });

        this.setData({
            visible: false
        });
    },

    confirmMatchedOrder() {
        this.submitMatched((success) => {
            const selectedDate = this.data.dates[this.data.selectedDateIndex].date;
            this.updateDate(selectedDate);
        });

        this.setData({
            totalPrice: '0.00',
            selectedHours: 0,
            onBooking: false
        });

        this.setData({
            matchedConfirmVisible: false
        });
    },

    updateSelectedBlocks() {
        const fieldDict = this.data.fieldDict;
        const selectedBlocks = [];

        // 遍历 fieldDict 的结构：fieldDict[time][field] = { status: 0/1 }
        for (const timeStart in fieldDict) {
            const fieldsObj = fieldDict[timeStart];
            const timeEnd = this.getNextHalfHour(timeStart);

            for (const field in fieldsObj) {
                if (fieldsObj[field].status === 0) {
                    // console.log(fieldsObj[field].id),
                    selectedBlocks.push({
                        id: fieldsObj[field].id,
                        name: field,
                        time: `${timeStart} - ${timeEnd}`,
                        price: 50,
                        uniqueKey: `${field}-${timeStart}`
                    });
                }
            }
        }

        this.setData({
            blocks: selectedBlocks
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

    slider2change(e) {
        this.setData({
            level: (e.detail.value).toFixed(1),
        });
        // console.log(this.data.level);
    },

    onRadioChange(e) {
        this.setData({
            payment_type: e.detail.value,
        });
    },

    handleModeSwitch(e) {
        const selectedDate = this.data.dates[this.data.selectedDateIndex].date;
        this.updateDate(selectedDate, () => {
            this.setData({
                mode: !this.data.mode
            });
            this.setData({
                totalPrice: '0.00',
                selectedHours: 0,
                onBooking: false
            });
        });
    },

    handleMatchedSelected(e) {
        const time = this.data.matchedUserInfo.time;
        const field = this.data.matchedUserInfo.field;
        const fieldDict = this.data.fieldDict;

        // 检查 time 和 field 是否存在
        if (fieldDict[time] && fieldDict[time][field]) {
            const currentStatus = fieldDict[time][field].status;

            // 仅当 status 为 0 或 3 时才允许切换
            if (currentStatus === 0 || currentStatus === 3) {
                fieldDict[time][field].status = currentStatus === 3 ? 0 : 3;

                let onBooking = false;
                const timeSlots = Object.keys(fieldDict);

                for (const timeKey of timeSlots) {
                    const fields = Object.keys(fieldDict[timeKey] || {});
                    for (const fieldKey of fields) {
                        if (fieldDict[timeKey][fieldKey].status === 0) {
                            onBooking = true;
                            break;
                        }
                    }
                }

                this.setData({
                    fieldDict,
                    matchedVisible: false,
                    onBooking: onBooking,
                });
            }
        }
    }

});