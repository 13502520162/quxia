// pages/manage/membershipCard/newMembershipCard/newMembershipCard.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    frequency: '',
    successfulPayment: '',
    consumptionAmount: '',
    equity: '',
    usageNeeds: '',
    tradeIndex: 0,
    isMeetingConditions: 'payment',
    isTermOfValidity: false,
    isPayment: true,
    isDirect: true,
    isReceive: 'DIRECT',
    objectArray: [],
    receivingSettings: [{
        name: '直接领取',
        value: 'DIRECT',
        checked: true
      },
      {
        name: '满足条件',
        value: 'RULE',
        checked: false
      }
    ],
    meetingConditions: [{
        value: 'payment',
        checked: true
      },
      {
        value: 'consumption',
        checked: false
      }
    ],
    field: '',

    isDisabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      field: options.field,
      id: options.id
    })

    this.fetchSelect()

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let field = this.data.field;
    if (field == 'view' || field == 'edit') {
      this.fetchDetial()
    }

    if (field == 'view') {
      this.setData({
        isDisabled:true
      })
    }
  },

  /**
   *  会员卡筛选
   */
  fetchSelect: function() {
    fetch({
      url: '/vipCards/select',
      isShowLoading: true,

    }).then(res => {
      this.setData({
        objectArray: res.data
      })
    })
  },


  /**
   * 获取会员卡详情
   */
  fetchDetial: function() {
    let id = this.data.id
    fetch({
      url: '/vipCards/detail?id=' + id,
      isShowLoading: true,
    }).then(res => {
      let item = res.data


      let receivingSettings = [],
        meetingConditions = [],
        isDirect = false,
        isReceive = '';
      if (item.acquireType == 'DIRECT') {
        receivingSettings = [{
            name: '直接领取',
            value: 'DIRECT',
            checked: true
          },
          {
            name: '满足条件',
            value: 'RULE',
            checked: false
          }
        ]
        isDirect = true
        isReceive = "DIRECT"
      } else {
        receivingSettings = [{
            name: '直接领取',
            value: 'DIRECT',
            checked: false
          },
          {
            name: '满足条件',
            value: 'RULE',
            checked: true
          }
        ]
        isDirect = false
        isReceive = "RULE"
      }


      if (item.orders && item.orders != null) {
        meetingConditions = [{
            value: 'payment',
            checked: true
          },
          {
            value: 'consumption',
            checked: false
          }
        ]
      } else {
        meetingConditions = [{
            value: 'payment',
            checked: false
          },
          {
            value: 'consumption',
            checked: true
          }
        ]
      }

      this.setData({
        id: item.id,
        name: item.name,
        tradeIndex: item.fallbackCardId,
        frequency: item.validDays,
        successfulPayment: item.orders,
        consumptionAmount: item.total,
        equity: item.discountRate,
        usageNeeds: item.note,
        isTermOfValidity: item.permanent,
        receivingSettings,
        meetingConditions,
        isDirect,
        isReceive
      })
    })
  },

  /**
   * 卡过期后，消费者自动变更至
   */
  bindPickerChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value
    })
  },

  receivingSettings: function(e) {



    var radioItems = this.data.receivingSettings;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }


    let isDirect = true;
    if (e.detail.value == 'DIRECT') {
      isDirect = true;
    } else if (e.detail.value == 'RULE') {
      isDirect = false;
    } else {
      isDirect = true;
    }

    this.setData({
      receivingSettings: radioItems,
      isDirect,
      isReceive: e.detail.value
    });
  },


  /**
   * 满足条件
   */
  meetingConditions: function(e) {

    var radioItems = this.data.meetingConditions;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    let isPayment = true;
    if (e.detail.value == 'payment') {
      isPayment = true;

      this.setData({
        consumptionAmount: ''
      });
    } else {
      isPayment = false;
      this.setData({
        successfulPayment: ''
      });
    }

    this.setData({
      meetingConditions: radioItems,
      isPayment,
      isMeetingConditions: e.detail.value
    });
  },

  termOfValidity: function(e) {
    this.setData({
      isTermOfValidity: e.detail.value
    })
  },

  /**
   * 名称
   */
  activityName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },


  /**
   * 领卡后 ** 天有效
   */
  frequency: function(e) {
    this.setData({
      frequency: e.detail.value
    })
  },

  /**
   * 支付成功 ** 次
   */
  successfulPayment: function(e) {
    this.setData({
      successfulPayment: e.detail.value
    })
  },

  /**
   * 消费金额 ** 次
   */
  consumptionAmount: function(e) {
    this.setData({
      consumptionAmount: e.detail.value
    })
  },

  /**
   * 使用需知
   */
  usageNeeds: function(e) {
    this.setData({
      usageNeeds: e.detail.value
    })
  },

  /**
   * 使用需知
   */
  equity: function(e) {
    this.setData({
      equity: e.detail.value
    })
  },



  /**
   * 确定 
   */
  preservation: function() {

    if (this.data.name == '') {
      wx.showToast({
        title: '请填写会员卡名称',
        icon: 'none'
      })
      return;
    }


    if (!this.data.isTermOfValidity) {
      if (this.data.frequency == '') {
        wx.showToast({
          title: '请填写会领卡后多少内有效',
          icon: 'none'
        })
        return;
      }
    }


    if (this.data.isReceive == "RULE") {
      if (this.data.isMeetingConditions == '') {
        wx.showToast({
          title: '请选择满足条件',
          icon: 'none'
        })
        return;
      } else if (this.data.isMeetingConditions == 'payment') {
        if (this.data.successfulPayment == '') {
          wx.showToast({
            title: '请填写累计支付成功多少次',
            icon: 'none'
          })
          return;
        }
      } else if (this.data.isMeetingConditions == 'consumption') {
        if (this.data.consumptionAmount == '') {
          wx.showToast({
            title: '请填写累计消费金额多少次',
            icon: 'none'
          })
          return;
        }
      }
    } else if (this.data.isReceive == "") {
      wx.showToast({
        title: '请选择领取设置条件',
        icon: 'none'
      })
      return;
    }




    if (this.data.usageNeeds == '') {
      wx.showToast({
        title: '请输入使用需知',
        icon: 'none'
      })
      return;
    }

    if (this.data.equity == '') {
      wx.showToast({
        title: '请输入消费折扣',
        icon: 'none'
      })
      return;
    }


    this.sendRequest()

  },
  /**
   * 发送请求
   */
  sendRequest: function() {
    let id = this.data.id
    fetch({
        url: '/vipCards?id=' + id,
        method: id ? 'put' : 'post',
        isShowLoading: true,
        data: {
          id,
          name: this.data.name,
          permanent: this.data.isTermOfValidity,
          validDays: this.data.frequency,
          fallbackCardId: parseInt(this.data.tradeIndex),
          acquireType: this.data.isReceive,
          orders: parseInt(this.data.successfulPayment),
          total: parseInt(this.data.consumptionAmount),
          note: this.data.usageNeeds,
          discountRate: parseInt(this.data.equity)
        }
      })
      .then(res => {

        let titInfo = id ? '更新会员卡成功' : '新增会员卡成功'
        wx.showToast({
          title: titInfo,
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