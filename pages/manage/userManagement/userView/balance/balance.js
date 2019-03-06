// pages/manage/userManagement/userView/balance/balance.js
import fetch from '../../../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 10,
    adjustment: 0,
    balanceIpt: 0,
    note: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   balance: options.balance,
    //   adjustment: options.balance
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 确定调整
   */
  definiteAdjustment: function() {
    fetch({
      url: '/customers/balance',
      method: "POST",
      data: {
        value: parseInt(this.data.adjustment),
        note: this.data.note
      }
    }).then(res => {

      wx.showToast({
        icon: 'success',
        title: '调整成功',
      })

      setTimeout(res => {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)

    })
  },

  adjustmentNote: function(e) {
    this.setData({
      note: e.detail.value
    })
  },
  /** 
   * 减
   */
  reduce: function() {
    let balanceIpt = this.data.balanceIpt
    let balance = this.data.balance
    let adjustment = this.data.adjustment


    if ((balance + adjustment) != 0) {
      balanceIpt--
    }

    this.setData({
      adjustment: balanceIpt,
      balanceIpt
    })
  },


  /** 
   * 加
   */
  plus: function() {
    let balanceIpt = this.data.balanceIpt

    balanceIpt++

    this.setData({
      adjustment: balanceIpt,
      balanceIpt
    })
  },


  balanceIpt: function(e) {
    if (e.detail.value == '') {
      e.detail.value = 0
    }

    this.setData({
      adjustment: parseInt(e.detail.value),
      balanceIpt: parseInt(e.detail.value)
    })
  }
})