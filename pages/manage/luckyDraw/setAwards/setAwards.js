// pages/manage/luckyFree/setAwards/setAwards.js
import fetch from '../../../../lib/fetch.js';
import util from '../../../../lib/moment.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: false,


    missTitle: '',
    missDescription: '',
    activeData: {},
    winningSettings: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let setAwards = JSON.parse(options.setAwards)

    this.setData({
      activeData: JSON.parse(options.data),
      isDisabled: options.isDisabled
    })

    if (JSON.stringify(setAwards) != "{}") {
      this.setData({
        winningSettings: setAwards.prizes,
        missTitle: setAwards.missTitle,
        missDescription: setAwards.missDescription
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 接收添加的奖项
   */
  updateWinningSettings: function(data) {

    console.log(data)
    let newData = data.map(function(item, index) {
      item.index = index + 1;
      return item;
    })

    this.setData({
      winningSettings: newData
    })
  },


  winningPrizes: function(e) {
    let data = e.currentTarget.dataset.data
    let isDisabled = this.data.isDisabled;
    
    wx.navigateTo({
      url: '../newAwards/newAwards?currData=' + JSON.stringify(data) + '&curr=curr&winningSettings=' + JSON.stringify(this.data.winningSettings) + '&isDisabled=' + isDisabled,
    })
  },

  /**
   * 添加奖项
   */
  addAwards: function() {



    wx.navigateTo({
      url: '../newAwards/newAwards?winningSettings=' + JSON.stringify(this.data.winningSettings)
    })
  },

  /**
   * 标题
   */

  missTitle: function(e) {
    this.setData({
      missTitle: e.detail.value
    })
  },



  /**
   * 提示语
   */

  missDescription: function(e) {
    this.setData({
      missDescription: e.detail.value
    })
  },

  /**
   * 确定
   */
  preservation: function() {



    if (!this.data.winningSettings.length) {
      wx.showToast({
        title: '请添加中奖奖项',
        icon: 'none'
      })
      return;
    }

    if (this.data.missTitle == '') {
      wx.showToast({
        title: '请输入未中奖标题',
        icon: 'none'
      })
      return;
    }


    if (this.data.missDescription == '') {
      wx.showToast({
        title: '请输入未中奖提示书',
        icon: 'none'
      })
      return;
    }


    let prizes = this.data.winningSettings


    fetch({
      url: '/lottery',
      method: 'POST',
      data: {
        ...this.data.activeData,
        prizes,
        missTitle: this.data.missTitle,
        missDescription: this.data.missDescription
      }
    }).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '抽奖活动添加成功',
          icon: 'success'
        })

        setTimeout(() => {
          wx.navigateBack({
            detal: 2
          })
        }, 1500)

      } else {
        wx.showToast({
          title: '抽奖活动添加失败',
          icon: 'error'
        })
      }
    })

  }
})