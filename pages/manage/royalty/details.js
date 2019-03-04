import fetch from '../../../lib/fetch.js'
// pages/manage/royalty/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    enabled: false,  //分润是否启用的标识, 暂停时不可提交编辑数据
    typesData: [
      { name: "场地", value: 'LOCATION' }, 
      { name: "设备", value: 'DEVICE' }
    ],
    typeIndex: 0,
    newOrUpdateParams: {
      name: '',
      type: 'LOCATION',
      objectIds: [],
      users:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if( options.id){
      this.setData({
        id: options.id
      })
     if(options.enabled == 'true'){
       
       this.setData({
         enabled: true
       })
     }

      this.fetchRoyaltyDetail();
    }
  },

  onShow: function () {
    this.setData({
      newOrUpdateParams: this.data.newOrUpdateParams
    })
  },
  /**
   * 类型更改
   */
  bindTypeChange: function (e) {
    let typeIndex = Number(e.detail.value);
    this.setData({
      typeIndex: typeIndex ,
      objectIds: [],
      newOrUpdateParams: { ...this.data.newOrUpdateParams, type: this.data.typesData[typeIndex].value }
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
   * 选择场地
   */
  goToSelectPlace: function () {
    wx.navigateTo({
      url: './selectPlace',
    })
  },  

  /**
   * 跳转分润对象
   */
  gotoSelectUser: function () {
    wx.navigateTo({
      url: './selectUser',
    })
  },

  onChangeUser: function (e) {
    wx.navigateTo({
      url: './selectUser?usersDataIndex=' + e.currentTarget.dataset.index,
    })
  },

  /**
   * 名称发生改变
   */
  onNameChange: function(e) {
    this.setData({
      newOrUpdateParams: {...this.data.newOrUpdateParams, name: e.detail.value}
    })
  },

  /**
   * 确定更新
   */
  onConfirm: function () {
    let newOrUpdateParams = this.data.newOrUpdateParams;
    let { name, objectIds, users } = newOrUpdateParams;
    if (!name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }
    if ( !objectIds.length ) {
      wx.showToast({
        title: '请选择场地/或设备',
        icon:'none'
      })
      return;
    }
    if (!users.length) {
      wx.showToast({
        title: '请选择分润对象',
        icon: 'none'
      })
      return;
    }

    fetch({
      url: this.data.id ? '/royaltyPlans?id=' + this.data.id : '/royaltyPlans',
      method: this.data.id ? 'PUT': 'POST',
      data: this.data.id ? { id: this.data.id, ...this.data.newOrUpdateParams }: this.data.newOrUpdateParams
    })
    .then( res => {
      wx.showToast({
        title: '操作成功',
      })
      setTimeout( ()=> {
        wx.navigateBack({
          detal: 1
        })
      },1500)
    })
  },

  fetchRoyaltyDetail: function() {
    fetch({
      url: '/royaltyPlans/detail?id='+ this.data.id
    })
    .then( res => {
      this.setData({
        typeIndex: res.data.type == 'LOCATION'? 0 : 1,
        newOrUpdateParams: {...this.data.newOrUpdateParams,...res.data}
      })
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 禁用分润分案
   */
  disableRoyalty: function() {
    fetch({
      url: '/royaltyPlans/disable?id=' + this.data.id,
      method: 'post'
    })
      .then(res => {
        this.setData({
          enabled: false
        });
      })
      .catch(err => {
        console.error(err);
      })
  }
})