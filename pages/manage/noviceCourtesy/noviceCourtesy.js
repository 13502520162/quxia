import fetch from '../../../lib/fetch.js'
import util from '../../../utils/util.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trade: [{
        id: '',
        name: '全部'
      },
      {
        id: 'PENDING',
        name: '未开始'
      }, {
        id: 'ACTIVE',
        name: '进行中'
      }, {
        id: 'DISABLED',
        name: '已失效'
      }, {
        id: 'ENDED',
        name: '已结束'
      }
    ],
    tradeIndex: 0,
    inputShowed: false,
    inputVal: "",
    date: '',
    listParams: {
      from: 0,
      size: 10
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    systemInfo: {}

  },

  onLoad: function() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })


  },
  onShow: function() {
    if (this.data.trade.length) {
      //重置列表参数，刷新列表数据
      this.setData({
        inputShowed: false,
        inputVal: "",

        listParams: {
          from: 0,
          size: 10
        },
        listLoading: false,
        listEnd: false,
        listData: [],
      })
      this.fetchPlaceList();
    }
  },
  /**
   * 下拉选项改变
   */
  onFilterTradeChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value
    })
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchPlaceList();
  },

  /**
   * 获取新手有礼列表
   */

  fetchPlaceList: function() {


    this.setData({
      listLoading: true
    })

    fetch({
        url: '/couponOffers',
        data: {
          ...this.data.listParams,
          state: this.data.trade[this.data.tradeIndex].id,
          query: this.data.inputVal
        }
      })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        let listData = res.data.map(item => {
          if (item.permanent) {
            item.date = '永久有效'
          } else {
            item.date = util.formatTime(item.startDate) + ' 至 ' + util.formatTime(item.endDate);
          }

          if (item.state == 'DISABLED') {
            item.enabled = true
          } else {
            item.enabled = false
          }
          return item
        })

        this.setData({
          listData: [...this.data.listData, ...listData]
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
      itemList = ['查看', '失效', '删除', '取消'];
    } else {
      itemList = ['查看', '失效', '删除'];
    }

    if (enabled) {
      itemList.splice(1, 1)
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './activity/activity?field=view&id=' + id,
              })
              break;
            case 1:
              if (!enabled) {
                this.disableActive(id)
              }

              if (itemList[1] == '删除') {
                wx.showModal({
                  content: '是否删除该优惠券?',
                  success(res) {
                    if (res.confirm) {
                      that.delPlace(id);
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
              break;
            case 2:
              if (itemList[2] != '取消') {
                wx.showModal({
                  content: '是否删除该折扣券?',
                  success(res) {
                    if (res.confirm) {
                      that.delPlace(id);
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })

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
   * 删除
   */
  delPlace: function(id) {
    fetch({
        url: '/couponOffers?id=' + id,
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
   * 活动失效
   */
  disableActive: function(id) {
    fetch({
        url: '/couponOffers/disable?id=' + id,
        data: {
          id
        },
        method: 'post'
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enabled = true
            item.state = 'DISABLED'
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

    this.setData({
      listParams: { ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchPlaceList();

  },

  /**
   * 跳转到新建活动
   */
  onAddPlace: function() {
    wx.navigateTo({
      url: './activity/activity?field=add',
    })
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