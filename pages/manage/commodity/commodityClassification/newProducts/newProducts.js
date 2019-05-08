// pages/manage/commodity/commodityClassification/newProducts/newProducts.js

import fetch from '../../../../../lib/fetch.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    displayOrder: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id,
        name: options.name,
        displayOrder: options.displayOrder == 'null' ? '' : options.displayOrder
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
  activityName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  displayOrder: function (e) {
    this.setData({
      displayOrder: e.detail.value
    })
  },

  preservation: function() {
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return;
    }


    let id = this.data.id;
    fetch({
      url: '/categories?id=' + id,
      method: id ? 'PUT' : "POST",
      data: {
        name: this.data.name,
        id: parseInt(id),
        displayOrder: this.data.displayOrder
      }
    }).then(res => {
      let info = id ? '更新成功' : '新增成功'
      wx.showToast({
        title: info,
        icon: 'success'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })
      }, 1500)
    })
  }
})