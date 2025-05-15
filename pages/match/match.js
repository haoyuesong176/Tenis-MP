Page({
  data: {
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

  selectSlot(e) {
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

});

// Page({
//   data: {
//     blocks: [
//     ],
//     dates: [{
//         date: '',
//         label: '星期三'
//       },
//       {
//         date: '',
//         label: '星期四'
//       },
//       {
//         date: '',
//         label: '星期五'
//       },
//       {
//         date: '',
//         label: '星期六'
//       },
//       {
//         date: '',
//         label: '星期日'
//       },
//       {
//         date: '',
//         label: '星期一'
//       },
//       {
//         date: '',
//         label: '星期二'
//       },
//     ],
//     selectedDateIndex: 0,
//     fields: ['1号场', '2号场', '3号场'],
//     timeSlots: [{
//         time: '09:00',
//         booked: {
//           '1号场': false,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '09:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '10:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '10:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '11:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '11:30',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '12:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '12:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '13:00',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '13:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '14:00',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '14:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '15:00',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '15:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '16:00',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '16:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '17:00',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '17:30',
//         booked: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '18:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '18:30',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '19:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '19:30',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '20:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '20:30',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '21:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '21:30',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       },
//       {
//         time: '22:00',
//         booked: {
//           '1号场': true,
//           '2号场': true,
//           '3号场': true
//         },
//         selected: {
//           '1号场': false,
//           '2号场': false,
//           '3号场': false
//         }
//       }
//     ],
//     totalPrice: '0.00',
//     selectedHours: 0,
//     onConfirming: false,
//     level: '0.0',
//     fieldDict: {} 
//   },

//   onLoad: function (options) {
//     let that = this;
//     wx.request({
//       url: 'http://127.0.0.1:8000/course/api/field-data/',
//       method: 'GET',
//       header: {
//         'Content-Type': 'application/json'
//       },
//       success(res) {
//         console.log('请求成功', res.data);
//         // 直接赋值整个对象给 fieldDict
//         that.setData({
//           fieldDict: res.data
//         });
//       },
//       fail(err) {
//         console.error('请求失败', err);
//       }
//     });
//   },

//   goBack() {
//     wx.navigateBack();
//   },

//   handleSilderChange(e) {
//     this.setData({
//       level: ((e.detail.value)/10*0.5).toFixed(1),
//     });
//   },

//   selectDate(e) {
//     const index = e.currentTarget.dataset.index;
//     this.setData({
//       selectedDateIndex: index
//     });
//     // 可在这里更新对应日期的场地数据
//   },

//   selectSlot(e) {
//     const {
//       time,
//       field
//     } = e.currentTarget.dataset;

//     const timeSlots = this.data.timeSlots.map(slot => {
//       if (slot.time === time) {
//         // 如果该 slot 已预约，什么都不做，直接返回原样
//         if (slot.booked[field]) {
//           return slot;
//         }

//         return {
//           ...slot,
//           selected: {
//             ...slot.selected,
//             [field]: !slot.selected?.[field] // 使用 optional chaining 防止 selected 未定义
//           }
//         };
//       }
//       return slot;
//     });

//     // 计算 selected 为 true 的个数
//     let selectedCount = 0;
//     let totalHours = 0;

//     // 遍历 timeSlots，统计 selected 为 true 的场地数
//     timeSlots.forEach(slot => {
//       for (const field in slot.selected) {
//         if (slot.selected[field]) {
//           selectedCount++;
//           totalHours += 0.5; // 每选一个场地增加 0.5 小时
//         }
//       }
//     });

//     // 更新 totalPrice，selectedCount 个场地，每个 30 元
//     const totalPrice = (selectedCount * 50).toFixed(2);

//     // 更新 selectedHours
//     const selectedHours = totalHours.toFixed(1);

//     let onConfirming = selectedCount > 0;

//     // 更新 state
//     this.setData({
//       timeSlots,
//       totalPrice,
//       selectedHours,
//       onConfirming
//     });
//   },

//   onVisibleChange(e) {
//     this.setData({
//       visible: e.detail.visible,
//     });
//   },


//   submitOrder() {
//     if (!this.data.onConfirming) {
//       wx.showToast({
//         title: '请先选择场次',
//         icon: 'none'
//       });
//       return;
//     }
//     this.updateSelectedBlocks() 
//     this.setData({ visible: true });
//   },

//   comfirmOrder() {
//     const updatedTimeSlots = this.data.timeSlots.map(slot => {
//       const newBooked = {
//         ...slot.booked
//       };

//       // 遍历 selected 中所有场地
//       for (const field in slot.selected) {
//         if (slot.selected[field]) {
//           newBooked[field] = true;
//         }
//       }

//       return {
//         ...slot,
//         booked: newBooked,
//         selected: {} // 清空 selected 状态（可选）
//       };
//     });

//     this.setData({
//       timeSlots: updatedTimeSlots
//     });

//     wx.showToast({
//       title: '下单成功',
//       icon: 'success'
//     });

//     this.setData({ visible: false });
//   },

//   updateSelectedBlocks() {
//     const timeSlots = this.data.timeSlots;
//     const selectedBlocks = [];

//     timeSlots.forEach(slot => {
//       const timeStart = slot.time;
//       const timeEnd = this.getNextHalfHour(timeStart);

//       for (const field of this.data.fields) {
//         if (slot.selected[field]) {
//           selectedBlocks.push({
//             name: field,
//             time: `${timeStart} - ${timeEnd}`,
//             price: 50,
//             uniqueKey: `${field}-${timeStart}`
//           });
//         }
//       }
//     });

//     console.log(this.data.blocks)
//     console.log(selectedBlocks)

//     this.setData({
//       blocks: selectedBlocks
//     });


//   },

//   // 工具函数：获取下一个半小时时间段的结束时间
//   getNextHalfHour(time) {
//     const [hour, minute] = time.split(':').map(Number);
//     const date = new Date();
//     date.setHours(hour);
//     date.setMinutes(minute + 30);

//     const nextHour = String(date.getHours()).padStart(2, '0');
//     const nextMinute = String(date.getMinutes()).padStart(2, '0');

//     return `${nextHour}:${nextMinute}`;
//   }

// });