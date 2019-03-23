import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationId: null,
    productId: null,
    amount: 0,
    note: '',
    isDisabled: false,
    summaryData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.locationId && options.productId) {
      this.setData({
        locationId: options.locationId,
        productId: options.productId
      })
      this.fetchSummary();
    }
  },

  /**
   * 获取汇总
   */
  fetchSummary: function() {
    fetch({
        url: '/inventory/totalStock',
        data: {
          locationId: this.data.locationId,
          productId: this.data.productId
        }
      })
      .then(res => {
        this.setData({
          summaryData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 添加数量
   */

  addBtn: function() {
    let num = this.data.amount;
    if (num >= this.data.summaryData.availableStock) {
      return;
    }
    this.setData({
      amount: num + 1
    })
  },

  /**
   * 减少数量
   */

  reduceBtn: function() {
    let num = this.data.amount
    if (num > 0) {
      this.setData({
        amount: num - 1
      })
    }
  },

  /**
   * 退货原因改变
   */
  onNoteChange: function(e) {
    if (e.detail.value.length <= 200) {
      this.setData({
        note: e.detail.value
      })
    }
  },

  /**
   * 退货数量更改
   */
  onAmountChange: function(e) {
    this.setData({
      amount: e.detail.value
    })
  },

  /**
   * 提交数据
   */
  submit: function() {
    if (!this.data.amount) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
      return;
    }
    this.setData({
      isDisabled: true
    })
    if (this.data.summaryData.availableStock < this.data.amount) {
      wx.showToast({
        title: '请输入正确的退货数量',
        icon: 'none'
      })
      return;
    }

    if (!this.data.note.length) {
      wx.showToast({
        title: '请输入退货原因',
        icon: 'none'
      })
      return;
    }
    fetch({
        url: '/inventory/return',
        method: 'post',
        data: {
          locationId: this.data.locationId,
          productId: this.data.productId,
          amount: this.data.amount,
          note: this.data.note
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
      .catch(err => {
        this.setData({
          isDisabled: false
        })
        console.error(err);
      })
  }
})