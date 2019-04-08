// pages/authorization/authorization.js
import fetch from '../../lib/fetch.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onAuthorization: function(event) {
    if (event.detail.errMsg === 'getUserInfo:ok') {
      console.log(event)

      /**
       * 重置获取token时，消息队列的参数，避免重复的请求；
       */
      app.globalData.tokenIsReady = true;
      app.globalData.queuecb = [];
      app.globalData.userInfo = event.detail.userInfo
      wx.setStorageSync('userInfo', event.detail.userInfo)


      wx.reLaunch({
        url: "/pages/index/index"
      })
    } else {

    }
  }
})