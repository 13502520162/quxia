// pages/me/wallet/wallet.js
import fetch from '../../../lib/fetch.js';
import getStorePermissions from '../../../utils/getStorePremissioin.js';
let permissions = [];
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCanWithdraw: false,
    balance: '0.00'
  },

  onLoad: function(options) {
    permissions = getStorePermissions();
    if (app.hasPermission()) {
      this.setData({
        isCanWithdraw: true
      })
    } else {
      if (permissions.permissions.includes(52)) {
        this.setData({
          isCanWithdraw: true
        })
      }
    }

    this.fetchAccountBalance();
  },

  /**
   * 获取账户余额
   */
  fetchAccountBalance: function() {
    fetch({
        url: '/balance'
      })
      .then(res => {
        this.setData({
          balance: res.data.toFixed(2)
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 跳转提现
   */
  gotoWithdraw: function() {
    wx.navigateTo({
      url: './withDraw',
    })
  },

  /**
   * 跳转交易记录
   */
  gotoTransation: function() {
    wx.navigateTo({
      url: './transaction',
    })
  },
})