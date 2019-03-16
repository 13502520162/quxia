// pages/manage/coupon/couponStatistics/couponStatistics.js
import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
    pageHeight: '',
    startDate: '',
    endDate: '',
    statistics: {
      name: '',
      dateRule: '',
      acquired: 0,
      users: 0,
      redeemed: 0,
      orderTotal: 0,
      totalDiscount: 0,
      validDays: 0,
      dateRule: ''
    },
    locations: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const query = wx.createSelectorQuery()

    var that = this;
    query.select('.page').boundingClientRect(function(rect) {
      that.setData({
        pageHeight: rect.height + 'px',
        couponId: options.couponId
      })
    }).exec();

    this.initData()
    this.fetchCouponStatistics(options.couponId);
    this.fetchCouponLocations(options.couponId);

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
  initData: function() {

    this.setData({
      listParams: {
        from: 0,
        size: 10
      }
    })

  },
  /**
   * 加载更多
   */
  couponStatistics: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })

    this.fetchCouponLocations();
  },
  fetchCouponStatistics: function(couponId) {
    fetch({
      url: '/coupons/analytics/summary?id=' + couponId
    }).then(res => {
      this.setData({
        statistics: res.data,
        startDate: util.formatDate(new Date(res.data.startDate)),
        endDate: util.formatDate(new Date(res.data.endDate)),
      })
    })
  },
  fetchCouponLocations: function(couponId) {
    fetch({
      url: '/coupons/analytics/locations?id=' + couponId,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
      this.setData({
        locations: [...this.data.locations, ...res.data]
      })

    })
  },
  /**
   * 跳到详情页
   */
  showDetailsOfCouponData: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailsOfCouponData/detailsOfCouponData?locationId=' + id + '&couponId=' + this.data.couponId,
    })
  }
})