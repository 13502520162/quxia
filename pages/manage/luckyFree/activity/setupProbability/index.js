// pages/manage/luckyFree/activity/setupProbability/index.js

import fetch from '../../../../../lib/fetch.js'
import util from '../../../../../utils/util.js'
import dateTimePicker from '../../../../../lib/dateTimePicker.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    locationIds: '',
    permanent: null,
    note: '',

    isUnlimited: false,
    isDisabled: false,
    showRealProbability: false,
    probabilityAdjustment: '',
    enableProbabilityAdjustment: false,
    maxRate: '',
    minRate: '',
    array: [1, 3, 5],
    index: 0,

    orderTotal: '',
    grade: '',


    state: '',

    calculationResults: {
      maxCount: '',
      minCount: '',
      paidMax: '',
      paidMin: '',
      price: '',
      probability: '',
      realProbability: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.firstData) {
      let firstData = JSON.parse(options.firstData)
      this.setData({
        name: firstData.name,
        startDate: firstData.startDate,
        endDate: firstData.endDate,
        locationIds: firstData.locationIds,
        permanent: firstData.permanent,
        note: firstData.note,
      })
    }

    if (options.lastData != '{}') {
      let lastData = JSON.parse(options.lastData);

      let state = false;
      if (lastData.state == 'DISABLED' || lastData.state == 'ENDED') {
        state = true
      }

      this.setData({
        id: lastData.id,
        enableProbabilityAdjustment: lastData.enableProbabilityAdjustment,
        showRealProbability: lastData.showRealProbability,
        probabilityAdjustment: lastData.probabilityAdjustment,
        minRate: lastData.minRate,
        maxRate: lastData.maxRate,
        state,
      })
    }
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


  /**
   * 是否不设置中奖浮动比例
   */
  enableProbabilityAdjustment: function(e) {
    let value = e.detail.value
    this.setData({
      enableProbabilityAdjustment: value
    })

    if (value) {
      this.setData({
        showRealProbability: false,
        probabilityAdjustment: ''
      })
    }
  },

  /**
   * 是否不显示真实案例
   */
  isShow: function(e) {

    this.setData({
      showRealProbability: e.detail.value
    })
  },



  /**
   * 中奖上浮比例
   */
  frequency: function(e) {

    let value = e.detail.value
    var replaceArray = [];
    for (let i = 0; i < value.length; ++i) { //正则判断是否合法
      var textValue = (/^[.+-_0-9]$/.test(value.charAt(i)));
      if (!textValue) {
        replaceArray.push(value.charAt(i));
      }
    }
    if (replaceArray.length != 0) {
      wx.showToast({
        title: '只能输入数字，减号',
        icon: 'none'
      })
      for (let j = 0; j < replaceArray.length; ++j) { //循环删除不合法内容

        value = value.replace(replaceArray[j], '');
      }
    }


    this.setData({
      probabilityAdjustment: value,
    })
  },


  /**
   * 中奖保底值
   */
  minRate: function(e) {
    this.setData({
      minRate: e.detail.value
    })
  },


  /**
   *中奖阀值
   */
  maxRate: function(e) {
    this.setData({
      maxRate: e.detail.value
    })
  },


  /**
   * 订单金额
   */
  orderTotal: function(e) {
    this.setData({
      orderTotal: e.detail.value
    })
  },

  /**
   * 档次
   */
  Grade: function(e) {
    this.setData({
      index: e.detail.value
    })
  },



  /**
   * 计算
   */
  calculation: function() {


    if (!this.data.enableProbabilityAdjustment) {
      if (!this.data.probabilityAdjustment) {
        wx.showToast({
          title: '请填写中奖概率上浮',
          icon: 'none'
        })
        return false;
      }
    }



    if (!this.data.showRealProbability) {
      if (!this.data.minRate || !this.data.maxRate) {
        wx.showToast({
          title: '中奖阈值或中奖保底值必填',
          icon: 'none'
        })
        return false;
      }
    }

    if (!this.data.orderTotal) {
      wx.showToast({
        title: '请填写订单金额',
        icon: 'none'
      })
      return false;
    }

    fetch({
      url: '/luckfree/calculate',
      method: 'post',
      data: {
        times: this.data.array[this.data.index],
        orderTotal: parseInt(this.data.orderTotal),
        probabilityAdjustment: this.data.probabilityAdjustment,
        showRealProbability: this.data.showRealProbability,
        minRate: parseInt(this.data.minRate),
        maxRate: parseInt(this.data.maxRate),
      }
    }).then(res => {
      this.setData({
        calculationResults: {
          ...res.data
        }
      })
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


  threshold: function() {
    wx.showModal({
      title: '中奖阈值',
      showCancel: false,
      confirmText: "关闭",
      content: "中奖阀值 - 累计收入大于等于订单金额 + （中奖阀值百分比 × 订单金额）， 必中奖。\r\n 举例：\r\n 假设订单金额20元， 抽奖档次为1元/1倍， 不设置中奖浮动比例， 则单次中奖概率为1/20 = 5%，如果中奖阀值设置成10%， 则累计收入大于等于 20 + （10% × 20） = 22时， 必中奖。",
    })
  },


  bottomGuard: function() {
    wx.showModal({
      title: '中奖保底值',
      showCancel: false,
      confirmText: "关闭",
      content: "中奖保底值 - 累计收入若小于订单金额 × 中奖保底值%， 必定不中奖， 保证最低收入。\r\n 举例：\r\n 假设订单金额20元， 抽奖档次为1元/1倍， 不设置中奖浮动比例， 则单次中奖概率为1/20 = 5%，如果中奖保底值设置成10%， 则累计收入小于  20 × 10% = 2时， 必定不中奖。",
    })
  },


  /**
   * 发送确定请求
   */
  preservationFetch: function() {


    if (!this.data.enableProbabilityAdjustment) {
      if (!this.data.probabilityAdjustment) {
        wx.showToast({
          title: '请填写中奖概率上浮',
          icon: 'none'
        })
        return false;
      }
    }



    if (!this.data.showRealProbability) {
      if (!this.data.minRate || !this.data.maxRate) {
        wx.showToast({
          title: '中奖阈值或中奖保底值必填',
          icon: 'none'
        })
        return false;
      }
    }

    if (this.data.isUnlimited) {
      this.setData({
        probabilityAdjustment: ''
      })
    }

    if (this.data.showRealProbability) {
      this.setData({
        minRate: '',
        maxRate: '',
      })
    }

    let id = this.data.id

    fetch({
        url: id ? '/luckfree?id=' + id : '/luckfree',
        method: id ? 'put' : 'post',
        isShowLoading: true,
        data: {
          id: this.data.id,
          name: this.data.name,
          startDate: new Date(this.data.startDate).getTime(),
          endDate: new Date(this.data.endDate).getTime(),
          locationIds: this.data.locationIds,
          permanent: this.data.permanent,
          note: this.data.note,
          probabilityAdjustment: this.data.probabilityAdjustment,
          enableProbabilityAdjustment: this.data.enableProbabilityAdjustment,

          showRealProbability: this.data.showRealProbability,
          minRate: this.data.minRate,
          maxRate: this.data.maxRate,
        }
      })
      .then(res => {

        if (id) {
          wx.showToast({
            title: '活动修改成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '活动添加成功',
            icon: 'success'
          })
        }


        let timer = null
        timer = setTimeout(function() {
          wx.navigateBack({
            delta: 2
          })
        }, 2000)
      })
      .catch(err => {
        console.error(err);
      })
  }



})