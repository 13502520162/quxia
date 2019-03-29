import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    disEdit: true,
    disAdd: true,
    disList: true
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
    this.permissionFilter();
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
      if (permissions.permissions.includes(38)) {
        this.setData({
          disList: false
        })
      }
      //添加
      if (permissions.permissions.includes(39)) {
        this.setData({
          disAdd: false
        })
      }
      //查看
      if (permissions.permissions.includes(40)) {
        this.setData({
          disEdit: false
        })
      }
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
    this.fetchRoyaltyList();
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
    this.searchHandle();
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
   * 列表搜索
   */
  searchHandle: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    }, () => {
      this.fetchRoyaltyList();
    })
  },

  /**
   * 获取列表
   */

  fetchRoyaltyList: function() {
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
        url: '/royaltyPlans',
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
      this.fetchRoyaltyList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let enabled = e.currentTarget.dataset.enabled;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['启用', '查看', '删除', '取消'];
    } else {
      itemList = ['启用', '查看', '删除'];
    }
    if (enabled) {
      itemList[0] = "暂停";
    } else {
      itemList[0] = "启用"
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
              if (enabled) {
                this.disableRoyalty(id)
              } else {
                this.enableRoyalty(id)
              }
              break;
            case 1:
              if (!this.data.disEdit) {
                wx.navigateTo({
                  url: './details?type=edit&id=' + id + "&enabled=" + enabled,
                })
              }
              break;
            case 2:
              if (!this.data.disEdit) {
                this.delRoyalty(id);
              }
              break;
            default:
              break;
          }
        }
      }
    })
  },


  /**
   * 启用
   */
  enableRoyalty: function(id) {
    fetch({
        url: '/royaltyPlans/enable?id=' + id,
        method: 'post',
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enabled = true
          }
          return item;
        })
        this.setData({
          listData: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 暂停
   */
  disableRoyalty: function(id) {
    fetch({
        url: '/royaltyPlans/disable?id=' + id,
        method: 'post'
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enabled = false
          }
          return item;
        })
        this.setData({
          listData: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 删除
   */
  delRoyalty: function(id) {
    fetch({
        url: '/royaltyPlans?id=' + id,
        method: 'delete'
      })
      .then(res => {
        let listData = [];
        this.data.listData.map(item => {
          if (item.id != id) {
            listData.push(item)
          }
        });
        this.setData({
          listData: listData
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 跳转新增分润方案
   */
  onAddRoyalty: function() {
    wx.navigateTo({
      url: './details?type=new',
    })
  }


})