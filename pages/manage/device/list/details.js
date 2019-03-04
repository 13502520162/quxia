// pages/manage/device/list/details.js
import fetch from '.../../../../../../lib/fetch.js';
import getStorePermissions from '.../../../../../../utils/getStorePremissioin.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    groupsData: [],
    groupIndex: 0,
    placeData: [],
    placeIndex: 0,
    tollsData: [],
    tollIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     details: {...this.details,id:options.id}
   })

    this.permissionFilter();
   
   /**
    * promise.all 无效？？？只能这样子了
    */
    this.fetchGroups().then( () => {
      this.fetchPlaces().then( () => {
        this.fetchTolls().then( () =>{
          this.fetchDeviceDetails(options.id).then( () => {
              this.data.placeData.map( (item,index) => {
                  if (item.id == this.data.details.locationId){
                    this.setData({
                      placeIndex: index
                    })
                  }
                });
                this.data.groupsData.map( (item,index) => {
                  if (item.id == this.data.details.groupId) {
                    this.setData({
                      groupIndex: index
                    })
                  }
                })
              this.data.tollsData.map((item,index) => {
                if (item.id == this.data.details.planId) {
                  this.setData({
                    tollIndex: index
                  })
                }
              })
          })
        })
      })
    })
   
  },


/**
* 权限过滤
*/
permissionFilter: function () {
    let permissions = getStorePermissions();
    //列表
  if (permissions.includes(9)) {
      this.setData({
        disBind: false
      })
    }
  },

  /**
   * 分组更改
   */

  bindDeviceGroupChange: function(e) {
    this.setData({
      groupIndex: e.detail.value
    })
  },

  /**
   * 场地更改
   */
  bindPlaceChange: function (e) {
    this.setData({
      placeIndex: e.detail.value
    })
  },

  /**
   * 套餐更改
   */

  bindTollChange: function(e) {
    this.setData({
      tollIndex: e.detail.value
    })
  },

  /**
   * 设备名称更改
   */
  onDeviceNameChange: function(e) {
    this.setData({
       details: { ...this.data.details, name: e.detail.value }
    })
  },


  /**
   * 获取设备详情数据
   */

  fetchDeviceDetails: function(id) {
    return new Promise(( resolve, reject ) => {
      fetch({
        url: '/devices/detail',
        data: {
          id: id
        }
      })
        .then(res => {
          this.setData({
            details: { id: id, ...res.data }
          })
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        })
    })
  },


  /**
   * 获取所有分组
   */
  fetchGroups: function () {

    return new Promise((resolve, reject) => {
      fetch({
        url: '/deviceGroups/select'
      })
        .then(res => {
          this.setData({
            groupsData: res.data
          })
          resolve();
        })
        .catch( err => {
          console.error( err );
          reject(err);
        })
    })

  },

  /**
   * 获取所有的收费套餐
   */
  fetchTolls: function() {
    return new Promise((resolve, reject) => {
      fetch({
        url: '/plans/select'
      })
        .then(res => {
          this.setData({
            tollsData: res.data
          });
          resolve();
        })
        .catch( err => {
          console.error(err);
          reject( err );
        })
    })

  },

  /**
   * 获取所有的场地
   */
  fetchPlaces: function() {
    return new Promise( (resolve, reject )=> {
      fetch({
        url: '/locations/select'
      })
        .then(res => {
          this.setData({
            placeData: res.data
          });
          resolve();
        })
        .catch( err => {
          reject(err);
        })
    })
  },

  /**
   * 解除设备绑定
   */
  onDelDevice: function() {
    fetch({
      url: '/devices?id=' + this.data.details.id,
      method: 'delete',

      isShowLoading: true
    })
    .then( res => {
        wx.navigateBack({
          delta: 1,
        })
    })
  },

  /**
   * 备注更改
   */
  onNoteChage: function (e) {
     this.setData({
       details: {...this.data.details, note: e.detail.value }
     })
  },

  /**
   * 提交更改
   */
  onSubmit: function () {
    fetch({
      url: '/devices/update?id=' + this.data.details.id ,
      method:'post',
      isShowLoading:true,
      data: {
        note: this.data.details.note,
        locationId: this.data.placeData[this.data.placeIndex].id,
        planId: this.data.tollsData[this.data.tollIndex].id,
        groupId: this.data.groupsData[this.data.groupIndex].id,
        name: this.data.details.name,

      }
    })
    .then( res => {
      wx.navigateBack({
        delta: 1,
      })
    })
  }

})