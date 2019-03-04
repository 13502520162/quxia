// pages/manage/userManagement/userView/userView.js

import fetch from '../../../../lib/fetch.js';
import moment from '../../../../lib/moment.min.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.fetchUserInfo()
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
  fetchUserInfo: function() {
    fetch({
      url: '/customers/detail?id=' + this.data.id
    }).then(res => {
      res.data.cardExpiry = moment(res.data.cardExpiry).format('YYYY-MM-DD')
      this.setData({
        userInfo: res.data
      })
    })

  },
  /**
   * 会员级别
   */
  membershipLevel: function() {
    wx.navigateTo({
      url: 'membershipLevel/membershipLevel',
    })
  },


  /**
   * 会员期限
   */
  durationofMembership: function() {
    wx.navigateTo({
      url: 'membershipLevel/membershipLevel',
    })
  },



  /**
   * 余额
   */
  balance: function() {
    wx.navigateTo({
      url: 'balance/balance?balance=' + this.data.userInfo.balance,
    })
  },


  /**
   * 余额记录
   */
  balanceRecord: function() {
    wx.navigateTo({
      url: 'balanceRecord/balanceRecord?totalRecharge=' + this.data.userInfo.totalRecharge + '&totalPaidBalance=' + this.data.userInfo.totalPaidBalance,
    })
  },


  /**
   * 消费记录
   */
  recordsOfConsumption: function() {
    wx.navigateTo({
      url: 'recordsOfConsumption/recordsOfConsumption',
    })
  }


})