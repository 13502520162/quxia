// pages/manage/partner/list/setCommissionRate.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerId: null,
    devices:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let devices = JSON.parse(options.devices);
    devices = devices.map( item => {
      return {
        id: item,
        commissionRate: null
      }
    })
    this.setData({
      devices: devices,
      partnerId: options.partnerId
    })
  },

  /**
   * 更改分成比例
   */
  changCommissionRate: function (e) {
    let commissionRate = e.detail.value;
    let hasError = false;
    if (commissionRate > 100 ){
      wx.showToast({
        title: '分成比例不能大于100',
        icon: 'none'
      })
      hasError = true
    }
    let id = e.currentTarget.dataset.id;
    let devices = this.data.devices.map( item => {
      if (id == item.id && !hasError  ){
           item.commissionRate = commissionRate
       }
       return item
    })
    this.setData({
      devices: devices
    })
  },

  /**
   * 同步分成比例
   */
  syncCommissionHandle: function (e) {
    let deviceId = e.currentTarget.dataset.id;
    let devices = this.data.devices;
    let commissionRate = null;
    for (let i = 0; i < devices.length; i++) {
      if ( devices[i].id == deviceId ){
        commissionRate = devices[i].commissionRate;
        break;
      }
    }

    devices = devices.map( item => {
       item.commissionRate = commissionRate;
       return item;
    })

    this.setData({
      devices: devices
    })
  },
  /**
   * 将设备添加到合伙设备中
   */
  fetchAddDevices: function () {
    fetch({
      url: '/partners/addDevices',
      data: {
        id: this.data.partnerId,
        devices: this.data.devices
      }
    })
    .then( res => {
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
      setTimeout(()=> {
        wx.navigateBack({
          delta:2
        })
      },1500)
    })
    .catch( err => {
      console.error(err)
    })
  }

})