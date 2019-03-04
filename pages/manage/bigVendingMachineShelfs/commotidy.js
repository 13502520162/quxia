import fetch from '../../../lib/fetch.js'
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
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
    this.fetchCommodityList();
  },

  /**
   * 搜索框事件 
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },


  /**
   * 获取商品列表
   */

  fetchCommodityList: function () {
    if (this.data.listLoading) {
      return;
    }

    if (this.data.listEnd){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/products',
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
  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchCommodityList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    
    let pages = getCurrentPages();
    let prepage = pages[pages.length-2];
    let commodity = {};

    for (let i = 0; i < this.data.listData.length; i++ ){
      if (this.data.listData[i].id == e.currentTarget.dataset.id) {
        commodity.price = this.data.listData[i].price;
        commodity.productId = this.data.listData[i].id;
        commodity.image = this.data.listData[i].image;
        commodity.name = this.data.listData[i].name;
        break;
      }
    }

    prepage.setData({
      commotidyData: { ...prepage.data.commotidyData, ...commodity  }
    })
    wx.navigateBack({
      delta:1
    })
  },



})