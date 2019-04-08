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
    displayImage: null,
    commodityDetailImage: null,
    commodityDetail: {},
    trade: [],
    tradeIndex: 0
  },


  /**初始化七牛云数据 */
  initQiniu: function(baseURL) {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/api/qiniu/upToken',
          method: 'post'
        })
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


  chooseCommodityImage: function() {
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


  chooseDisplayImage: function() {
    this.initQiniu().then(options => {
        wx.chooseImage({
          count: 1,
          success: res => {
            let filePath = res.tempFilePaths[0];
            // 交给七牛上传
            let that = this;
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                displayImage: res.imageURL
              });
            });
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  chooseCommodityDetailImage: function() {
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
  onLoad: function(options) {
    this.fetchselect()
    if (options.id) {
      this.setData({
        commodityId: options.id
      }, () => {
        this.fetchCommodityDetail();

      })
    }
  },
  onShow: function() {


  },
  fetchselect: function() {
    fetch({
        url: '/categories/select'
      })
      .then(res => {
        this.setData({
          trade: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 表单提交
   */
  submit: function(e) {
    let categoryId = ""
    if (this.data.categoryId == undefined) {
      categoryId = ""
    } else {
      categoryId = this.data.trade.length ? this.data.trade[this.data.tradeIndex].id : ""
    }

    let {
      name,
      price,
      costPrice,
      description
    } = e.detail.value
    if (!name) {
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


    // if (!categoryId) {
    //   wx.showToast({
    //     title: '请选择商品分类',
    //     icon: 'none'
    //   })
    //   return
    // }

    if (!this.data.commodityImage) {
      wx.showToast({
        title: '请添加商品图',
        icon: 'none'
      })
      return
    }


    if (!this.data.displayImage) {
      wx.showToast({
        title: '请添加商品展示图',
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



    let commodityValues = { ...e.detail.value,
      image: this.data.commodityImage,
      categoryId,
      displayImage: this.data.displayImage,
      detailImage: this.data.commodityDetailImage
    }

    if (this.data.commodityId) {
      this.fethcUpdateCommodity(commodityValues);
    } else {
      this.fetchAddCommodity(commodityValues);
    }

  },

  onFilterTradeChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value,
      categoryId: this.data.trade[e.detail.value]
    })
  },

  /**
   * 添加商品
   */

  fetchAddCommodity: function(values) {
    fetch({
        url: '/products',
        method: 'post',
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

  /**
   * 获取商品详情
   */

  fetchCommodityDetail: function() {
    let trade = this.data.trade
    fetch({
        url: '/products/detail',
        data: {
          id: this.data.commodityId
        },
        isShowLoading: true
      })
      .then(res => {
        let index = ''
        trade.map((item, idx) => {
          if (item.id == res.data.categoryId) {
            index = idx
          }
          return item;
        })
        this.setData({
          commodityImage: res.data.image,
          commodityDetailImage: res.data.detailImage,
          displayImage: res.data.displayImage,
          commodityDetail: res.data,
          tradeIndex: index,
          categoryId: res.data.categoryId
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 更新商品
   */
  fethcUpdateCommodity: function(values) {
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