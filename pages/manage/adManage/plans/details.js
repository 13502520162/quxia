// pages/manage/adManage/plans/details.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typesData: [
      { name: "图片", value: 'IMAGE' },
      { name: "视频", value: 'VIDEO' }
    ],
    typeIndex: 0,
    deviceTypesData: [],
    deviceTypeIndex: 0,
    adSpaceData:[],
    adSpaceTypeIndex:0,
    id: null,
    adData: {
      resources: [],
      deviceIds: []
    },

    disPublish: false,
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

    if (options.state && options.state == 'PUBLISHED'){
      this.setData({
        disPublish: true
      })
    }

    this.fetchDeviceTypes();
  },

  /**
 * 类型更改
 */
  bindTypeChange: function (e) {
    this.setData({
      adData: { ...this.data.adData, resources: [] },
      typeIndex: e.detail.value,
    })
  },

  /**
   * 获取所有的设备类型
   */

  fetchDeviceTypes: function () {
    fetch({
      url: "/devices/types"
    })
      .then(res => {
        var index = this.findListIndex(this.data.adData.deviceTypeId, res.data, (item, val)=>{return item.id === val});

        res.data.unshift({
          id: '',
          name: '请选择'
        });

        index++;

        this.setData({
          deviceTypeIndex : index,
          deviceTypesData: res.data
        });
        this.fetchAdSpaceTypes();
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 获取所有的广告位类型
   */

  fetchAdSpaceTypes: function () {

      var selectedDeviceType = this.data.deviceTypesData[this.data.deviceTypeIndex];
      if(selectedDeviceType.id === ''){
        this.setData({
          adSpaceTypeIndex: 0,
          adSpaceData: [{
            id: '',
            name: '请选择'
          }]
        })
      }else{
        fetch({
          url:'/ad/plans/adSpaces',
          data: {
            deviceTypeId: this.data.deviceTypesData[this.data.deviceTypeIndex].id
          }
        })
            .then( res => {
              var index = this.findListIndex(this.data.adData.adSpaceTypeId, res.data, (item, val)=>{return item.id === val});

              res.data.unshift({
                id: '',
                name: '请选择'
              })

              index++;

              this.setData({
                adSpaceTypeIndex: index,
                adSpaceData: res.data
              })
            })
            .catch( err =>{
              console.error(err);
            })
      }



  },

  findListIndex : function(currentValue, listData, testFn){
    if(listData && listData.length> 0){
        for(var i = 0; i<listData.length;i++){
            if(testFn.call(listData[i], listData[i],currentValue)){
              return i;
            }
        }

    }
     return -1;
  },

  /**
   * 设备类型更改
   */
  bindDeviceTypeChange: function (e) {
    this.setData({
      deviceTypeIndex: e.detail.value,
    })
    this.fetchAdSpaceTypes();
  },

/**
 * 广告类型更改
 */
  bindAdSpaceTypeChange: function (e) {
    this.setData({
      adSpaceTypeIndex: e.detail.value,
      adSpaceTypeId : e.target.dataset.id
    })
  },

  /**
 * 名称更改
 */
  onNameChange: function (e) {
    this.setData({
      adData: { ...this.data.adData, name: e.detail.value }
    })
  },

  /**
   * 间隔时间更改
   */
  onIntervalChange: function(e){
    this.setData({
      adData: { ...this.data.adData, interval: e.detail.value }
    })
  },

  /**
 * 选择设备
 */
  goToSelectDevices: function () {
    wx.navigateTo({
      url: './selectDevices?id='+this.data.deviceTypesData[this.data.deviceTypeIndex].id,
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
   * 确定
   */
  onConfirm: function (e) {
    const { name, interval  } = e.detail.value;
    if (!name) {
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


    if (this.data.typeIndex == 0) {
      if (!interval) {
        wx.showToast({
          title: '请输入图片间隔时间',
          icon: 'none'
        })
        return;
      }
    }


    let params = {
      ...this.data.adData,
      ...e.detail.value,
      type: this.data.typesData[this.data.typeIndex].value,
      adSpaceTypeId: this.data.adSpaceData[this.data.adSpaceTypeIndex].id,
      deviceTypeId: this.data.deviceTypesData[this.data.deviceTypeIndex].id
    }
    if (this.data.id) {
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
      url: '/ad/plans',
      method: 'post',
      data: { ...params }
    })
      .then(res => {
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
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 更新广告投放
   */

  fetchUpdatePutting: function (params) {
    fetch({
      isShowLoading: true,
      url: '/ad/plans?id=' + this.data.id,
      method: 'put',
      data: { ...params }
    })
      .then(res => {
        wx.showToast({
          title: '更新成功',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1500)

      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 获取广告计划详情
   */
  fetchDetail: function () {
    fetch({
      url: '/ad/plans/detail?id=' + this.data.id,
      isShowLoading: true,
    })
      .then(res => {
        this.setData({
          typeIndex: res.data.type == 'VIDEO' ? 1 : 0,
          adData: { ...this.data.adData, ...res.data }
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 广告计划暂停
   */
  planPauseHandle: function () {
    fetch({
      url: '/ad/plans/pause?id='+this.data.id,
      method: 'post',
      isShowLoading: true
    })
    .then( res => {
       this.setData({
         disPublish: false
       })
    })
    .catch( err => {
      console.error(err);
    })
  }

})