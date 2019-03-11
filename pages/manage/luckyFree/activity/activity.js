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
    isPermanent: false,
    locationIds: [],
    note: '',
    probabilityAdjustment: '',
    enableProbabilityAdjustment: '',

    isDisabled: false,
    isUnlimited: false,

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
      id: options.id
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


    let endAll = endY + '/' + endM + '/' + endD + ' ' + endH + ':' + endm + ':' + endS


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
    let id = this.data.id;
    if (this.data.field == 'view') {
      fetch({
        url: '/luckfree/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data;
        console.log(ress)

        this.setData({
          id: ress.id,
          name: ress.name,
          locationIds: ress.locationIds,
          startDate: util.formatTime(ress.startDate),
          endDate: util.formatTime(ress.endDate),
          isPermanent: ress.permanent,
          note: ress.note,
          probabilityAdjustment: ress.probabilityAdjustment,
          enableProbabilityAdjustment: ress.enableProbabilityAdjustment,
        })
      })
    } else {
      this.setData({
        isDisabled: false
      })
    }


  },








  /**
   * 是否无限制
   */
  Unlimited: function(e) {
    let value = e.detail.value

    let isUnlimited

    if (value) {
      isUnlimited = value

    } else {
      isUnlimited = value
    }

    this.setData({
      isUnlimited
    })
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
   * 中奖上浮比例
   */
  frequency: function(e) {
    this.setData({
      probabilityAdjustment: e.detail.value
    })
  },




  /**
   * 活动规则
   */
  activityRules: function(e) {
    this.setData({
      note: e.detail.value
    })
  },


  floatInfo: function() {
    wx.showModal({
      title: '浮动比例',
      showCancel: false,
      confirmText: "关闭",
      content: "注意事项:\r\nA.抽奖档位有三个档次:\r\n “1元”、“x3倍”、“x5倍”,\r\n 具体档位由该笔订单总金额决定; \r\n如:\r\n 订单总金额 > 5元, 会出现三个大乐购档次;\r\n B.中奖概率 = 抽奖档次 / 订单金额 + (抽奖档次 / 订单金额 * 中奖浮动比例)",
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


    if (this.data.note == '') {
      wx.showToast({
        title: '请填写活动规则',
        icon: 'none'
      })
      return;
    }


    if (!this.data.isUnlimited) {
      if (this.data.probabilityAdjustment == '') {
        wx.showToast({
          title: '请填写中奖上浮%',
          icon: 'none'
        })
        return;
      }
    }




    if (!this.data.locationIds.length) {
      wx.showToast({
        title: '请选择适用场地',
        icon: 'none'
      })
      return;
    }

    this.preservationFetch()

  },


  /**
   * 发送确定请求
   */
  preservationFetch: function() {
    let id = this.data.id
    fetch({
        url: '/luckfree',
        method: id ? 'put' : 'post',
        isShowLoading: true,
        data: {
          id,
          name: this.data.name,
          startDate: new Date(this.data.startDate).getTime(),
          endDate: new Date(this.data.endDate).getTime(),
          locationIds: this.data.locationIds,
          permanent: this.data.isPermanent,
          note: this.data.note,
          probabilityAdjustment: parseInt(this.data.probabilityAdjustment),
          enableProbabilityAdjustment: this.data.isUnlimited
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