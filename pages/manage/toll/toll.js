// pages/manage/toll/toll.js
import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    systemInfo: {},

    disEdit: true,
    disAdd: true,
    disList: true
  },

  onLoad: function() {
    this.permissionFilter();
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
  },

  /**
   * 权限过滤
   */
  permissionFilter: function() {
    let permissions = getStorePermissions();
    if (app.hasPermission()) {
      this.setData({
        disList: false,
        disAdd: false,
        disEdit: false
      })
    } else {
      //列表
      if (permissions.permissions.includes(20)) {
        this.setData({
          disList: false
        })
      }
      //添加
      if (permissions.permissions.includes(21)) {
        this.setData({
          disAdd: false
        })
      }
      //编辑
      if (permissions.permissions.includes(22)) {
        this.setData({
          disEdit: false
        })
      }
    }

  },

  onShow: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: []
    })
    this.fetchListData();
  },

  /**
   * 添加收费套餐
   */
  onAddToll: function() {
    wx.navigateTo({
      url: './tollDetails',
    })
  },

  /**
   * 获取收费套餐列表
   */
  fetchListData: function() {

    if (this.data.disList) {
      return;
    }

    if (this.data.listLoading) {
      return;
    }

    if (this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/plans',
        data: {
          ...this.data.listParams
        }
      })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        this.setData({
          listData: [...this.data.listData, ...res.data]
        })
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setData({
          listLoading: false
        })
      })
  },

  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      this.fetchListData();
    }
  },

  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['套餐上架', '编辑套餐', '删除套餐', '取消'];
    } else {
      itemList = ['套餐上架', '编辑套餐', '删除套餐'];
    }

    if (this.data.disEdit) {
      itemList.splice(1, 2);
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './putaway?id=' + id,
              })
              break;
            case 1:
              if (!this.data.disEdit) {
                wx.navigateTo({
                  url: './tollDetails?id=' + id,
                })
              }
              break;
            case 2:
              if (!this.data.disEdit) {
                this.delToll(id);
              }
              break;
            default:
              break;
          }
        }
      }
    })
  },

  delToll: function(id) {
    wx.showModal({
      title: '删除套餐',
      content: "确定删除?",
      cancelColor: 'red',
      showCancel: true,
      success: (e) => {
        if (e.confirm) {
          fetch({
              url: '/plans?id=' + id,
              isShowLoading: true,
              method: 'delete'
            })
            .then(res => {
              this.setData({
                listData: [],
                listEnd: false,
                listParams: {
                  from: 0,
                  size: 20
                },
              })
              this.fetchListData();
            })
            .catch(err => {
              console.error(err);
            })
        }
      }
    })
  }

})