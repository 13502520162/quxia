// pages/manage/device/list/quxia/lamp.js
import fetch from '../../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lampInfo: '',
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.deviceId) {
      this.setData({
        deviceId: options.deviceId
      }, () => {
        this.fetchLamp()
      })
    }
  },

  switchHandle: function(e) {
    if (e.detail.value) {
      this.turnOnLamp();
    } else {
      this.turnOffLamp();
    }
  },

  /**
   * 获取睡眠灯信息
   */
  fetchLamp: function() {
    fetch({
        url: '/quxia/remote/light',
        data: {
          deviceId: this.data.deviceId
        },
        isShowLoading: true
      })
      .then(res => {
        this.setData({
          lampInfo: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },



  /**
   * 开睡眠灯
   */
  turnOnLamp: function() {
    fetch({
        url: '/quxia/remote/openLight?deviceId=' + this.data.deviceId,
        method: 'post',
        isShowLoading: true
      })
      .then(res => {
        this.fetchLamp();
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 关睡眠灯
   */
  turnOffLamp: function() {
    fetch({
        url: '/quxia/remote/closeLight?deviceId=' + this.data.deviceId,
        method: 'post',
        isShowLoading: true
      })
      .then(res => {
        this.fetchLamp();
      })
      .catch(err => {
        console.error(err);
      })
  }
})