// pages/manage/toll/goods.js
import qiniuUploader from '../../../lib/qiniuUploader.js'
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsIndex: null,
     goods:{
       image:''
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if( options.params && options.index ){
      this.setData({
        goods: JSON.parse(options.params),
        goodsIndex: options.index
      })
    }
  },

  /**初始化七牛云数据 */
  initQiniu: function (baseURL) {
    return new Promise((resolve, reject) => {
      fetch({ url: '/api/qiniu/upToken', method: 'post' })
        .then(res => {
          if (res.data) {
            let options = {
              region: 'SCN',
              uptoken: res.data,
              domain: 'https://cdn.renqilai.com/'
            };
            qiniuUploader.init(options);
            resolve(options);
          } else {
            reject('获取七牛云token失败');
          }
        })
        .catch(err => {
          console.error(err);
        })
    })
  },

  /**
   * 获取场地图片
   */

  choosePlaceImage: function () {
    this.initQiniu().then(options => {
      wx.chooseImage({
        count: 1,
        success: res => {
          let filePath = res.tempFilePaths[0];
          // 交给七牛上传
          let that = this;
          qiniuUploader.upload(filePath, (res) => {
            that.setData({
              goods: { ...this.data.goods, image: res.imageURL}
            });
          });
        }
      })
    })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 商品名称
   */
  onGoodsNameChange: function(e) {
    this.setData({
      goods: { ...this.data.goods, name: e.detail.value}
    })
  },

  /**
   * 商品价格
   */
  onGoodsPriceChange: function(e) {
    this.setData({
      goods: { ...this.data.goods, price: e.detail.value }
    })
  },

  /**
   * 派发币
   */
  onGoodsAmountChange: function (e) {
    this.setData({
      goods: { ...this.data.goods, amount: e.detail.value }
    })
  },

/**
 * 商品描述
 */
onGoodsDescChange: function (e) {
  this.setData({
    goods: { ...this.data.goods, description: e.detail.value }
  })
},

  /**
   * 确认添加
   */
  onAddGoods: function() {
    const { name, price, amount, image, description } = this.data.goods;
    if( !name ){
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none'
      })
      return
    }
    if (!price) {
      wx.showToast({
        title: '请输入商品价格',
        icon: 'none'
      })
      return
    }
    if (!amount) {
      wx.showToast({
        title: '请输入派发币数',
        icon: 'none'
      })
      return
    }
    if (!image) {
      wx.showToast({
        title: '请选择场地图片',
        icon: 'none'
      })
      return
    }
    if (!description) {
      wx.showToast({
        title: '请输入商品描述',
        icon: 'none'
      })
      return
    }

    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    if( this.data.goodsIndex ){
      prePage.data.planItems[this.data.goodsIndex] = this.data.goods;
    } else {
      prePage.data.planItems.push(this.data.goods);
    }
    
    wx.navigateBack({
      detal:1
    })
  }


})