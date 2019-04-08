// pages/manage/toll/putaway.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tollId: null,
    systemInfo: {},
    placesData: [],
    devices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
    this.setData({
      tollId: options.id
    })
    this.fetchPlaces();
  },
  /**
   * 获取所有的场地
   */
  fetchPlaces: function() {
    fetch({
        url: '/locations/select'
      })
      .then(res => {

        this.setData({
          placesData: res.data
        })
      })
  },

  onShow: function() {
    this.setData({
      devices: this.data.devices
    })
  },

  onReady: function() {
    this.fetchAppliedData();
  },

  /**
   * 场地更改
   */
  onFilterPlaceChange: function(e) {
    wx.navigateTo({
      url: 'placeDevices?id=' + this.data.placesData[e.detail.value].id,
    })
  },

  /**
   * 取消选择
   */
  onCancel: function() {
    wx.navigateBack({
      detal: 1
    })
  },

  /**
   * 获取已上架的场地
   */
  fetchAppliedData: function() {
    fetch({
        url: '/shelfs/appliedData',
        data: {
          id: this.data.tollId
        }
      })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          let data = res.data.map(item => {
            return {
              placeId: item.locationId,
              devices: item.deviceIds
            }
          })
          this.setData({
            devices: data
          })
        }
      })
  },

  /**
   * 货道上架
   */
  fetchPutaway: function() {
    let deviceIds = [];
    this.data.devices.map(item => {
      deviceIds = [...deviceIds, ...item.devices];
    })
    fetch({
        url: '/shelfs/apply?id=' + this.data.tollId,
        method: 'post',
        data: {
          id: this.data.tollId,
          deviceIds: deviceIds
        },
        isShowLoading: true
      })
      .then(res => {
        wx.showToast({
          title: '上架成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1000)
      })
  },

  showActionSheet: function(e) {

    let id = e.currentTarget.dataset.id;
    let itemList = []
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['增加/删除设备', '删除场地', '取消'];
    } else {
      itemList = ['增加/删除设备', '删除场地'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              let initChooseDevices = [];
              this.data.devices.map(items => {
                if (items.placeId == id) {
                  items.devices.map((item) => {
                    initChooseDevices.push(item.toString())
                    return item
                  })
                  return items
                }
              });

              wx.navigateTo({
                url: 'placeDevices?id=' + id + "&initChooseDevices=" + JSON.stringify(initChooseDevices)
              })
              break;
            case 1:
              let devices = []
              this.data.devices.map(item => {
                if (item.placeId !== id) {
                  return devices.push(item);
                }
              });
              this.setData({
                devices: devices
              })
              break;
            default:
              break;
          }
        }
      }
    })
  }
})