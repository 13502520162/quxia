import fetch from '../../../../lib/fetch.js'
import moment from '../../../../lib/moment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    adData: {
      resources:[],
      deviceIds:[],
      startDate: moment().format('YYYY-MM-DD')
    },
    typesData: [
      { name: "视频", value: 'VIDEO' },
      { name: "图片", value: 'IMAGE' }
    ],
    typeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })

      this.fetchDetail();
    }
  },

  onShow: function () {

  },

  /**
   * 名称更改
   */
  onNameChange: function(e) {
    this.setData({
      adData: { ...this.data.adData, name: e.detail.value }
    })
  },
  /**
   * 类型更改
   */
  bindTypeChange: function (e) {
    this.setData({
      adData: { ...this.data.adData, deviceIds: [], resources:[] },
      typeIndex: e.detail.value,
    })
  },

  /**
   * 选择设备
   */
  goToSelectDevices: function () {
    wx.navigateTo({
      url: './selectDevices',
    })
  },

  /**
   * 选择素材
   */
  goToSelectResource: function () {
    let dataType = this.data.typesData[this.data.typeIndex].value;
    wx.navigateTo({
      url: './selectResources?dataType=' + dataType,
    })
  },

  /**
   * 开始日期更改
   */
  onStartDateChange: function(e){
     this.setData({
       adData: { ...this.data.adData, startDate: e.detail.value }
     })
  },


  /**
   * 确定
   */
  onConfirm: function (e) {

    const { days, frequency, interval, name, duration } = e.detail.value;
    if( !name ) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }

    if (!this.data.adData.resources.length) {
      wx.showToast({
        title: '请选择素材',
        icon: 'none'
      })
      return;
    }

    if (!this.data.adData.deviceIds.length) {
      wx.showToast({
        title: '请选择设备',
        icon: 'none'
      })
      return;
    }

    if (!duration) {
      wx.showToast({
        title: '请输入播放时长',
        icon: 'none'
      })
      return;
    }
    if( this.data.typeIndex == 1 ){
      if (!interval) {
        wx.showToast({
          title: '请输入图片间隔时间',
          icon: 'none'
        })
        return;
      }
    }

    if (!frequency) {
      wx.showToast({
        title: '请输入单日播放次数',
        icon: 'none'
      })
      return;
    }


    if (!days) {
      wx.showToast({
        title: '请输入播放天数',
        icon: 'none'
      })
      return;
    }

    let params = {
      ...this.data.adData,
      ...e.detail.value
    }
    if( this.data.id ){
      this.fetchUpdatePutting(params);
    } else {
      this.fetchAddPutting(params);
    }
   
  },

  /**
   * 添加广告投放
   */
  fetchAddPutting: function (params) {
    fetch({
      isShowLoading: true,
      url:'/adpub/plans',
      method: 'post',
      data: {...params}
    })
    .then( res => {
       wx.showToast({
         title: '添加成功',
         icon: 'none'
       })
      setTimeout(() => {
        wx.navigateBack({
          detal: 1
        })
      }, 1500)
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 更新广告投放
   */

  fetchUpdatePutting: function (params){
    fetch({
      isShowLoading: true,
      url: '/adpub/plans?id='+this.data.id,
      method: 'put',
      data: { ...params }
    })
      .then(res => {
        wx.showToast({
          title: '更新成功',
          icon: 'none'
        });
        setTimeout(()=> {
          wx.navigateBack({
            detal: 1
          })
        },1500)

      })
      .catch(err => {
        console.error(err);
      })
  },

  fetchDetail: function () {
    fetch({
      url: '/adpub/plans/detail?id=' + this.data.id,
      isShowLoading: true,
    })
      .then(res => {
        this.setData({
          typeIndex: res.data.type == 'VIDEO' ? 0 : 1,
          adData: { ...this.data.adData, ...res.data }
        })
      })
      .catch(err => {
        console.error(err);
      })
  }
})