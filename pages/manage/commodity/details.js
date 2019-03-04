// pages/me/place/addPlace.js
import QQMapWX from '../../../lib/qqmap-wx-jssdk.min.js'
import qiniuUploader from '../../../lib/qiniuUploader.js'
import fetch from "../../../lib/fetch.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityId: null,
    commodityImage: null,
    commodityDetailImage: null,
    commodityDetail: {}
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


  chooseCommodityImage: function () {
    this.initQiniu().then(options => {
      wx.chooseImage({
        count: 1,
        success: res => {
          let filePath = res.tempFilePaths[0];
          // 交给七牛上传
          let that = this;
          qiniuUploader.upload(filePath, (res) => {
            that.setData({
              commodityImage: res.imageURL
            });
          });
        }
      })
    })
      .catch(err => {
        console.error(err);
      })
  },

  chooseCommodityDetailImage: function () {
    this.initQiniu().then(options => {
      wx.chooseImage({
        count: 1,
        success: res => {
          let filePath = res.tempFilePaths[0];
          // 交给七牛上传
          let that = this;
          qiniuUploader.upload(filePath, (res) => {
            that.setData({
              commodityDetailImage: res.imageURL
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        commodityId: options.id
      })
      this.fetchCommodityDetail();
    }

  },
  
  /**
   * 表单提交
   */
  submit: function( e ) {
    let { name, price, costPrice, description } = e.detail.value
    if( !name ){
      wx.showToast({
        title: '请输入商品名',
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
    if (!costPrice) {
      wx.showToast({
        title: '请输入商品成本价格',
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

    if (!this.data.commodityImage) {
      wx.showToast({
        title: '请添加商品图',
        icon: 'none'
      })
      return
    }

    if (!this.data.commodityDetailImage) {
      wx.showToast({
        title: '请添加商品详情图',
        icon: 'none'
      })
      return
    }



    let commodityValues = { ...e.detail.value, image: this.data.commodityImage, detailImage: this.data.commodityDetailImage }

    if(this.data.commodityId){
      this.fethcUpdateCommodity(commodityValues);
    } else {
      this.fetchAddCommodity(commodityValues);
    }

  },

  /**
   * 添加商品
   */

  fetchAddCommodity: function ( values ) {
    fetch({
      url: '/products',
      method: 'post',
      data: {
        ...values
      },
      isShowLoading: true
    })
    .then( res => {
       wx.showToast({
         title: '成功'
       });
       setTimeout( ()=> {
         wx.navigateBack({
           delta: 1
         })
       },1500)
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 获取商品详情
   */

  fetchCommodityDetail: function () {
    fetch({
      url:'/products/detail',
      data: {
        id: this.data.commodityId
      },
      isShowLoading: true
    })
    .then( res => {
      this.setData({
        commodityImage: res.data.image,
        commodityDetailImage: res.data.detailImage,
        commodityDetail: res.data
      })
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 更新商品
   */
  fethcUpdateCommodity: function (values) {
    fetch({
      url: '/products?id=' + this.data.commodityId,
      method: 'PUT',
      data: {
        ...values
      },
      isShowLoading: true
    })
      .then(res => {
        wx.showToast({
          title: '成功'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
      .catch(err => {
        console.error(err);
      })
  },




})