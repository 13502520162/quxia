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
      if (permissions.permissions.includes(45)) {
        this.setData({
          disList: false
        })
      }
      //添加
      if (permissions.permissions.includes(46)) {
        this.setData({
          disAdd: false
        })
      }
      //编辑
      if (permissions.permissions.includes(47)) {
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
    this.fetchRoleList();
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
      this.fetchRoleList();
    })
  },

  /**
   * 获取列表
   */

  fetchRoleList: function() {
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
        url: '/roles',
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
      this.fetchRoleList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    if (this.data.disEdit) {
      return;
    }
    let id = e.currentTarget.dataset.id;
    let enabled = e.currentTarget.dataset.enabled;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑', '删除', '取消'];
    } else {
      itemList = ['编辑', '删除'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './details?type=edit&id=' + id,
              })
              break;
            case 1:
              this.delRole(id);
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
  enableRole: function(id) {
    fetch({
        url: '/roles/enable',
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
  disableRole: function(id) {
    fetch({
        url: '/roles/disable',
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
  delRole: function(id) {
    fetch({
        url: '/roles?id=' + id,
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
  onAddRoles: function() {
    wx.navigateTo({
      url: './details?type=new',
    })
  }


})