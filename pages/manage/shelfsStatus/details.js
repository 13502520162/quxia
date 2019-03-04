// pages/manage/shelfsStatus/details.js
import fetch from '../../../lib/fetch.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plansIndex: -1,
    plans:[],
    shelfs:[],
    planId:'',
    deviceId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      planId: options.planid,
      deviceId: options.id
    })
    this.fetchAllPlans(options.planid);
    if (options.planid && options.planid != 'undefined'){
      this.fetchPlanDetails(options.planid);
    }
    
  },

  /**
   * 获取所有货道方案
   */

  fetchAllPlans: function (planId) {
      fetch({
        url: '/shelfs/select',
      })
      .then( res =>{
        if(res.data && Array.isArray(res.data)){
          for(let i=0; i<res.data.length; i++){
            if(res.data[i].id == planId){
              this.setData({
                plansIndex: i
              })
              break;
            }
          }
          this.setData({
            plans: res.data
          })
        }

      })
      .catch( err => {
        console.error(err);
      })
  },

  /**
   * 获取方案详情
   */
  fetchPlanDetails: function( planId ) {
    fetch({
      url:'/shelfs/detail?id='+planId,
      isShowLoading: true
    })
    .then( res=> {
      this.setData({
        shelfs: res.data.shelfs
      })
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 方案更改
   */
  onPlansChange: function (e) {
    this.setData({
      plansIndex: e.detail.value
    })
    this.fetchPlanDetails(this.data.plans[this.data.plansIndex].id)
  },

  /**
   * 确定方案
   */
  confirmPlans: function() {
    fetch({
      url: '/shelfs/devices?deviceId=' + this.data.deviceId +"&planId="+this.data.plans[this.data.plansIndex].id,
      method:'post',
      isShowLoading:true
    })
    .then( res => {
      wx.showToast({
        title: '操作成功',
      })
      setTimeout(()=> {
        wx.navigateBack({
          detal: 1
        })
      },1500)
    })
    .catch( err => {
      console.error(err);
    })
  }

})