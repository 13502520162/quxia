// pages/manage/replenish/replenish.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    deviceInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      deviceId: options.sence
    })
  },

  onShow: function() {
    this.fetchDeviceInfo();
  },

  /**
   * 获取设备信息
   */
  fetchDeviceInfo: function(deviceId) {
    fetch({
        url: '/restocks/deviceInfo',
        data: {
          deviceId: this.data.deviceId
        }
      })
      .then(res => {
        if (!res.data) {
          return;
        }

        if (res.data.typeId == 'quxia-vm') {
          wx.redirectTo({
            url: '../bigVendingMachineReplenish/index?sence=' + this.data.deviceId
          })
          return
        }


        res.data.shelfs = res.data.shelfs.map(item => {
          if (item.state == 'NORMAL') {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        })

        this.setData({
          deviceInfo: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 复选框改变
   */
  checkboxChange: function(e) {
    var checkboxItems = this.data.deviceInfo.shelfs,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      if (checkboxItems[i].state == 'NORMAL') {
        checkboxItems[i].checked = true;
      }
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (i == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    let deviceInfo = this.data.deviceInfo;
    deviceInfo.shelfs = checkboxItems;
    this.setData({
      deviceInfo: deviceInfo
    });
  },

  /**
   * 开门补货
   */
  onRestocks: function() {
    let deviceInfo = this.data.deviceInfo;
    let restocks = [];
    deviceInfo.shelfs.forEach(item => {
      if (item.state != 'NORMAL' && item.checked) {
        restocks.push({
          number: item.number,
          amount: 1
        })
      }
    });

    if (restocks.length == 0) {
      wx.showToast({
        title: '请选择补货商品',
        icon: 'none'
      })
      return;
    }

    wx.showModal({
      title: '补货',
      content: '确定补货？',
      success: (res) => {
        if (res.cancel) {
          return;
        }
        fetch({
            url: '/restocks',
            method: 'POST',
            data: {
              deviceId: deviceInfo.deviceId,
              shelfs: restocks
            }
          })
          .then(res => {
            wx.showToast({
              title: '操作成功',
            })
            this.fetchDeviceInfo();
          })
          .catch(err => {
            if (err.errstr.data.code == '403') {
              wx.showToast({
                title: '库存不足',
                icon: 'none'
              });
            }
            console.error(err);
          })
      }
    })
  },

  /**
   * 调整库存
   */
  onAdjust: function() {
    wx.navigateTo({
      url: './adjust?deviceId=' + this.data.deviceId,
    })
  }
})