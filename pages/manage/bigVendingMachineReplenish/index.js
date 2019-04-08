// pages/manage/replenish/replenish.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    deviceInfo: {},
    shelfs: [],
    isCanNext: false,
    isFilterOutOfStock: false, //筛选缺货按钮,
    isFillUp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      deviceId: options.sence
    }, () => {

    })
  },
  onReady: function() {
    this.fetchDeviceInfo();
  },



  /**
   * 获取设备信息
   */
  fetchDeviceInfo: function() {
    fetch({
        url: '/restocks/deviceInfo',
        data: {
          deviceId: this.data.deviceId
        }
      })
      .then(res => {

        let shelfs = res.data.shelfs.map(item => {
          item.replenishNum = item.stock
          return item;
        })
        res.data.shelfs = shelfs;
        this.setData({
          deviceInfo: res.data,
          shelfs
        })

      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 重置补货数
   */
  onResetReplenishNum: function() {
    let shelfs = this.data.shelfs
    shelfs = shelfs.map(item => {
      item.replenishNum = item.stock
      return item;
    })
    this.setData({
      shelfs: shelfs,
      isCanNext: false
    })
  },

  /**
   * 一键补满
   */
  onFillReplenishNum: function() {
    let shelfs = this.data.shelfs,
      isCanNext, len = shelfs.length,
      isFillUp = this.data.isFillUp;
    for (let i = 0; i < len; i++) {
      if (shelfs[i].replenishNum == shelfs[i].maxStock) {
        isCanNext = false
      } else {
        isCanNext = true
        break;
      }
    }
    shelfs = shelfs.map(item => {
      item.replenishNum = item.maxStock
      return item;
    })
    if (!isFillUp) {
      if (!isCanNext) {
        wx.showToast({
          title: '货物已经补满，无需补货',
          icon: 'none'
        })
      }
    }
    if (isFillUp) {
      isCanNext = true
    }
    this.setData({
      shelfs,
      isCanNext,
      isFillUp: true
    })
  },

  handleStepperChange: function(e) {
    let shelfs = this.data.shelfs;
    shelfs[e.currentTarget.dataset.index].replenishNum = e.detail
    this.setData({
      shelfs: shelfs
    })

    let changeNum = 0;

    shelfs.forEach(item => {
      if ((item.replenishNum - item.stock) != 0) {
        changeNum++
      }
    });

    this.setData({
      isCanNext: Boolean(changeNum)
    })

  },

  /**
   * 全部 / 缺货 切换
   */
  toggleShelfs: function(e) {
    this.setData({
      isFilterOutOfStock: !this.data.isFilterOutOfStock
    })
    let shelfs = this.data.deviceInfo.shelfs;
    this.setData({
      shelfs: shelfs.filter(item => {
        if (this.data.isFilterOutOfStock) {
          return item.state == 'OUT_OF_STOCK'
        } else {
          return item
        }

      })
    })
  },

  /**
   * 下一步
   */
  nextStep: function() {
    if (this.data.isCanNext) {
      wx.navigateTo({
        url: './replenishNum',
      })
    }
  },


  /***
   * 查看补货记录
   */
  showReplenishRecord: function() {
    wx.navigateTo({
      url: '/pages/manage/replenishRecord/replenishRecord?id=' + this.data.deviceId,
    })
  }


})