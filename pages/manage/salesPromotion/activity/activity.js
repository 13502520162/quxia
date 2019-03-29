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
    iptpiece: '',
    iptelement: '',
    discount: '',
    reduceMoney: '',
    frequency: '',
    locationIds: [],
    isDisabled: false,
    isPermanent: false,
    isUnlimited: false,
    isNoThreshold: false,
    isAllVenues: false,
    fullNumber: 'QUANTITY',
    preferential: 'DISCOUNT_RATE',
    termOfValidityArr: [{
        name: '件',
        value: 'QUANTITY',
        checked: true
      },
      {
        name: '元',
        value: 'TOTAL',
        checked: false
      }
    ],
    preferentialWay: [{
        name: '折',
        value: 'DISCOUNT_RATE',
        checked: true
      },
      {
        name: '元',
        value: 'AMOUNT_OFF',
        checked: false
      }
    ],

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
  fetchCouponsDetail: function(id) {
    if (this.data.field == 'view') {
      fetch({
        url: '/discountOffers/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data;

        console.log(ress)

        let isUnlimited = false;
        if (ress.limitPerCustomer) {
          isUnlimited = false
        } else {
          isUnlimited = true
        }

        let discount, reduceMoney, preferentialWay = [],
          termOfValidityArr = [];

        if (ress.discountType == 'DISCOUNT_RATE') {
          preferentialWay = [{
              name: '折',
              value: 'DISCOUNT_RATE',
              checked: true
            },
            {
              name: '元',
              value: 'AMOUNT_OFF',
              checked: false
            }
          ]
          discount = ress.discount
          reduceMoney = ''
        } else {
          preferentialWay = [{
              name: '折',
              value: 'DISCOUNT_RATE',
              checked: false
            },
            {
              name: '元',
              value: 'AMOUNT_OFF',
              checked: true
            }
          ]
          discount = ''
          reduceMoney = ress.discount
        }


        if (ress.ruleType == 'QUANTITY') {
          termOfValidityArr = [{
              name: '件',
              value: 'QUANTITY',
              checked: true
            },
            {
              name: '元',
              value: 'TOTAL',
              checked: false
            }
          ]
        } else {
          termOfValidityArr = [{
              name: '件',
              value: 'QUANTITY',
              checked: false
            },
            {
              name: '元',
              value: 'TOTAL',
              checked: true
            }
          ]
        }


        this.setData({
          name: ress.name,
          locationIds: ress.locationIds,
          startDate: util.formatTime(ress.startDate),
          endDate: util.formatTime(ress.endDate),
          isPermanent: ress.permanent,
          isNoThreshold: !ress.applyRule,
          frequency: ress.limitPerCustomer,
          preferential: ress.discountType,
          discount,
          reduceMoney,
          preferentialWay,
          termOfValidityArr,
          iptpiece: ress.minQuantity,
          iptelement: ress.minAmount,
          isDisabled: true,
          isUnlimited,
          isAllVenues: ress.locationIds.length === 0
        })
      })
    } else {
      this.setData({
        isDisabled: false
      })
    }


  },
  /**
   * 满 * 件 / 满 *元
   */
  termOfValidity: function(e) {

    var radioItems = this.data.termOfValidityArr;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }


    this.setData({
      fullNumber: e.detail.value,
      termOfValidityArr: radioItems
    })
  },
  /**
   * 优惠形式
   */
  preferentialWay: function(e) {

    var radioItems = this.data.preferentialWay;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }


    this.setData({
      preferential: e.detail.value,
      preferentialWay: radioItems
    })
  },
  /**
   * 是否无门槛
   */
  noThreshold: function(e) {
    let value = e.detail.value

    let isNoThreshold

    if (value) {
      isNoThreshold = value

    } else {
      isNoThreshold = value
    }

    this.setData({
      isNoThreshold
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
   * 每人参与 * 次
   */
  frequency: function(e) {
    this.setData({
      frequency: e.detail.value
    })
  },


  /**
   * 参与次数
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
   * 满多少件
   */
  iptQUANTITY: function(e) {
    this.setData({
      iptpiece: e.detail.value
    })
  },


  /**
   * 满多少元
   */
  iptTOTAL: function(e) {
    this.setData({
      iptelement: e.detail.value
    })
  },


  /**
   * 打多少折
   */
  iptDiscount: function(e) {
    let value = e.detail.value
    if (value >= 10) {
      wx.showToast({
        title: '打折额度不能超过10',
        icon: 'none'
      })
      value = ''
    }


    this.setData({
      discount: value
    })
  },


  /**
   * 减多少元
   */
  iptReduceMoney: function(e) {
    this.setData({
      reduceMoney: e.detail.value
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


    if (!this.data.isNoThreshold) {
      if (this.data.fullNumber == "QUANTITY") {
        if (this.data.iptpiece == '') {
          wx.showToast({
            title: '请填写满多少件',
            icon: 'none'
          })
          return;
        }
      } else if (this.data.fullNumber == "TOTAL") {
        if (this.data.iptelement == '') {
          wx.showToast({
            title: '请填写满多少元',
            icon: 'none'
          })
          return;
        }
      } else if (this.data.fullNumber == "") {
        wx.showToast({
          title: '请选择无门槛形式',
          icon: 'none'
        })
        return;
      }
    }



    if (this.data.preferential == "DISCOUNT_RATE") {
      if (this.data.discount == '') {
        wx.showToast({
          title: '请填写打多少折',
          icon: 'none'
        })
        return;
      }
    } else if (this.data.preferential == "AMOUNT_OFF") {
      if (this.data.reduceMoney == '') {
        wx.showToast({
          title: '请填写减多少元',
          icon: 'none'
        })
        return;
      }
    } else if (this.data.preferential == "") {
      wx.showToast({
        title: '请选择优惠方式',
        icon: 'none'
      })
      return;
    }

    if (!this.data.isUnlimited) {
      if (this.data.frequency == '') {
        wx.showToast({
          title: '请填写参与次数',
          icon: 'none'
        })
        return;
      }
    }

    if (!this.data.isAllVenues && !this.data.locationIds.length) {
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

    fetch({
        url: '/discountOffers',
        method: 'post',
        isShowLoading: true,
        data: {
          name: this.data.name,
          startDate: new Date(this.data.startDate).getTime(),
          endDate: new Date(this.data.endDate).getTime(),
          locationIds: this.data.locationIds,
          permanent: this.data.isPermanent,
          minAmount: this.data.iptelement,
          minQuantity: this.data.iptpiece,
          ruleType: this.data.fullNumber,
          applyRule: !this.data.isNoThreshold,
          limitPerCustomer: parseInt(this.data.frequency) || 0,
          discountType: this.data.preferential,
          discount: this.data.discount || this.data.reduceMoney
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