// pages/coupon/newCoupons/newCoupons.js

import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
    name: '',
    field: '',
    startDate: '2019-01-01',
    endDate: '2019-01-03',
    isThreshold: true,
    isBorder: true,
    isLimit: true,
    isFixed: true,
    discount: true,
    isAllVenues: false,
    preferentialForm: 'AMOUNT_OFF',
    dateRule: 'FIXED',
    radioItems: [{
        name: '减免',
        value: 'AMOUNT_OFF',
        checked: true
      },
      {
        name: '打折',
        value: 'DISCOUNT_RATE',
        checked: false
      }
    ],
    validDays: '',
    amount: '',
    minAmount: '',
    maxStock: '',
    isDisabled: false,
    limitPerCustomer: '',
    termOfValidityArr: [{
        name: '固定时间',
        value: 'FIXED',
        checked: true
      },
      {
        name: '领取后*天内有效',
        value: 'AFTER_ACQUIRED',
        checked: false
      }
    ],
    locationIds: [],
    threshold: [{
      name: '无门槛',
      value: '1',
      checked: false
    }],
    limit: [{
      name: '不限制',
      value: '1',
      checked: false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var TIME = util.formatDate(new Date());
    this.setData({
      startDate: TIME,
      endDate: TIME,
      field: options.field
    });
    if (options.id) {
      this.setData({
        couponId: options.id
      });
    }

    this.fetchCouponsDetail(options.id)
  },
  /**
   * 表单填充
   */
  fetchCouponsDetail: function(id) {
    if (this.data.field == 'view') {
      fetch({
        url: '/coupons/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data;
        // 判断是否减免还是打折
        if (ress.type == 'AMOUNT_OFF') {
          this.discount = true
          this.radioItems = [{
              name: '减免',
              value: 'AMOUNT_OFF',
              checked: true
            },
            {
              name: '打折',
              value: 'DISCOUNT_RATE',
              checked: false
            }
          ]
        } else {
          this.discount = false
          this.radioItems = [{
              name: '减免',
              value: 'AMOUNT_OFF',
              checked: false
            },
            {
              name: '打折',
              value: 'DISCOUNT_RATE',
              checked: true
            }
          ]
        }

        // 判断是否固定时间还是领取n天内有效
        if (ress.dateRule == 'FIXED') {
          this.termOfValidityArr = [{
              name: '固定时间',
              value: 'FIXED',
              checked: true
            },
            {
              name: '领取后*天内有效',
              value: 'AFTER_ACQUIRED',
              checked: false
            }
          ]
          this.isFixed = true
        } else {
          this.termOfValidityArr = [{
              name: '固定时间',
              value: 'FIXED',
              checked: false
            },
            {
              name: '领取后*天内有效',
              value: 'AFTER_ACQUIRED',
              checked: true
            }
          ]
          this.isFixed = false
          this.validDays = ress.validDays
        }


        // 判断是无门槛还是订单满多少元
        if (ress.minAmount) {

          this.threshold = [{
            name: '无门槛',
            value: '1',
            checked: false
          }]
          this.minAmount = ress.minAmount
          this.isThreshold = true
        } else {
          this.threshold = [{
            name: '无门槛',
            value: '0',
            checked: true
          }]

          this.minAmount = 0
          this.isThreshold = false
        }



        // 判断是领取限制
        if (ress.limitPerCustomer) {

          this.limit = [{
            name: '不限制',
            value: '空',
            checked: false
          }]

          this.isLimit = true
          this.limitPerCustomer = ress.limitPerCustomer
        } else {


          this.limit = [{
            name: '不限制',
            value: 1,
            checked: true
          }]

          this.isLimit = false
          this.limitPerCustomer = 0
        }
        this.setData({
          name: ress.name,
          radioItems: this.radioItems,
          termOfValidityArr: this.termOfValidityArr,
          discount: this.discount,
          dateRule: ress.dateRule,
          isFixed: this.isFixed,
          validDays: this.validDays,
          amount: ress.amount,
          minAmount: this.minAmount,
          threshold: this.threshold,
          isThreshold: this.isThreshold,
          limit: this.limit,
          limitPerCustomer: this.limitPerCustomer,
          isLimit: this.isLimit,
          locationIds: ress.locationIds,
          startDate: util.formatTimeTwo(ress.startDate),
          endDate: util.formatTimeTwo(ress.endDate),
          maxStock: ress.maxStock,
          isDisabled: true,
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
   * 优惠形式的事件
   */
  radioChange: function(e) {

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    if (e.detail.value == 'AMOUNT_OFF') {
      this.setData({
        discount: true
      });
    } else {
      this.setData({
        discount: false,
        amount: ''
      });
    }

    this.setData({
      radioItems: radioItems,
      preferentialForm: e.detail.value
    });
  },
  /**
   * 有效期的事件
   */
  termOfValidity: function(e) {
    var termOfValidity = this.data.termOfValidityArr;
    for (var i = 0, len = termOfValidity.length; i < len; ++i) {
      termOfValidity[i].checked = termOfValidity[i].value == e.detail.value;
    }


    if (e.detail.value == 'FIXED') {
      this.setData({
        isFixed: true
      });
    } else {
      this.setData({
        isFixed: false
      });
    }

    this.setData({
      termOfValidityArr: termOfValidity,
      dateRule: e.detail.value
    });
  },
  /**
   * 领取限制事件
   */
  limitChange: function(e) {


    var limitChange = this.data.limit;
    for (var i = 0, len = limitChange.length; i < len; ++i) {
      limitChange[i].checked = limitChange[i].value == e.detail.value;
    }



    if (e.detail.value == '') {
      this.setData({
        isLimit: true,
        isBorder: false,
        limitPerCustomer: e.detail.value
      });
    } else {
      this.setData({
        isLimit: false,
        isBorder: true,
        limitPerCustomer: 0
      });
    }

    this.setData({
      limit: limitChange
    });
  },
  /**
   * 使用门槛的事件
   */
  radioThresholdChange: function(e) {

    var threshold = this.data.threshold;

    for (var i = 0, len = threshold.length; i < len; ++i) {
      threshold[i].checked = threshold[i].value == e.detail.value;
    }

    if (e.detail.value == 0) {
      this.setData({
        isThreshold: true,
        minAmount: ''
      });
    } else {
      this.setData({
        isThreshold: false
      });
    }

    this.setData({
      threshold: threshold,

    });
  },
  /**
   * 有效期的开始时间
   */
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  /**
   * 有效期的结束时间
   */
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  /**
   * 适用场地
   */
  choiceOfVenue: function() {
    if (!this.data.isDisabled) {
      wx.navigateTo({
        url: '../choiceOfVenue/choiceOfVenue?locationIds=' + JSON.stringify(this.data.locationIds),
      })
    }
  },
  /**
   * 优惠券名称
   */
  couponName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 有效期多少天
   */
  validDays: function(e) {
    this.setData({
      validDays: e.detail.value
    })
  },
  /**
   * 订单满xx元
   */
  minAmounts: function(e) {
    this.setData({
      minAmount: e.detail.value
    })
  },
  /**
   * 优惠额度
   */
  amount: function(e) {
    let value = e.detail.value
    let discount = this.data.discount
    console.log(discount)
    if (!discount) {
      if (value >= 10) {
        wx.showToast({
          title: '打折额度不能超过10',
          icon: 'none'
        })
        value = ''
      }
    }
    this.setData({
      amount: value
    })
  },
  /**
   * 发放总量
   */
  maxStock: function(e) {
    this.setData({
      maxStock: e.detail.value
    })
  },
  /**
   * 可领取
   */
  limitPerCustomers: function(e) {
    this.setData({
      limitPerCustomer: e.detail.value
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
   * 保存事件
   */
  preservation: function() {

    if (this.data.preferentialForm == '') {
      wx.showToast({
        title: '请选择优惠形式',
        icon: 'none'
      })
      return;
    }


    if (this.data.dateRule == '') {
      wx.showToast({
        title: '请选择有效期',
        icon: 'none'
      })
      return;
    }


    if (this.data.dateRule == 'AFTER_ACQUIRED') {
      if (this.data.validDays == '') {
        wx.showToast({
          title: '请填写领取后*天有效',
          icon: 'none'
        })
        return;
      }
    }

    if (this.data.name == '') {
      wx.showToast({
        title: '请输入优惠券名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.isThreshold) {
      if (this.data.minAmount == '') {
        wx.showToast({
          title: '请填写适用门槛',
          icon: 'none'
        })
        return;
      }
    }

    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入优惠额度',
        icon: 'none'
      })
      return;
    }


    if (this.data.maxStock == '') {
      wx.showToast({
        title: '请输入发放总量',
        icon: 'none'
      })
      return;
    }


    if (this.data.isLimit) {
      if (this.data.limitPerCustomer == '') {
        wx.showToast({
          title: '请输入领取限制',
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


    if (this.data.isAllVenues) {
      this.setData({
        locationIds: []
      })
    }

    this.preservationFetch()

  },
  /**
   * 发送保存请求
   */
  preservationFetch: function() {
    let couponId = parseInt(this.data.couponId);
    console.log(couponId)

    fetch({
        url: couponId ? '/coupons?id=' + couponId : '/coupons',
        method: couponId ? 'put' : 'post',
        isShowLoading: true,
        data: {
          id: couponId,
          name: this.data.name,
          type: this.data.preferentialForm,
          minAmount: this.data.minAmount,
          amount: this.data.amount,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          dateRule: this.data.dateRule,
          validDays: this.data.validDays,
          maxStock: this.data.maxStock,
          limitPerCustomer: parseInt(this.data.limitPerCustomer),
          locationIds: this.data.locationIds
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
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