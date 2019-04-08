// pages/me/place/addPlace.js
import QQMapWX from '../../../../lib/qqmap-wx-jssdk.min.js'
import qiniuUploader from '../../../../lib/qiniuUploader.js'
import fetch from "../../../../lib/fetch.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeId: '',
    region: ['广东省', '广州市', '番禺区'],
    tradeList: [],
    tradeIndex: 0,
    placeImageUrl: '',
    placeName: '',
    street: '',
    contactName: '',
    contactMobile: '',
    contactQrcode: '',
  },

  /**初始化七牛云数据 */
  initQiniu: function() {
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

  /**获取行业数据 */
  getTradeList: function() {
    fetch({
        url: '/locations/types',
        isShowLoading: true
      })
      .then(res => {
        res.data.unshift({
          id: '',
          name: '请选择'
        })
        if (res.data && Array.isArray(res.data)) {
          this.setData({
            tradeList: res.data
          }, () => {
            if (this.data.placeId) {
              this.fetchPlaceDetails();
            }
          })
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  bindTradeListChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value
    })
  },

  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },


  choosePlaceImage: function() {
    this.initQiniu().then(options => {
        wx.chooseImage({
          count: 1,
          success: res => {
            let filePath = res.tempFilePaths[0];
            // 交给七牛上传
            let that = this;
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                placeImageUrl: res.imageURL
              });
            });
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  comfirmPlace: function() {
    if (!this.data.placeName.trim()) {
      wx.showToast({
        title: '请输入场地名',
        icon: 'none'
      })
      return;
    }

    if (!this.data.placeImageUrl) {
      wx.showToast({
        title: '请上传场地图片',
        icon: 'none'
      })
      return;
    }

    if (!this.data.street.trim()) {
      wx.showToast({
        title: '请输入街道地址',
        icon: 'none'
      })
      return;
    }


    if (!this.data.tradeList.length) {
      wx.showToast({
        title: '请选择行业',
        icon: 'none'
      })
      return;
    }




    // if ( !this.data.contactName ){
    //   wx.showToast({
    //     title: '请输入客服名称',
    //     icon: 'none'
    //   })
    //   return;
    // }

    // if (!this.data.contactMobile) {
    //   wx.showToast({
    //     title: '请输入客服电话',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (!/^1[3|5|7|8][0-9]{9}$/.test(this.data.contactMobile)) {
    //   wx.showToast({
    //     title: '请输入11位客服电话号码',
    //     icon: 'none'
    //   })
    //   return;
    // }

    if (this.data.contactMobile) {
      if (!/^1[3|5|7|8][0-9]{9}$/.test(this.data.contactMobile)) {
        wx.showToast({
          title: '请输入11位客服电话号码',
          icon: 'none'
        })
        return;
      }
    }

    // if (!this.data.contactQrcode) {
    //   wx.showToast({
    //     title: '请上传客服二维码',
    //     icon: 'none'
    //   })
    //   return;
    // }

    this.getLngAndLat().then(location => {
      let placeId = this.data.placeId;
      fetch({
          url: placeId ? '/locations?id=' + placeId : '/locations',
          method: placeId ? 'put' : 'post',
          isShowLoading: true,
          data: {
            id: placeId,
            name: this.data.placeName,
            image: this.data.placeImageUrl,
            province: this.data.region[0],
            city: this.data.region[1],
            district: this.data.region[2],
            street: this.data.street,
            latitude: location.lat,
            longtitude: location.lng,
            typeId: this.data.tradeList[this.data.tradeIndex].id,
            contactName: this.data.contactName,
            contactMobile: this.data.contactMobile,
            contactQrcode: this.data.contactQrcode
          }
        })
        .then(res => {
          wx.navigateBack({
            delta: 1
          })
        })
        .catch(err => {
          console.error(err);
        })
    })

  },

  /** 获取经纬度 */
  getLngAndLat: function() {
    if (!this.data.street.trim()) {
      wx.showToast({
        title: '请输入街道地址',
        icon: 'none'
      })
      return;
    };

    let qqMap = new QQMapWX({
      key: 'DRABZ-IZTKJ-JBHFW-FC7LA-HENRO-HXBAV'
    });

    // 调用接口
    let address = this.data.region.join('');
    address += this.data.street;
    return new Promise((resolve, reject) => {
      qqMap.geocoder({
        address: address,
        success: res => {
          if (res.result) {
            resolve(res.result.location)
          } else {
            reject('获取经纬都失败')
          }
        },
        fail: function(err) {
          console.error(err);
          reject('获取经纬都失败')
        },
        complete: function(res) {

        }
      });
    })
  },

  placeNameChangeHandle: function(e) {
    this.setData({
      placeName: e.detail.value
    })
  },

  streetChangeHandle: function(e) {
    this.setData({
      street: e.detail.value
    })
  },

  contactNameChangeHandle: function(e) {
    this.setData({
      contactName: e.detail.value
    })
  },

  contactNameChangeHandle: function(e) {
    this.setData({
      contactName: e.detail.value
    })
  },

  contactMobileChangeHandle: function(e) {
    this.setData({
      contactMobile: e.detail.value
    })
  },

  chooseContactImage: function() {
    this.initQiniu().then(options => {
        wx.chooseImage({
          count: 1,
          success: res => {
            let filePath = res.tempFilePaths[0];
            // 交给七牛上传
            let that = this;
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                contactQrcode: res.imageURL
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
   * 获取场地详情
   */
  fetchPlaceDetails: function() {
    fetch({
        url: '/locations/detail',
        data: {
          id: this.data.placeId
        }
      })
      .then(res => {
        const {
          name,
          province,
          city,
          district,
          street,
          image,
          typeId,
          typeName,
          contactName,
          contactMobile,
          contactQrcode
        } = res.data;
        let tradeIndex = 0;
        this.data.tradeList.map((item, index) => {
          if (item.id == typeId) {
            tradeIndex: index
          }
        })
        let region = [province, city, district];
        this.setData({
          placeName: name,
          region: region,
          street: street,
          placeImageUrl: image,
          tradeIndex: tradeIndex,
          contactName: contactName,
          contactMobile: contactMobile,
          contactQrcode: contactQrcode
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
    if (options.id) {
      this.setData({
        placeId: options.id
      })
    }
    this.getTradeList();
  },




})