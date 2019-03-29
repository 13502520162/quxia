import fetch from '../../../../lib/fetch.js'
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
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
    this.permissionFilter();
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
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
      if (permissions.permissions.includes(48)) {
        this.setData({
          disList: false
        })
      }
      //添加
      if (permissions.permissions.includes(49)) {
        this.setData({
          disAdd: false
        })
      }
      //编辑
      if (permissions.permissions.includes(50)) {
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
    this.fetchAccountList();
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
      this.fetchAccountList();
    })
  },

  /**
   * 获取列表
   */

  fetchAccountList: function() {
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
        url: '/accounts',
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
      this.fetchAccountList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let admin = e.currentTarget.dataset.admin;
    let enabled = e.currentTarget.dataset.enabled;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑', '启用', '修改密码', '删除', '取消'];
    } else {
      itemList = ['编辑', '启用', '修改密码', '删除'];
    }

    if (enabled) {
      itemList[1] = "禁用";
    } else {
      itemList[1] = "启用"
    };

    if (this.data.disEdit) {
      itemList.splice(0, 1);
      itemList.splice(2, 1);
    }


    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          let targetItem = itemList[res.tapIndex];
          switch (targetItem) {
            case '编辑':
              if (!this.data.disEdit) {
                wx.navigateTo({
                  url: './details?type=edit&id=' + id + '&editAdmin=' + admin,
                })
              }
              break;
            case '启用':
              this.enableAccount(id);
              break;
            case '禁用':
              this.disableAccount(id);
              break;
            case '修改密码':
              wx.navigateTo({
                url: './alterPasswd?id=' + id,
              })
              break;
            case '删除':
              this.delAccount(id);
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
  enableAccount: function(id) {
    fetch({
        url: '/accounts/enable?id=' + id,
        method: 'post',
        data: {
          id: id
        }
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
  disableAccount: function(id) {
    fetch({
        url: '/accounts/disable?id=' + id,
        method: 'post',
        data: {
          id: id
        }
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
  delAccount: function(id) {
    fetch({
        url: '/accounts?id=' + id,
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
  onAddAccount: function() {
    wx.navigateTo({
      url: './details?type=new',
    })
  }


})