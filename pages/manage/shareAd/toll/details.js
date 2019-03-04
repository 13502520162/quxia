// pages/manage/shareAd/toll/details.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    tollData: {
      frequencies:[],
      periods:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if( options.id ){
       this.setData({
         id: options.id
       })
       this.fetchDetails();
     }
  },

  /**
   * 选择播放频率
   */
  goToSelectFrequencies: function () {
    wx.navigateTo({
      url: './selectFrequencies',
    })
  },

  /**
   * 选择播放周期
   */
goToSelectPeriods: function () {
  wx.navigateTo({
    url: './selectPeriods',
  })
},


  /**
   * 名称改变
   */
  onChangeName: function (e) {
    this.setData({
      tollData: {...this.data.tollData,name:e.detail.value}
    })
  },

  /**
   * 跳转设置价格
   */
  goToSetPrice: function() {
    const { name, frequencies, periods  } = this.data.tollData
    if (!name){
      wx.showToast({
        title: '请输入套餐名',
        icon:'none'
      });
      return;
    }

    if ( !frequencies.length ){
      wx.showToast({
        title: '请选择播放频率',
        icon: 'none'
      });
      return;
    }

    if (!periods.length) {
      wx.showToast({
        title: '请选择播放周期',
        icon: 'none'
      });
      return;
    }
    let url = this.data.id ? './setPrices?id=' + this.data.id : './setPrices';
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 获取详情
   */
  fetchDetails: function () {
    fetch({
      url: '/adpub/pricingPlans/detail',
      data: {
        id: this.data.id
      }
    })
    .then( res => {
      this.setData({
        tollData: res.data
      })
    })
    .catch( err =>{
      console.error(err);
    })
  }




})