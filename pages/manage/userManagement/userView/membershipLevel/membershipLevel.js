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
    note: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      endDate: moment().format('YYYY-MM-DD')
    })
    this.fetchVipCardS()
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
      this.setData({
        vipCards: res.data
      })
    })
  },
  onFilterChange: function(e) {
    this.setData({
      selIndex: e.detail.value
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


    fetch({
      url: '/customers/cards',
      method: 'POST',
      data: {
        cardId: this.data.vipCards[this.data.selIndex].id,
        expiry: this.dataisPermanent || new Date(this.data.endDate).getTime(),
        note: this.data.note
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '设置成功',
        icon: 'none'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })
      }, 1500)
    })
  }
})