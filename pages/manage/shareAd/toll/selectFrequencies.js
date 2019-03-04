// pages/manage/shareAd/toll/selectFrequencies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frequencies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    this.setData({
      frequencies: prePage.data.tollData.frequencies
    })
  },

  /**
   * 添加播放频率
   */
  onAddHandle: function(){
     wx.navigateTo({
       url: './frequencyDetails',
     })
  },

  /**
   * 跳转频率详情
   */
  showDetails: function(e) {
    wx.navigateTo({
      url: './frequencyDetails?id=' + e.currentTarget.dataset.id,
    })
  },  

  /**
   * 确定
   */
  onConfirm: function(){
    let pages = getCurrentPages();
    let prePage = pages[ pages.length - 2 ];
    prePage.setData({
      tollData: { ...prePage.data.tollData, frequencies: this.data.frequencies }
    });
    wx.navigateBack({
      detal: 1
    })
  }
})