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

    imgSrc: '',
    isImg: false,
    typeId: '',
    wxaIndex: '',
    id: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      details: { ...this.details,
        id: options.id
      },
      id: options.id,
      typeId: options.typeId,
      wxaIndex: options.wxaIndex
    })

    this.permissionFilter();

    /**
     * promise.all 无效？？？只能这样子了
     */
    this.fetchGroups().then(() => {
      this.fetchPlaces().then(() => {
        this.fetchTolls().then(() => {
          this.fetchDeviceDetails(options.id).then(() => {
            this.data.placeData.map((item, index) => {
              if (item.id == this.data.details.locationId) {
                this.setData({
                  placeIndex: index
                })
              }
            });
            this.data.groupsData.map((item, index) => {
              if (item.id == this.data.details.groupId) {
                this.setData({
                  groupIndex: index
                })
              }
            })
            this.data.tollsData.map((item, index) => {
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
  permissionFilter: function() {
    let permissions = getStorePermissions();

    if (app.hasPermission()) {
      this.setData({
        disBind: false
      })
    } else {
      //列表
      if (permissions.permissions.includes(9)) {
        this.setData({
          disBind: false
        })
      }
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
  bindPlaceChange: function(e) {
    this.setData({
      placeIndex: e.detail.value
    })
  },

  // /**
  //  * 套餐更改
  //  */

  // bindTollChange: function(e) {
  //   this.setData({
  //     tollIndex: e.detail.value
  //   })
  // },

  /**
   * 设备名称更改
   */
  onDeviceNameChange: function(e) {
    this.setData({
      details: { ...this.data.details,
        name: e.detail.value
      }
    })
  },


  /**
   * 获取设备详情数据
   */

  fetchDeviceDetails: function(id) {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/devices/detail',
          data: {
            id: id
          }
        })
        .then(res => {
          this.setData({
            details: {
              id: id,
              ...res.data
            }
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
  fetchGroups: function() {

    return new Promise((resolve, reject) => {
      fetch({
          url: '/deviceGroups/select'
        })
        .then(res => {
          res.data.unshift({
            id: '',
            name: '请选择'
          })
          this.setData({
            groupsData: res.data
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
   * 获取所有的收费套餐
   */
  fetchTolls: function() {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/plans/select'
        })
        .then(res => {
          res.data.unshift({
            id: '',
            name: '请选择'
          })
          this.setData({
            tollsData: res.data
          });
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        })
    })

  },

  /**
   * 获取所有的场地
   */
  fetchPlaces: function() {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/locations/select'
        })
        .then(res => {
          res.data.unshift({
            id: '',
            name: '请选择'
          })
          this.setData({
            placeData: res.data
          });
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  /**
   * 设备二维码
   */
  onDelDevice: function() {
    fetch({
        url: '/devices/qrcode?deviceId=' + this.data.details.id,
        method: 'get',
        isShowLoading: true
      })
      .then(res => {
        let imgSrc = 'data:image/jpeg;base64,' + res.data;

        this.setData({
          imgSrc,
          isImg: true
        })

      })
  },

  /**
   * 关闭
   */
  closeImg: function() {
    this.setData({
      isImg: false
    })
  },

  /**
   * 保存图片
   */
  preservationCode: function() {
    let that = this;
    let aa = wx.getFileSystemManager();
    aa.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/code.png',
      data: this.data.imgSrc.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/code.png',
          success: function(res) {
            wx.showToast({
              title: '保存成功',
            })

            that.setData({
              isImg: false
            })
          },
          fail: function(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 备注更改
   */
  onNoteChage: function(e) {
    this.setData({
      details: { ...this.data.details,
        note: e.detail.value
      }
    })
  },

  /**
   * 提交更改
   */
  onSubmit: function() {
    fetch({
        url: '/devices/update?id=' + this.data.details.id,
        method: 'post',
        isShowLoading: true,
        data: {
          note: this.data.details.note,
          locationId: this.data.placeData.length ? this.data.placeData[this.data.placeIndex].id : '',
          groupId: this.data.groupsData.length ? this.data.groupsData[this.data.groupIndex].id : '',
          name: this.data.details.name
        }
      })
      .then(res => {
        wx.navigateBack({
          delta: 1,
        })
      })
  },


  /**
   * 跳转客户端
   */

  jumpClient: function() {
    let deviceId = this.data.id
    let wxaIndex = this.data.wxaIndex

    wx.navigateToMiniProgram({
      appId: 'wx8cf8de405bd24d30', // 要跳转的小程序的appid
      path: wxaIndex + '?scene=' + deviceId, // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        console.log(wxaIndex + '?scene=' + deviceId)
      }
    })
  }

})