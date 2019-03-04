import fetch from '../../../../lib/fetch.js'
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
    systemInfo: {}
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
  },

  onShow: function () {
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
  onAddToll: function () {
    wx.navigateTo({
      url: './details',
    })
  },

  /**
   * 获取收费套餐列表
   */
  fetchListData: function () {
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
      url: '/adpub/pricingPlans',
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
  loadMoreListData: function () {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchListData();
    }
  },

  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑套餐', '套餐上架', '删除套餐', '取消'];
    } else {
      itemList = ['编辑套餐', '套餐上架', '删除套餐'];
    }
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './details?id=' + id,
              })
              break;
            case 1:
              wx.navigateTo({
                url: './putaway?id=' + id,
              })
              break;
            case 2:
              this.delToll(id);
              break;
            default:
              break;
          }
        }
      }
    })
  },

  delToll: function (id) {
    wx.showModal({
      title: '删除套餐',
      content: "确定删除?",
      cancelColor: 'red',
      showCancel: true,
      success: (e) => {
        if (e.confirm) {
          fetch({
            url: '/adpub/pricingPlans?id=' + id,
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