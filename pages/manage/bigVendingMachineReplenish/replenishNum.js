// pages/manage/bigVendingMachineReplenish/replenishNum.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shelfs: [],
    isDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    this.setData({
      shelfs: prepage.data.shelfs
    })
  },

  confirm: function() {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    let deviceId = prepage.data.deviceId;
    let shelfs = prepage.data.shelfs;
    shelfs = shelfs.filter(item => {
      return item.replenishNum != item.stock
    });
    shelfs = shelfs.map(item => {
      return {
        number: item.number,
        amount: item.replenishNum - item.stock
      }
    })
    this.setData({
      isDisabled: true
    })
    fetch({
        url: '/restocks',
        method: 'post',
        data: {
          deviceId,
          shelfs
        },
        isShowLoading: true
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        })


        prepage.fetchDeviceInfo();
        prepage.setData({
          isCanNext: false
        })
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1500)
      })
      .catch(err => {
        this.setData({
          isDisabled: false
        })
        console.error(err);
      })
  }



})