// pages/manage/shareAd/toll/frequencyDetails.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    periodsData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2];
      let periods = prePage.data.periods;
      for (let i = 0; i < periods.length; i++) {
        if (periods[i].id == options.id) {
          this.setData({
            periodsData: periods[i]
          })
          break;
        }
      }
    }
  },

  /**
   * 表单提交
   */
  onSubmitHandle: function (e) {
    const { name, value } = e.detail.value;

    if (!name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }

    if (!value) {
      wx.showToast({
        title: '请输入天数',
        icon: 'none'
      })
      return;
    }



    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let periods = prePage.data.periods;

    if (this.data.periodsData.id) {
      for (let i = 0; i < periods.length; i++) {
        if (periods[i].id == this.data.periodsData.id) {
          periods[i] = { id: this.data.periodsData.id, ...e.detail.value };
          prePage.setData({
            periods: periods
          })
          break;
        }
      }
      wx.navigateBack({
        detal: 1
      })
    } else {
      this.fetchID().then(id => {
        periods.push({ id: id, ...e.detail.value });
        prePage.setData({
          periods: periods
        });
        wx.navigateBack({
          detal: 1
        })
      })
        .catch(err => {
          console.error(err);
        })
    }
  },

  /**
   * 新建则获取id
   */
  fetchID: function () {
    return new Promise((resolve, reject) => {
      fetch({
        url: '/id',
        isShowLoading: true
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          console.error(err);
          reject(err);
        })
    })
  }
})