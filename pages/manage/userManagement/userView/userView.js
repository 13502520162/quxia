// pages/manage/userManagement/userView/userView.js

import fetch from '../../../../lib/fetch.js';
import moment from '../../../../lib/moment.min.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: {},
    cardDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })

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
    this.fetchUserInfo()
  },
  fetchUserInfo: function() {
    fetch({
      url: '/customers/detail?id=' + this.data.id
    }).then(res => {
      let cardPermanent = res.data.cardPermanent;
      let cardDate = moment(res.data.cardExpiry).format('YYYY-MM-DD')
      if (cardPermanent) {
        res.data.cardExpiry = '永久有效'
      } else {
        res.data.cardExpiry = moment(res.data.cardExpiry).format('YYYY-MM-DD') + '前有效'
      }

      this.setData({
        userInfo: res.data,
        cardDate
      })
    })

  },
  /**
   * 会员级别
   */
  membershipLevel: function() {
    wx.navigateTo({
      url: 'membershipLevel/membershipLevel?id=' + this.data.id + '&cardId=' + this.data.userInfo.cardId + '&cardExpiry=' + this.data.userInfo.cardExpiry + '&cardDate=' + this.data.cardDate
    })
  },


  /**
   * 会员期限
   */
  durationofMembership: function() {
    wx.navigateTo({
      url: 'membershipLevel/membershipLevel?id=' + this.data.id + '&cardId=' + this.data.userInfo.cardId + '&cardExpiry=' + this.data.userInfo.cardExpiry + '&cardDate=' + this.data.cardDate
    })
  },



  /**
   * 余额
   */
  balance: function() {
    wx.navigateTo({
      url: 'balance/balance?balance=' + this.data.userInfo.balance + '&id=' + this.data.id,
    })
  },


  /**
   * 余额记录
   */
  balanceRecord: function() {
    wx.navigateTo({
      url: 'balanceRecord/balanceRecord?totalRecharge=' + this.data.userInfo.totalRecharge + '&totalPaidBalance=' + this.data.userInfo.totalPaidBalance + '&id=' + this.data.id,
    })
  },


  /**
   * 消费记录
   */
  recordsOfConsumption: function() {
    wx.navigateTo({
      url: 'recordsOfConsumption/recordsOfConsumption?totalExpense=' + this.data.userInfo.totalExpense + '&totalOrders=' + this.data.userInfo.totalOrders + '&id=' + this.data.id,
    })
  }


})