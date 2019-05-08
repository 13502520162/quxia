// pages/coupon/newCoupons/newCoupons.js

import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
import dateTimePicker from '../../../../lib/dateTimePicker.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    name: '',
    field: '',
    startDate: '2019-01-01 10:00:00',
    endDate: '2019-01-03 10:00:00',
    isBorder: true,
    discount: true,
    isDisabled: false,
    isPermanent: false,
    isAllVenues: false,
    limitPerCustomer: '',
    locationIds: [],
    chooseCoupons: [],
    couponId: '',

    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var TIME = util.formatTime(new Date());
    this.setData({
      startDate: TIME,
      endDate: TIME,
      field: options.field
    });

    this.fetchCouponsDetail(options.id)


    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTimeArray1: obj1.dateTimeArray

    });
  },
  onShow: function() {
    if (this.data.chooseCoupons.length) {
      this.setData({
        couponId: this.data.chooseCoupons.join('')
      })
    }
  },
  /**
   * 表单填充
   */
  fetchCouponsDetail: function(id) {
    if (this.data.field == 'view') {
      fetch({
        url: '/couponOffers/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data;

        this.setData({
          name: ress.name,
          couponId: ress.couponId,
          locationIds: ress.locationIds,
          startDate: util.formatTime(ress.startDate),
          endDate: util.formatTime(ress.endDate),
          isPermanent: ress.permanent,
          isDisabled: true,
          isAllVenues: ress.locationIds === null || ress.locationIds.length === 0
        })
      })
    } else {
      this.setData({
        isDisabled: false
      })
    }


  },



  /**
   * 开始时间
   */
  changeDateTime(e) {

    let startY = '20' + e.detail.value[0]

    let startM = e.detail.value[1] + 1 < 10 ? '0' + (e.detail.value[1] + 1) : e.detail.value[1] + 1

    let startD = e.detail.value[2] + 1 < 10 ? '0' + (e.detail.value[2] + 1) : e.detail.value[2] + 1

    let startH = e.detail.value[3] < 10 ? '0' + e.detail.value[3] : e.detail.value[3]


    let startm = e.detail.value[4] < 10 ? '0' + e.detail.value[4] : e.detail.value[4]

    let startS = e.detail.value[5] < 10 ? '0' + e.detail.value[5] : e.detail.value[5]


    let startAll = startY + '-' + startM + '-' + startD + ' ' + startH + ':' + startm + ':' + startS


    this.setData({
      dateTime: e.detail.value,
      startDate: startAll,
      endDate: startAll
    });


  },

  /**
   * 结束时间
   */
  changeDateTime1(e) {

    let endY = '20' + e.detail.value[0]

    let endM = e.detail.value[1] + 1 < 10 ? '0' + (e.detail.value[1] + 1) : e.detail.value[1] + 1

    let endD = e.detail.value[2] + 1 < 10 ? '0' + (e.detail.value[2] + 1) : e.detail.value[2] + 1

    let endH = e.detail.value[3] < 10 ? '0' + e.detail.value[3] : e.detail.value[3]


    let endm = e.detail.value[4] < 10 ? '0' + e.detail.value[4] : e.detail.value[4]

    let endS = e.detail.value[5] < 10 ? '0' + e.detail.value[5] : e.detail.value[5]


    let endAll = endY + '-' + endM + '-' + endD + ' ' + endH + ':' + endm + ':' + endS


    this.setData({
      dateTime1: e.detail.value,
      endDate: endAll
    });
  },

  changeDateTimeColumn: function(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr
    });
  },

  changeDateTimeColumn1: function(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr
    });
  },

  /**
   * 是否永久有效
   */
  switch1Change: function(e) {
    let value = e.detail.value
    let isPermanent;
    if (value) {
      isPermanent = value

    } else {
      isPermanent = value
    }

    this.setData({
      isPermanent
    })
  },

  /**
   * 活动场地
   */
  activityVenue: function(e) {
    let value = e.detail.value
    let isAllVenues;
    if (value) {
      isAllVenues = value

    } else {
      isAllVenues = value
    }

    this.setData({
      isAllVenues
    })
  },

  /**
   * 选择优惠券
   */
  chooseCoupons: function() {
    if (!this.data.isDisabled) {
      wx.navigateTo({
        url: '../../coupon/chooseCoupons/chooseCoupons?chooseCoupons=' + JSON.stringify(this.data.chooseCoupons),
      })
    }

  },
  /**
   * 适用场地
   */
  choiceOfVenue: function() {
    if (!this.data.isDisabled) {
      wx.navigateTo({
        url: '../../coupon/choiceOfVenue/choiceOfVenue?locationIds=' + JSON.stringify(this.data.locationIds),
      })
    }
  },
  /**
   * 活动名称
   */
  activityName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 确定事件
   */
  preservation: function() {

    if (this.data.name == '') {
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none'
      })
      return;
    }

    // if (!this.data.isPermanent) {
    //   wx.showToast({
    //     title: '请选择活动时间',
    //     icon: 'none'
    //   })
    //   return;
    // }



    if (this.data.couponId == '') {
      wx.showToast({
        title: '请选择优惠券',
        icon: 'none'
      })
      return;
    }



    if (!this.data.isAllVenues && !this.data.locationIds.length) {
      wx.showToast({
        title: '请选择适用场地',
        icon: 'none'
      })
      return;
    }

    if (this.data.isAllVenues) {
      this.setData({
        locationIds: []
      })
    }

    this.preservationFetch()

  },
  /**
   * 发送确定请求
   */
  preservationFetch: function() {

    console.log(new Date(this.data.startDate).getTime())
    fetch({
        url: '/couponOffers',
        method: 'post',
        isShowLoading: true,
        data: {
          name: this.data.name,
          startDate: new Date(this.data.startDate).getTime(),
          endDate: new Date(this.data.endDate).getTime(),
          couponId: this.data.couponId,
          locationIds: this.data.locationIds,
          permanent: this.data.isPermanent
        }
      })
      .then(res => {

        wx.showToast({
          title: '活动添加成功',
          icon: 'success'
        })

        let timer = null
        timer = setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      })
      .catch(err => {
        console.error(err);
      })
  }

})