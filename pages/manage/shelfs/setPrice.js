// pages/manage/shelfs/setPrice.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      this.initData();
  },

  initData: function () {
    let pages = getCurrentPages();
    let prepage = pages[pages.length-2];
    this.setData({
      shelfsData: prepage.data.shelfs
    })
  },

  onPriceChange: function(e){
    let shelfs = this.data.shelfsData.shelfs;
    let index = e.currentTarget.dataset.index;
    shelfs[index].price = e.detail.value;
    this.setData({
      shelfsData: { ...this.data.shelfsData, shelfs: shelfs }
    })
  },

  submit: function() {
    let id = this.data.shelfsData.id;
    fetch({
      url: id ? '/shelfs?id=' + id : '/shelfs',
      method: id ? 'put':'post',
      data: {...this.data.shelfsData}
    })
    .then( res => {
      wx.showToast({
        title: '操作成功',
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 2
        })
      },1500)
    })
  }

})