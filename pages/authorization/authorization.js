// pages/authorization/authorization.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onAuthorization: function ( event ) {
    if (event.detail.errMsg === 'getUserInfo:ok') {

      /**
       * 重置获取token时，消息队列的参数，避免重复的请求；
       */
      app.globalData.tokenIsReady = true;
      app.globalData.queuecb = [];

      wx.reLaunch({
        url: "/pages/index/index"
      })
    } else {

    }
  }
})