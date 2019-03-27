// pages/me/myOrder/orderDetails.js
import fetch from '../../../lib/fetch.js'
import moment from '../../../lib/moment.min.js'
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    tabs: ["订单详情"],
    // tabs: ["订单详情", "分润详情"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderDetailsData(options.orderId, options.cargoStateIndex);
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  // tabClick: function (e) {
  //   this.setData({
  //     sliderOffset: e.currentTarget.offsetLeft,
  //     activeIndex: e.currentTarget.id
  //   });
  // },


  getOrderDetailsData: function(orderId, index) {
    fetch({
        url: index == 0 ? '/orders/detail' : '/luckfree/orders/detail',
        data: {
          id: orderId
        },
        isShowLoading: true
      })
      .then(res => {
        if (res.data) {
          res.data.createdDate = moment(res.data.createdDate).format('YYYY-MM-DD HH:mm:ss');
          res.data.paymentGateway = res.data.paymentGateway.toLowerCase()
          this.setData({
            orderInfo: res.data
          })
        }
      })
  }
})