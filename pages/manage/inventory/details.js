import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inventoryId: null,

    summaryData: {},

    inputShowed: false,
    inputVal: "",

    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    systemInfo: {},

    disList: true,

    actionSheetListItems: ['库存记录', '入库', '发货', '退货']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        inventoryId: options.id
      });
      this.fetchInventorySummary();
    }

    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
    this.permissionFilter();
  },


  /**
   * 权限过滤
   */
  permissionFilter: function() {
    let permissions = getStorePermissions();
    let actionSheetListItems = this.data.actionSheetListItems;

    if (app.hasPermission()) {
      this.setData({
        disList: false
      })
      // let itemIndex = actionSheetListItems.indexOf('入库') || actionSheetListItems.indexOf('退货') || ctionSheetListItems.indexOf('发货') || actionSheetListItems.indexOf('库存记录');
      // if (itemIndex > -1) {
      //   actionSheetListItems.splice(itemIndex, 1);
      // }
    } else {

      //列表
      if (permissions.permissions.includes(32)) {
        this.setData({
          disList: false
        })

      }
      //入库
      if (!permissions.permissions.includes(33)) {
        let itemIndex = actionSheetListItems.indexOf('入库');
        if (itemIndex > -1) {
          actionSheetListItems.splice(itemIndex, 1);
        }
      }
      //退货
      if (!permissions.permissions.includes(34)) {
        let itemIndex = actionSheetListItems.indexOf('退货');
        if (itemIndex > -1) {
          actionSheetListItems.splice(itemIndex, 1);
        }
      }
      //发货
      if (!permissions.permissions.includes(35)) {
        let itemIndex = actionSheetListItems.indexOf('发货');
        if (itemIndex > -1) {
          actionSheetListItems.splice(itemIndex, 1);
        }

        //库存记录
        if (!permissions.permissions.includes(36)) {
          let itemIndex = actionSheetListItems.indexOf('库存记录');
          if (itemIndex > -1) {
            actionSheetListItems.splice(itemIndex, 1);
          }
        }
      }

      this.setData({
        actionSheetListItems: actionSheetListItems
      })

    }



  },

  onShow: function() {
    this.setData({
      inputShowed: false,
      inputVal: "",

      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.permissionFilter();
    this.fetchInventoryList();
    this.fetchInventorySummary();
  },

  /**
   * 搜索框事件 
   */
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.onSearchHandle();
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },


  /**
   * 获取列表
   */

  fetchInventoryList: function() {

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
        url: '/inventory/stockLocations?id=' + this.data.inventoryId,
        data: {
          ...this.data.listParams,
          query: this.data.inputVal
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
      this.fetchInventoryList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let itemList = this.data.actionSheetListItems;
    if (this.data.systemInfo.platform == 'android') {
      if (itemList.indexOf('取消') == -1) {
        itemList.push('取消')
      }

    }


    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          let tapItem = itemList[res.tapIndex];
          switch (tapItem) {
            case '库存记录':
              wx.navigateTo({
                url: './record?locationId=' + id + '&productId=' + this.data.inventoryId,
              })
              break;
            case '入库':
              wx.navigateTo({
                url: './stockIn?locationId=' + id + '&productId=' + this.data.inventoryId,
              })
              break;
            case '发货':
              wx.navigateTo({
                url: './transfer?locationId=' + id + '&productId=' + this.data.inventoryId,
              })
              break;
            case '退货':
              wx.navigateTo({
                url: './return?locationId=' + id + '&productId=' + this.data.inventoryId,
              })
              break;
            default:
              break;
          }
        }
      }
    })
  },


  /**
   * 跳转到详情
   */
  onAddCommodity: function() {
    wx.navigateTo({
      url: './details',
    })
  },

  /**
   * 获取仓库汇总
   */
  fetchInventorySummary: function() {
    fetch({
        url: '/inventory/totalStock',
        data: {
          productId: this.data.inventoryId
        }
      })
      .then(res => {
        this.setData({
          summaryData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  onSearchHandle: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: []
    })
    this.fetchInventoryList();
  }



})