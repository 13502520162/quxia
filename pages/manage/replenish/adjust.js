// pages/manage/replenish/replenish.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    deviceInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceId: options.deviceId
    }, () => {
      this.fetchDeviceInfo();
    })
  },

  /**
   * 获取设备信息
   */
  fetchDeviceInfo: function (deviceId) {
    fetch({
      url: '/restocks/deviceInfo',
      data: {
        deviceId: this.data.deviceId
      }
    })
      .then(res => {
        res.data.shelfs = res.data.shelfs.map(item => {
          if (item.state == 'NORMAL') {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        })
        this.setData({
          deviceInfo: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 复选框改变
   */
  checkboxChange: function (e) {
    var checkboxItems = this.data.deviceInfo.shelfs, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (i == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    let deviceInfo = this.data.deviceInfo;
    deviceInfo.shelfs = checkboxItems;
    this.setData({
      deviceInfo: deviceInfo
    });
  },

  /**
   * 一键开门
   */
  openDoor: function (){
    fetch({
      url:'/quxia/remote/openDoors',
      method: 'post',
      data: {
        deviceId: this.data.deviceId,
        doors: this.data.deviceInfo.shelfs.map(item => item.number )
      },
      isShowLoading: true
    })
    .then( res => {
       wx.showToast({
         title: '操作成功',
       })
    })
    .catch( err =>{
      console.error(err);
    })
  },

  /**
   * 确定调整
   */
  confrim: function () {
    let restocks = [];
    this.data.deviceInfo.shelfs.forEach(item => {
      if ( item.checked) {
        restocks.push({ number: item.number, amount: 1 })
      } else {
        restocks.push({ number: item.number, amount: 0 }) 
      }
    });
    fetch({
      url: '/restocks/update',
      method:'post',
      data: {
        deviceId: this.data.deviceId,
        shelfs: restocks
      }
    })
    .then( res=>{
       wx.showToast({
         title: '操作成功',
       })
       setTimeout(()=> {
         wx.navigateBack({
           detal:1
         })
       },1500)
    })
    .catch( err =>{
      console.error(err);
    })
  }
  


})