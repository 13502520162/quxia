// pages/me/myOrder/orderDetails.js
import fetch from '../../../lib/fetch.js'
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetailsData(options.orderId);
  },


  getOrderDetailsData: function (orderId) {
    fetch({
      url: '/orders/detail',
      data: {
        id: orderId
      },
      isShowLoading: true
    })
      .then(res => {
        if (res.data) {
          res.data.createdDate = moment(res.data.createdDate).format('YYYY-MM-DD HH:mm:ss');
          this.setData({
            orderInfo: res.data
          })
        }
      })
  }
})