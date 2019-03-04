// pages/manage/shareAd/toll/setPrices.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    tollData:{
      prices:[]
    },
    pricesObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if( options.id){
      this.setData({
        id: options.id
      })
    }
    let pages = getCurrentPages();
    let prepage = pages[pages.length-2];
    this.setData({
      tollData:{...this.data.tollData,...prepage.data.tollData}
    },() => {
      if( this.data.tollData.prices.length ){
        let prices = this.data.tollData.prices;
        let pricesObj = {}
        prices.forEach( item =>{
          pricesObj[ item.periodId + item.frequencyId  ] = item.price
        });
        this.setData({
          pricesObj: pricesObj
        })
      }
    })
  },

  onPriceChange: function (e){
    const { frequencyid, periodid } = e.currentTarget.dataset;
    let pricesObj = this.data.pricesObj;
    pricesObj[ frequencyid + periodid ] = e.detail.value;
    this.setData({
      pricesObj: pricesObj
    })
  },

  onConfirm: function() {

    let pricesObjLength  = 0;
    for ( let key in this.data.pricesObj){
      if ( !this.data.pricesObj[key] ){
        wx.showToast({
          title: '请填写价格',
          icon: 'none'
        })
        return
      } 
      pricesObjLength++;
    }

    if (this.data.tollData.frequencies.length * this.data.tollData.periods.length != pricesObjLength) {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
      return
    }
    let prices = [];
    for (let i=0; i< this.data.tollData.periods.length; i++  ){
      for (let j = 0; j < this.data.tollData.frequencies.length; j++){
        prices.push({ 
          frequencyId: this.data.tollData.frequencies[j].id,
          periodId: this.data.tollData.periods[i].id,
          price: this.data.pricesObj[this.data.tollData.periods[i].id + this.data.tollData.frequencies[j].id]
        })
      }
    }

    this.setData({
      tollData: { ...this.data.tollData, prices: prices }
    })

    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    prepage.setData({
      tollData: { ...prepage.data.tollData, prices: prices }
    })


    
    let id = this.data.id;
    fetch({
      url: id ? '/adpub/pricingPlans?id=' + id : '/adpub/pricingPlans',
      method: id ? 'put': 'post',
      data:{
        ...this.data.tollData
      }
    })
    .then( res => {
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      setTimeout(()=> {
        wx.navigateBack({
          delta: 2
        })
      }, 1500)
    })
    .catch( err => {
      console.error(err);
    })
    
  }



})