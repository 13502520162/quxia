// pages/coupon/newCoupons/newCoupons.js

import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
import dateTimePicker from '../../../../lib/dateTimePicker.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    field: '',
    startDate: '2019-01-01 10:00:00',
    endDate: '2019-01-03 10:00:00',
    note: '',
    maxTrys: '',
    maxTrysDaily: '',
    maxRewards: '',
    maxRewardsDaily: '',
    isFloat: false,
    isPermanent: false,
    locationIds: [],
    entryType: 'PAY',

    setAwards: {},


    isBorder: true,
    discount: true,
    isDisabled: false,

    isNoThreshold: false,

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
      field: options.field,
      id: options.id,
    });

    this.fetchCouponsDetail()

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
   * 表单填充
   */
  fetchCouponsDetail: function() {
    let id = this.data.id
    if (this.data.field == 'view') {
      fetch({
        url: '/lottery/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data
        this.setData({
          name: ress.name,
          locationIds: ress.locationIds,
          startDate: util.formatTime(ress.startDate),
          endDate: util.formatTime(ress.endDate),
          isPermanent: ress.permanent,
          note: ress.note,
          maxRewards: ress.maxRewards,
          maxRewardsDaily: ress.maxRewardsDaily,
          maxTrys: ress.maxTrys,
          maxTrysDaily: ress.maxTrysDaily,
          isFloat: ress.isFloat,
          entryType: ress.entryType,
          locationIds: ress.locationIds,
          isDisabled: true,
          setAwards: {
            missDescription: ress.missDescription,
            missTitle: ress.missTitle,
            prizes: ress.prizes
          }


        })
      })
    } else {
      this.setData({
        isDisabled: false
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
   * 是否永久有效
   */
  switch1Change: function(e) {
    this.setData({
      isPermanent: e.detail.value
    })
  },



  /**
   * 活动规则
   */
  activityRules: function(e) {
    let value = e.detail.value

    this.setData({
      note: e.detail.value
    })
  },



  /**
   * 每人每天抽取多少次
   */
  maxTrys: function(e) {
    this.setData({
      maxTrys: e.detail.value
    })
  },


  /**
   * 每人每天共抽取多少次
   */
  maxTrysDaily: function(e) {
    this.setData({
      maxTrysDaily: e.detail.value
    })
  },


  /**
   * 每人每天中奖多少次
   */
  maxRewards: function(e) {
    this.setData({
      maxRewards: e.detail.value
    })
  },


  /**
   * 每人每天共中奖多少次
   */
  maxRewardsDaily: function(e) {
    this.setData({
      maxRewardsDaily: e.detail.value
    })
  },


  /**
   * 是否漂浮显示
   */
  switch2Change: function(e) {
    this.setData({
      isFloat: e.detail.value
    })
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

    if (this.data.note == '') {
      wx.showToast({
        title: '请输入活动规则',
        icon: 'none'
      })
      return;
    }


    if (this.data.maxTrys == '') {
      wx.showToast({
        title: '请输入每人每天可抽取多少次',
        icon: 'none'
      })
      return;
    }


    if (this.data.maxTrysDaily == '') {
      wx.showToast({
        title: '请输入每人每天共可抽取多少次',
        icon: 'none'
      })
      return;
    }

    if (this.data.maxRewards == '') {
      wx.showToast({
        title: '请输入每人每天可中奖多少次',
        icon: 'none'
      })
      return;
    }


    if (this.data.maxRewardsDaily == '') {
      wx.showToast({
        title: '请输入每人每天共可中奖多少次',
        icon: 'none'
      })
      return;
    }



    // if (!this.data.locationIds.length) {
    //   wx.showToast({
    //     title: '请选择适用场地',
    //     icon: 'none'
    //   })
    //   return;
    // }

    this.preservationFetch()

  },


  /**
   * 下一步 设置奖项
   */
  preservationFetch: function() {
    let isDisabled = this.data.isDisabled,
      field = '';

    if (isDisabled) {
      field = 'view'
    } else {
      field = 'edit'
    }

    let data = {
      name: this.data.name,
      startDate: new Date(this.data.startDate).getTime(),
      endDate: new Date(this.data.endDate).getTime(),
      note: this.data.note,
      maxTrys: parseInt(this.data.maxTrys),
      maxTrysDaily: parseInt(this.data.maxTrysDaily),
      maxRewards: parseInt(this.data.maxRewards),
      maxRewardsDaily: parseInt(this.data.maxRewardsDaily),
      isFloat: this.data.isFloat,
      permanent: this.data.isPermanent,
      locationIds: this.data.locationIds,
      entryType: 'PAY',
    }

    wx.navigateTo({
      url: '../setAwards/setAwards?data=' + JSON.stringify(data) + '&setAwards=' + JSON.stringify(this.data.setAwards) + '&field=' + field,
    })
  }

})