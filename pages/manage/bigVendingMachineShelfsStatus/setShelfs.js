// pages/manage/shelfs/setPrice.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    deviceTypeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      deviceTypeId: options.deviceTypeId
    })
    this.initData();
  },

  initData: function() {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    this.setData({
      shelfsData: prepage.data.shelfs
    })
  },

  onMaxStockChange: function(e) {
    let shelfs = this.data.shelfsData.shelfs;
    let index = e.currentTarget.dataset.index;
    shelfs[index].maxStock = e.detail.value;
    this.setData({
      shelfsData: {
        ...this.data.shelfsData,
        shelfs: shelfs
      }
    })
  },


  onSafeStockChange: function(e) {
    let shelfs = this.data.shelfsData.shelfs;
    let index = e.currentTarget.dataset.index;
    shelfs[index].safeStock = e.detail.value;
    this.setData({
      shelfsData: {
        ...this.data.shelfsData,
        shelfs: shelfs
      }
    })
  },

  submit: function() {
    let shelfs = this.data.shelfsData.shelfs;
    for (let i = 0; i < shelfs.length; i++) {
      if (!shelfs[i].maxStock) {
        wx.showToast({
          title: '请输入容量',
          icon: 'none'
        })
        return;
      }

      if (!shelfs[i].safeStock) {
        wx.showToast({
          title: '请输入安全容量',
          icon: 'none'
        })
        return;
      }
    }

    let {
      id,
      deviceTypeId
    } = this.data
    fetch({
        url: id ? '/shelfs/devices?id=' + id : '/shelfs',
        method: 'post',
        data: {
          ...this.data.shelfsData,
          deviceId: id,
          deviceTypeId
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        }, 1500)
      })


  },

  syncOpacity: function(e) {
    let shelfs = this.data.shelfsData.shelfs;
    let index = e.currentTarget.dataset.index;

    let maxStock = shelfs[index].maxStock;
    let safeStock = shelfs[index].safeStock;

    shelfs = shelfs.map(item => {
      item.maxStock = maxStock;
      item.safeStock = safeStock;
      return item;
    })

    this.setData({
      shelfsData: {
        ...this.data.shelfsData,
        shelfs: shelfs
      }
    })
  }
})