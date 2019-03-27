// pages/manage/luckyFree/dataStatistics/dataStatistics.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [],
    state: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchData(options.id)
    this.setData({
      state: options.state,
      name: options.name
    })
  },

  fetchData: function(id) {
    fetch({
      url: '/luckfree/analytics/summary?id=' + id
    }).then(res => {
      let grids = [{
        name: '参与人数',
        num: res.data.users + '人'
      }, {
        name: '抽奖次数',
        num: res.data.orders + '次'
      }, {
        name: '中奖次数',
        num: res.data.wins + '次'
      }, {
        name: '平均中奖率',
        num: res.data.wins || res.data.orders ? (res.data.wins / res.data.orders * 100).toFixed(2) + '%' : 0 + '%'
      }, {
        name: '支付金额',
        num: '￥' + res.data.paidAmount
      }, {
        name: '奖品价值',
        num: '￥' + res.data.prizeValue
      }]
      this.setData({
        grids
      })
    })
  },

  /**
   * 查看订单
   */
  viewOrder: function() {
    wx.navigateTo({
      url: '../../../index/order/list?cargoStateIndex=1',
    })
  }
})