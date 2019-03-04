// pages/coupon/newCoupons/newCoupons.js

import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'
import qiniuUploader from '../../../../lib/qiniuUploader.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    name: '',
    field: '',
    startDate: '2019-01-01',
    endDate: '2019-01-03',
    frequency: '',
    couponId: '',
    locationIds: [],
    limitPerCustomer: '',
    commodityImage: '',
    isBorder: true,
    discount: true,
    isDisabled: false,
    isPermanent: false,
    isUnlimited: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var TIME = util.formatDate(new Date());
    this.setData({
      startDate: TIME,
      endDate: TIME,
      field: options.field
    });

    this.fetchCouponsDetail(options.id)
  },
  onShow: function() {

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



  /**
   * 表单填充
   */
  fetchCouponsDetail: function(id) {
    if (this.data.field == 'view') {
      fetch({
        url: '/payGiftOffers/detail?id=' + id,
        method: 'GET'
      }).then(res => {
        let ress = res.data;
        let isUnlimited = false;
        if (ress.limitPerCustomer) {
          isUnlimited = false
        } else {
          isUnlimited = true
        }
        this.setData({
          name: ress.name,
          couponId: ress.couponId,
          locationIds: ress.locationIds,
          startDate: util.formatTimeTwo(ress.startDate),
          endDate: util.formatTimeTwo(ress.endDate),
          isPermanent: ress.permanent,
          frequency: ress.limitPerCustomer,
          isDisabled: true,
          isUnlimited
        })
      })
    } else {
      this.setData({
        isDisabled: false
      })
    }


  },
  /**
   * 是否无限制
   */
  Unlimited: function(e) {
    let value = e.detail.value

    let isUnlimited

    if (value) {
      isUnlimited = value

    } else {
      isUnlimited = value
    }

    this.setData({
      isUnlimited
    })
  },
  /**
   * 每人参与 * 次
   */
  frequency: function(e) {
    this.setData({
      frequency: e.detail.value
    })
  },
  /**
   * 是否永久有效
   */
  switch1Change: function(e) {
    let value = e.detail.value
    let isPermanent;
    if (value) {
      isPermanent = value

    } else {
      isPermanent = value
    }

    this.setData({
      isPermanent
    })
  },


  chooseCommodityImage: function() {
    this.initQiniu().then(options => {
        wx.chooseImage({
          count: 1,
          success: res => {
            let filePath = res.tempFilePaths[0];
            console.log(filePath)
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


  /**
   * 活动的开始时间
   */
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  /**
   * 活动的结束时间
   */
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  /**
   * 选择优惠券
   */
  chooseCoupons: function() {
    if (!this.data.isDisabled) {
      wx.navigateTo({
        url: '../../coupon/chooseCoupons/chooseCoupons?chooseCoupons=' + JSON.stringify(this.data.couponId),
      })
    }

  },
  /**
   * 适用场地
   */
  choiceOfVenue: function() {
    if (!this.data.isDisabled) {
      wx.navigateTo({
        url: '../../coupon/choiceOfVenue/choiceOfVenue?locationIds=' + JSON.stringify(this.data.locationIds),
      })
    }
  },
  /**
   * 活动名称
   */
  activityName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 确定事件
   */
  preservation: function() {

    if (this.data.name == '') {
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none'
      })
      return;
    }



    if (!this.data.isUnlimited) {
      if (this.data.frequency == '') {
        wx.showToast({
          title: '请填写参与次数',
          icon: 'none'
        })
        return;
      }
    }


    // if (this.data.couponId == '') {
    //   wx.showToast({
    //     title: '请选择优惠券',
    //     icon: 'none'
    //   })
    //   return;
    // }



    // if (!this.data.locationIds.length) {
    //   wx.showToast({
    //     title: '请选择适用场地',
    //     icon: 'none'
    //   })
    //   return;
    // }

    this.preservationFetch()

  },
  /**
   * 发送确定请求
   */
  preservationFetch: function() {

    fetch({
        url: '/payGiftOffers',
        method: 'post',
        isShowLoading: true,
        data: {
          name: this.data.name,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          couponId: parseInt(this.data.couponId),
          locationIds: this.data.locationIds,
          permanent: this.data.isPermanent,
          limitPerCustomer: this.data.frequency || 0
        }
      })
      .then(res => {

        wx.showToast({
          title: '活动添加成功',
          icon: 'success'
        })

        let timer = null
        timer = setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      })
      .catch(err => {
        console.error(err);
      })
  }

})