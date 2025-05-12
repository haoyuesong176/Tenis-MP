Page({
  data: {
    blocks: [
    ],
    dates: [{
        date: '',
        label: '星期三'
      },
      {
        date: '',
        label: '星期四'
      },
      {
        date: '',
        label: '星期五'
      },
      {
        date: '',
        label: '星期六'
      },
      {
        date: '',
        label: '星期日'
      },
      {
        date: '',
        label: '星期一'
      },
      {
        date: '',
        label: '星期二'
      },
    ],
    selectedDateIndex: 0,
    fields: ['1号场', '2号场', '3号场'],
    timeSlots: [{
        time: '09:00',
        booked: {
          '1号场': false,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '09:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '10:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '10:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '11:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '11:30',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '12:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '12:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '13:00',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '13:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '14:00',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '14:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '15:00',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '15:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '16:00',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '16:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '17:00',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '17:30',
        booked: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '18:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '18:30',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '19:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '19:30',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '20:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '20:30',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '21:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '21:30',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      },
      {
        time: '22:00',
        booked: {
          '1号场': true,
          '2号场': true,
          '3号场': true
        },
        selected: {
          '1号场': false,
          '2号场': false,
          '3号场': false
        }
      }
    ],
    totalPrice: '0.00',
    selectedHours: 0,
    onInviting: false,
    onAccepting: false,
    level: '0.0',
    fieldDict: {} 
  },

  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'http://127.0.0.1:8000/course/api/field-data/',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log('请求成功', res.data);
        // 直接赋值整个对象给 fieldDict
        that.setData({
          fieldDict: res.data
        });
      },
      fail(err) {
        console.error('请求失败', err);
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },

  handleSilderChange(e) {
    this.setData({
      level: ((e.detail.value)/10*0.5).toFixed(1),
    });
  },

  selectDate(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedDateIndex: index
    });
    // 可在这里更新对应日期的场地数据
  },

  selectSlot(e) {
    const {
      time,
      field
    } = e.currentTarget.dataset;

    const timeSlots = this.data.timeSlots.map(slot => {
      if (slot.time === time) {
        // 如果该 slot 已预约，什么都不做，直接返回原样
        if (slot.booked[field]) {
          return slot;
        }

        return {
          ...slot,
          selected: {
            ...slot.selected,
            [field]: !slot.selected?.[field] // 使用 optional chaining 防止 selected 未定义
          }
        };
      }
      return slot;
    });

    // 计算 selected 为 true 的个数
    let selectedCount = 0;
    let totalHours = 0;

    // 遍历 timeSlots，统计 selected 为 true 的场地数
    timeSlots.forEach(slot => {
      for (const field in slot.selected) {
        if (slot.selected[field]) {
          selectedCount++;
          totalHours += 0.5; // 每选一个场地增加 0.5 小时
        }
      }
    });

    // 更新 totalPrice，selectedCount 个场地，每个 30 元
    const totalPrice = (selectedCount * 50).toFixed(2);

    // 更新 selectedHours
    const selectedHours = totalHours.toFixed(1);

    let onInviting = selectedCount > 0;

    // 更新 state
    this.setData({
      timeSlots,
      totalPrice,
      selectedHours,
      onInviting
    });
  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },


  submitOrder1() {
    if (!this.data.onInviting) return; 
    this.updateSelectedBlocks() 
    this.setData({ visible: true });
  },

  submitOrder2() {
    if (!this.data.onAccepting) return; 
    this.updateSelectedBlocks() 
    this.setData({ visible: true });
  },

  comfirmOrder() {
    const updatedTimeSlots = this.data.timeSlots.map(slot => {
      const newBooked = {
        ...slot.booked
      };

      // 遍历 selected 中所有场地
      for (const field in slot.selected) {
        if (slot.selected[field]) {
          newBooked[field] = true;
        }
      }

      return {
        ...slot,
        booked: newBooked,
        selected: {} // 清空 selected 状态（可选）
      };
    });

    this.setData({
      timeSlots: updatedTimeSlots
    });

    wx.showToast({
      title: '下单成功',
      icon: 'success'
    });

    this.setData({ visible: false });
  },

  updateSelectedBlocks() {
    const timeSlots = this.data.timeSlots;
    const selectedBlocks = [];
  
    timeSlots.forEach(slot => {
      const timeStart = slot.time;
      const timeEnd = this.getNextHalfHour(timeStart);
  
      for (const field of this.data.fields) {
        if (slot.selected[field]) {
          selectedBlocks.push({
            name: field,
            time: `${timeStart} - ${timeEnd}`,
            price: 50,
            uniqueKey: `${field}-${timeStart}`
          });
        }
      }
    });
  
    console.log(this.data.blocks)
    console.log(selectedBlocks)

    this.setData({
      blocks: selectedBlocks
    });


  },
  
  // 工具函数：获取下一个半小时时间段的结束时间
  getNextHalfHour(time) {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute + 30);
  
    const nextHour = String(date.getHours()).padStart(2, '0');
    const nextMinute = String(date.getMinutes()).padStart(2, '0');
  
    return `${nextHour}:${nextMinute}`;
  }
  
});