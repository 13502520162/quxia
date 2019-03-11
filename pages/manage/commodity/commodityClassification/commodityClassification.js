// pages/manage/commodity/commodityClassification/commodityClassification.js
import fetch from '../../../../lib/fetch.js'
import util from '../../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.setData({
      listData: []
    })
    this.fetchPlaceList()
  },



  /**
   * 获取充值管理列表
   */

  fetchPlaceList: function() {


    this.setData({
      listLoading: true
    })

    fetch({
        url: '/rechargePlans',
        isShowLoading: true,
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
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['查看', '上移', '下移', '设置商品', '删除', '取消'];
    } else {
      itemList = ['查看', '上移', '下移', '设置商品', '删除'];
    }



    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './newProducts/newProducts?field=view&id=' + id,
              })
              break;
            case 1:
                console.log('上移')
              break;
            case 2:
              console.log('下移')
            
              break;
            case 3:
              console.log('设置商品')
              break;
            case 4:
              console.log('删除')
              // wx.showModal({
              //   content: '是否删除套餐?',
              //   success(res) {
              //     if (res.confirm) {
              //       that.delPlace(id);
              //     } else if (res.cancel) {
              //       console.log('用户点击取消')
              //     }
              //   }
              // })
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
        url: '/rechargePlans?id=' + id,
        method: 'delete'
      })
      .then(res => {
        let listData = [];
        this.data.listData.map(item => {
          if (item.id != id) {
            listData.push(item)
          }
        });
        console.log(this.data.listData)
        this.setData({
          listData: listData
        })
      })
      .catch(err => {
        console.error(err);
      })

  },


  /**
   * 启动
   */
  enableManagement: function(id) {
    fetch({
        url: '/rechargePlans/enable?id=' + id,
        method: 'post',
        data: {
          id
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
  disableManagement: function(id) {
    fetch({
        url: '/rechargePlans/disable?id=' + id,
        data: {
          id
        },
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
   * 加载更多
   */
  loadMoreListData: function() {

    this.setData({
      listParams: {
        ...this.data.listParams,
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
      url: './newProducts/newProducts?field=add',
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