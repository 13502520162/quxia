// pages/manage/shareAd/toll/frequencyDetails.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frequencyData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if( options.id ){
       let pages = getCurrentPages();
       let prePage = pages[pages.length-2];
       let frequencies = prePage.data.frequencies;
       for (let i = 0; i < frequencies.length; i++){
         if (frequencies[i].id == options.id){
           this.setData({
             frequencyData: frequencies[i]
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
    const { name, duration, times } = e.detail.value;

    if( !name ) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }

    if( !duration ){
      wx.showToast({
        title: '请输入播放时长',
        icon: 'none'
      })
      return;
    }

    if (!times) {
      wx.showToast({
        title: '请输入播放次数',
        icon: 'none'
      })
      return;
    }

    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let frequencies = prePage.data.frequencies;

    if (this.data.frequencyData.id){
      for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i].id == this.data.frequencyData.id) {
          frequencies[i] = { id: this.data.frequencyData.id ,...e.detail.value};
          prePage.setData({
            frequencies: frequencies
          })
          break;
        }
      }
      wx.navigateBack({
        detal: 1
      })
    } else {
      this.fetchFrequencyID().then( id => {
        frequencies.push({ id: id, ...e.detail.value});
        prePage.setData({
          frequencies: frequencies
        });
        wx.navigateBack({
          detal:1
        })
      })
      .catch( err => {
        console.error(err);
      })
    }
  },

  /**
   * 新建则获取id
   */
  fetchFrequencyID: function () {
    return new Promise(( resolve, reject )=>{
      fetch({
        url: '/id',
        isShowLoading: true
      })
        .then(res => {
            resolve( res.data )
        })
        .catch(err => {
            console.error(err);
            reject( err );
        })
    })
  }
})