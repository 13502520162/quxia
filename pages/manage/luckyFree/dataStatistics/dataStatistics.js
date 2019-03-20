// pages/manage/luckyFree/dataStatistics/dataStatistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [{
      name: '参与人数',
      num: '100人'
    }, {
      name: '抽奖次数',
      num: '100次'
    }, {
      name: '中奖次数',
      num: '100次'
    }, {
      name: '平均中奖率',
      num: '30%'
    }, {
      name: '支付金额',
      num: '￥3000'
    }, {
      name: '奖品价值',
      num: '￥3000'
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 查看订单
   */
  viewOrder: function() {
      wx.navigateTo({
        url: '../../../index/order/list',
      })
  }
})