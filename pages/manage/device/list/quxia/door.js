// pages/manage/device/list/quxia/door.js
import fetch from '../../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    goods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.deviceId) {
      this.setData({
        deviceId: options.deviceId
      })
      this.fetchDeviceGoods();
    }
  },

  /**
   * 获取设备商品数据
   */
  fetchDeviceGoods: function () {
    fetch({
      url: '/quxia/remote/doors?deviceId='+this.data.deviceId
    })
    .then( res =>{
        this.setData({
          goods: res.data
        })
    })
    .catch( err =>{
      console.error(err);
    })
  },

  /**
   * 开门
   */
  openDoor: function (e) {
    this.fetchOpenDoor(e.currentTarget.dataset.number)
  },

  /**
   * 发送开门
   */
  fetchOpenDoor: function (doorNum) {
    fetch({
      url: '/quxia/remote/openDoor?deviceId=' + this.data.deviceId + '&door=' + doorNum,
      method: 'post'
    })
      .then(res => {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  openAllDoors: function() {
    fetch({
      url: '/quxia/remote/openDoors',
      method: 'post',
      data: {
        deviceId: this.data.deviceId,
        doors: this.data.goods.map(item => item.number)
      },
      isShowLoading: true
    })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        })
      })
      .catch(err => {
        console.error(err);
      })
  }

})