// pages/manage/luckyFree/newAwards/newAwards.js
import fetch from '../../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isDisabled: false,


    index: '',
    name: '',
    stock: '',
    probability: '',
    type: 'COUPON',
    itemId: '',

    checkboxItems: [{
        value: 2,
        checked: true
      },
      {
        value: 1,
        checked: false
      }
    ],

    conpons: [],
    conponsIndex: 0,
    vipCards: [],
    vipCardsIndex: 0,

    winningSettings: [],
    currData: {},
    curr: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchCoupons()
    this.fetchCards()


    if (options.winningSettings) {
      this.setData({
        winningSettings: JSON.parse(options.winningSettings),
        isDisabled: options.isDisabled
      })
    }


    if (options.curr) { //判断是否是单个对象传进来的
      this.setData({
        curr: options.curr,
        currData: JSON.parse(options.currData)
      })

      this.currDataInit()
    }



  },



  /**
   * 单个对象赋值
   */
  currDataInit: function() {
    let currData = this.data.currData
    this.setData({
      index: currData.index,
      name: currData.name,
      stock: currData.stock,
      probability: currData.probability,
      type: 'COUPON',
      itemId: '',
    })
  },


  /**
   * 
   */
  radioChange: function(e) {
    let values = e.detail.value,
      type = '',
      checkboxItems = [];

    if (values == 2) {
      checkboxItems = [{
          value: 2,
          checked: true
        },
        {
          value: 1,
          checked: false
        }
      ]
      type = 'COUPON'
    } else if (values == 1) {
      checkboxItems = [{
          value: 2,
          checked: false
        },
        {
          value: 1,
          checked: true
        }
      ]
      type = 'CARD'
    } else {
      checkboxItems = [{
          value: 2,
          checked: false
        },
        {
          value: 1,
          checked: false
        }
      ]
      type = ''
    }

    this.setData({
      checkboxItems,
      type
    });
  },

  /**
   * 获取优惠券列表
   */
  fetchCoupons: function() {
    fetch({
      url: '/coupons/select'
    }).then(res => {

      this.setData({
        conpons: res.data
      })
    })
  },




  /**
   * 获取会员卡列表
   */
  fetchCards: function() {
    fetch({
      url: '/vipCards/select'
    }).then(res => {

      this.setData({
        vipCards: res.data
      })
    })
  },

  bindPickerconpons: function(e) {
    this.setData({
      conponsIndex: e.detail.value
    })
  },

  bindPickervipCards: function(e) {
    this.setData({
      vipCardsIndex: e.detail.value
    })
  },

  awardsName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  awardsNum: function(e) {
    this.setData({
      stock: e.detail.value
    })
  },

  awardsProbability: function(e) {
    this.setData({
      probability: e.detail.value
    })
  },

  /**
   * 确定
   */
  preservation: function() {

    if (this.data.name == '') {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.stock == '') {
      wx.showToast({
        title: '请输入奖品数量',
        icon: 'none'
      })
      return;
    }


    if (this.data.probability == '') {
      wx.showToast({
        title: '请输入中奖概率',
        icon: 'none'
      })
      return;
    }

    if (this.data.type == '') {
      wx.showToast({
        title: '请输入选择优惠券或会员卡',
        icon: 'none'
      })
      return;
    }




    let curr = this.data.curr;

    let index = this.data.index;
    let winningSettings = this.data.winningSettings //全部的奖项
    let newArr = [];

    let couponId = this.data.conpons[this.data.conponsIndex].id
    let vipCardId = this.data.vipCards[this.data.vipCardsIndex].id
    let itemId = ''

    if (this.data.type == "COUPON") {
      itemId = couponId
    } else {
      itemId = vipCardId
    }

    let data = { // 当前奖项的值
      name: this.data.name,
      stock: this.data.stock,
      probability: this.data.probability,
      type: this.data.type,
      itemId
    }

    newArr.push(data)

    for (let i = 0; i < winningSettings.length; i++) {
      if (winningSettings[i].index == index) {
        winningSettings.splice(i, 1)
      }
    }


    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象


    let winning = [...newArr, ...winningSettings]

    if (wxPrevPage) {
      //修改上级页面的数据
      wxPrevPage.updateWinningSettings(winning)

      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })

      setTimeout(() => {
        wx.navigateBack({
          detal: 1
        })
      }, 1000)

    }




  }

})