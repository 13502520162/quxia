// pages/manage/shareAd/toll/selectperiods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    periods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    this.setData({
      periods: prePage.data.tollData.periods
    })
  },

  /**
   * 添加播放周期
   */
  onAddHandle: function () {
    wx.navigateTo({
      url: './periodsDetails',
    })
  },

  /**
   * 跳转周期详情
   */
  showDetails: function (e) {
    wx.navigateTo({
      url: './periodsDetails?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 确定
   */
  onConfirm: function () {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    prePage.setData({
      tollData: { ...prePage.data.tollData, periods: this.data.periods }
    });
    wx.navigateBack({
      detal: 1
    })
  }
})