// pages/manage/coupon/detailsOfCouponData/detailsOfCouponData.js
import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
    locationId: '',
    startDate: '',
    endDate: '',
    acquired:0,
    orderTotal:0,
    redeemed: 0,
    totalDiscount: 0,
    users: 0,
    coupon: [],
    location: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      couponId: options.couponId,
      locationId: options.locationId,
    })
    this.fetchDetail()
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

  },
  fetchDetail: function() {
    let couponId = this.data.couponId
    let locationId = this.data.locationId
    fetch({
      url: '/coupons/analytics/locations/detail?locationId=' + locationId + '&couponId=' + couponId
    }).then(res => {
      this.setData({
        coupon: res.data.coupon,
        startDate: util.formatTime(res.data.coupon.startDate),
        endDate: util.formatTime(res.data.coupon.endDate),
        location: res.data.location,
        acquired: res.data.acquired,
        orderTotal: res.data.orderTotal,
        redeemed: res.data.redeemed,
        totalDiscount: res.data.totalDiscount,
        users: res.data.acquired
      })
      console.log(res.data)
    })
  }
})