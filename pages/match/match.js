Page({
  data: {
    mode: true,
    blocks: [],
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
    console.log('The Selected Date:', selectedDate);

    const url = `http://127.0.0.1:8000/course/api/field-data/?date=${selectedDate}`;
    const that = this;

    // 从本地缓存获取 access_token（你在登录成功时应该存过它）
    const token = wx.getStorageSync('token'); // 假设你登录时存的 key 是这个
    console.log("tttttttoken", token)

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token, // 关键所在！
        'Content-Type': 'application/json'
      },
      success(res) {
        const data = res.data;
        that.setData({
          fieldDict: data
        }, () => {
          console.log('Field data fetched:', that.data.fieldDict);
          if (typeof callback === 'function') {
            callback();
          }
        });
      },
      fail(err) {
        console.error('Failed to fetch field data:', err);
      }
    });
  },

  selectMatchedSlot(e) {
    const time = e.currentTarget.dataset.time;
    const field = e.currentTarget.dataset.field;
    const status = this.data.fieldDict[time][field].status;
  
    if (status === 3) {
      this.setData({
        matchedVisible: true
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

  submitOrder() {
    if (!this.data.onBooking) {
      wx.showToast({
        title: '请先选择场次',
        icon: 'none'
      });
      return;
    }
    this.updateSelectedBlocks()
    this.setData({
      visible: true
    });
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

    // 从 selectedBlocks 中提取 id 列表
    const id_list = blocks.map(block => block.id);
    const token = wx.getStorageSync('token'); // 假设你登录时存的 key 是这个

    // 发送请求
    wx.request({
      url: 'http://127.0.0.1:8000/course/api/field-matching/',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + token, // 关键所在！
        'content-type': 'application/json', // 默认值
      },
      data: {
        id_list: id_list,
        payment_type: this.data.payment_type,
        min_level: this.data.level
      },
      success: (res) => {
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

  confirmOrder() {

    // send request 
    this.submitMatching((success) => {
      const selectedDate = this.data.dates[this.data.selectedDateIndex].date;
      this.updateDate(selectedDate)
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
    this.setData({
      mode: !this.data.mode
    });
  }  

});