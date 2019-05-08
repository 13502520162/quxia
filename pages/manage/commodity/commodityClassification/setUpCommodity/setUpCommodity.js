// pages/manage/commodity/commodityClassification/setUpCommodity/setUpCommodity.js
import fetch from '../../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: '',
    count: '',
    selCount: '',
    inputVal: '',
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    products: [],
    choosePlaces: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.id) {
      let products = []
      products.push(options.id)
      this.setData({
        products,
        categoryId: options.id
      })
    }

    this.fetchCommodity();

  },

  /**
   * 获取商品
   */

  fetchCommodity: function() {
    if (this.data.listLoading && this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/products',
        data: {
          ...this.data.listParams,
          // categoryId: this.data.categoryId,
          query: this.data.inputVal
        }
      })
      .then(res => {

        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        let choosePlaces = []
        res.data.map(item => {
          if (this.data.categoryId == item.categoryId) {
            item.checked = true;
            choosePlaces.push(item.id)
          } else {
            item.checked = false;
          }
          return item;
        })

        this.setData({
          listData: [...this.data.listData, ...res.data],
          choosePlaces: [...this.data.choosePlaces, ...choosePlaces]
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




    fetch({
      url: '/products/count'
    }).then(res => {

      this.setData({
        count: res.data
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
      this.fetchCommodity();
    }
  },




  /**
   * 选择商品
   */
  checkboxChange: function(e) {
    var listData = this.data.listData,
      values = e.detail.value;
    for (var i = 0, lenI = listData.length; i < lenI; ++i) {
      listData[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (listData[i].id == values[j]) {
          listData[i].checked = true;
          break;
        }
      }
    }
    console.log(values)

    this.setData({
      choosePlaces: values,
      listData: listData,
      selCount: values.length
    });
  },

  /**
   * 确定所选
   */
  onConfirm: function() {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    prepage.updateProducts(this.data.choosePlaces)

    wx.navigateBack({
      detal: 1
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
      this.fetchCommodity();
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



})