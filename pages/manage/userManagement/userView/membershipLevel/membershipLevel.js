// pages/manage/userManagement/userView/membershipLevel/membershipLevel.js
import fetch from '../../../../../lib/fetch.js';
import moment from '../../../../../lib/moment.min.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    endDate: '',
    isPermanent: false,
    selIndex: 0,
    vipCards: [],
    note: '',
    id: '',

    cardId: '',
    cardExpiry: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isPermanent = false
    if (options.cardExpiry == '永久有效') {
      isPermanent = true
    }
    this.setData({
      endDate: options.cardDate || moment().add(1, 'days').format('YYYY-MM-DD'),
      id: options.id,
      cardId: options.cardId,
      isPermanent
    }, () => {
      this.fetchVipCardS()
    })

  },
  onShow: function() {

  },
  changeDateTime: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  switch1Change: function(e) {
    this.setData({
      isPermanent: e.detail.value
    })
  },
  fetchVipCardS: function() {
    fetch({
      url: '/vipCards/select'
    }).then(res => {
      let cardId = this.data.cardId;
      console.log(cardId)
      if (cardId) {
        for (let i = 0; i < res.data.length; i++) {
          if (cardId == res.data[i].id) {
            this.setData({
              vipCards: res.data,
              selIndex: i
            })
          }
        }
      }
      this.setData({
        vipCards: res.data
      })
    })
  },
  onFilterChange: function(e) {
    this.setData({
      selIndex: e.detail.value,
      cardId: ''
    })
  },

  adjustmentNotes: function(e) {
    this.setData({
      note: e.detail.value
    })
  },

  preservation: function() {
    if (this.data.note == '') {
      wx.showToast({
        title: '请填写调整备注',
        icon: 'none'
      })

      return;
    }
    let isPermanent = this.data.isPermanent,
      expiry;
    if (isPermanent) {
      expiry = ''
    }else{
      expiry = new Date(this.data.endDate).getTime()
    }


    fetch({
      url: '/customers/cards',
      method: 'POST',
      data: {
        id: parseInt(this.data.id),
        cardId: this.data.vipCards[this.data.selIndex].id,
        permanent: this.data.isPermanent,
        expiry: expiry,
        note: this.data.note
      }
    }).then(res => {
      wx.showToast({
        title: '设置成功',
        icon: 'none'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })

        let pages = getCurrentPages()
        let prepage = pages[pages.length - 2];
        let permanent = this.data.isPermanent
        let cardExpiry = ''
        if (permanent) {
          cardExpiry = '永久有效'
        } else {
          cardExpiry = this.data.endDate + '前有效'
        }
        prepage.setData({
          userInfo: {
            ...prepage.data.userInfo,
            cardExpiry,
            cardName: this.data.vipCards[this.data.selIndex].name
          }
        })


      }, 1500)
    })
  }
})