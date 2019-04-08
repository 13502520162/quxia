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
    systemInfo: {},

    currId: ''

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
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    })
    this.fetchList()
  },



  /**
   * 获取商品分类管理列表
   */

  fetchList: function() {
    // if(this.data.listEnd){
    //   return;
    // }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/categories',
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
    let name = e.currentTarget.dataset.name;
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
                url: './newProducts/newProducts?field=view&id=' + id + '&name=' + name,
              })
              break;
            case 1:
              that.moveUpward(id)
              break;
            case 2:
              that.moveDown(id)
              break;
            case 3:
              this.setData({
                currId: id
              })
              wx.navigateTo({
                url: './setUpCommodity/setUpCommodity?field=view&id=' + id,
              })
              break;
            case 4:
              wx.showModal({
                content: '是否删除分类?',
                success(res) {
                  if (res.confirm) {
                    that.delPlace(id);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
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
   * 上移
   */

  moveUpward: function(id) {
    fetch({
        url: '/categories/move?id=' + id + '&up=' + true,
        method: 'POST',
        data: {
          id,
          up: true
        }
      })
      .then(res => {
        this.setData({
          listData: []
        })
        this.fetchList()
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 下移
   */
  moveDown: function(id) {
    fetch({
        url: '/categories/move?id=' + id + '&up=' + false,
        method: 'POST',
        data: {
          id,
          up: false
        }
      })
      .then(res => {
        this.setData({
          listData: []
        })
        this.fetchList()
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 删除
   */
  delPlace: function(id) {
    fetch({
        url: '/categories?id=' + id,
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
   * 加载更多
   */
  loadMoreListData: function() {

    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    //this.fetchList();

  },

  /**
   * 跳转到新建商品
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
      this.fetchList();
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
  },




  /**
   * 设置商品
   */
  updateProducts: function(data) {

    let products = data

    let id = this.data.currId;
    fetch({
      url: '/categories/products?id=' + id,
      method: "POST",
      data: {
        products,
        id: parseInt(id)
      }
    }).then(res => {
      wx.showToast({
        title: '新增成功',
        icon: 'success'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })
      }, 1500)
    })
  }

})