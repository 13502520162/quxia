// pages/manage/luckyFree/newAwards/newAwards.js
import fetch from '../../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [{
        value: 0,
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
    objectArray: [{
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchCoupons()
    this.fetchCards()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  radioChange: function(e) {
    let values = e.detail.value,
      checkboxItems = [];
    if (values == 0) {
      checkboxItems = [{
          value: 0,
          checked: true
        },
        {
          value: 1,
          checked: false
        }
      ]
    } else {
      checkboxItems = [{
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: true
        }
      ]
    }

    this.setData({
      checkboxItems: checkboxItems
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
  }
})