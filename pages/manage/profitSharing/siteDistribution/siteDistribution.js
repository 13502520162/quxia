import fetch from '../../../../lib/fetch.js'
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trade: [],
    tradeIndex: 0,
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

  onLoad: function() {
    this.fetchTrade();
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
    this.permissionFilter();
  },

  /**
   * 权限过滤
   */
  permissionFilter: function() {
    let permissions = getStorePermissions();
    //列表
    if (permissions.includes(16)) {
      this.setData({
        disList: false
      })
    }
    //添加
    if (permissions.includes(17)) {
      this.setData({
        disAdd: false
      })
    }
    //编辑
    if (permissions.includes(18)) {
      this.setData({
        disEdit: false
      })
    }
  },

  onShow: function() {
    if (this.data.trade.length) {
      //重置列表参数，刷新列表数据
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
      this.fetchPlaceList();
    }
  },

  /**
   * 获取所有场地
   */
  fetchTrade: function() {
    fetch({
        url: '/locations/select',
      })
      .then(res => {
        res.data.unshift({
          id: '',
          name: "全部"
        })
        this.setData({
          trade: res.data
        })
        this.fetchPlaceList();
      })
  },


  /**
   * 场地选项改变
   */
  onFilterTradeChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value
    })
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchPlaceList();
  },

  /**
   * 获取场地列表
   */

  fetchPlaceList: function() {

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
        url: '/locationRoyalties',
        data: {
          ...this.data.listParams,
          typeId: this.data.trade[this.data.tradeIndex].id,
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
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    let itemList;
    let enabled = e.currentTarget.dataset.enabled;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑', '生效', '取消'];
    } else {
      itemList = ['编辑', '生效'];
    }

    if (enabled) {
      itemList[1] = '失效'
    } else {
      itemList[1] = '生效'
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './setUp/setUp?field=edit&id=' + id,
              })
              break;
            case 1:
              if (enabled) {
                this.disableManagement(id)

              } else {
                this.enableManagement(id)
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
   * 失效 
   */
  disableManagement: function(id) {
    fetch({
        url: '/locationRoyalties/disable?id=' + id,
        method: 'post',
        data: {
          id
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
   * 生效
   */
  enableManagement: function(id) {
    fetch({
        url: '/locationRoyalties/enable?id=' + id,
        data: {
          id
        },
        method: 'post'
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
   * 加载更多
   */
  loadMoreListData: function() {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      this.fetchPlaceList();
    }
  },



  /**
   * 搜索
   */
  searchInputConfirm: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    }, () => {
      this.fetchPlaceList();
    })
  },

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
  }

})