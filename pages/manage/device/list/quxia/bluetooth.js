// pages/manage/device/list/quxia/bluetooth.js
import fetch from '../../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    bluetoothInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if( options.deviceId ){
       this.setData({
         deviceId: options.deviceId
       })
     }
  },

  /**
 * 获取蓝牙信息
 */
  fetchBluetooth: function () {
    fetch({
      url: '/quxia/remote/bluetooth',
      data: {
        deviceId: this.data.deviceId
      },
      isShowLoading: true
    })
      .then(res => {
        this.setData({
          bluetoothInfo: res.data 
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 蓝牙切换
   */
  switchHandle: function (e) {
    if( e.detail.value ){
      this.turnOnBluetooth();
    } else {
      this.turnOffBluetooth();
    }
  },

    /**
   * 开蓝牙
   */
  turnOnBluetooth: function () {
    fetch({
      url: '/quxia/remote/openBluetooth?deviceId=' + this.data.deviceId,
      method: 'POST',
      isShowLoading: true
    })
      .then(res => {
        this.fetchBluetooth();
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 关蓝牙
   */
  turnOffBluetooth: function () {
    fetch({
      url: '/quxia/remote/closeBluetooth?deviceId=' + this.data.deviceId,
      method: 'post',
      isShowLoading: true
    })
      .then(res => {
        this.fetchBluetooth();
      })
      .catch(err => {
        console.error(err);
      })
  },




})