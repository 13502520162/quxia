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
    filed: 'radio',
    filterParams: {},
    chooseCoupons: [],
    selLen: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      filed: options.filed || 'radio',  // 接受外部组件字段  判断是否单选
      chooseCoupons: options.chooseCoupons   //  传回的选择完的 id 数组
    })
    this.fetchDevices();

  },

  /**
   * 获取优惠券列表
   */

  fetchDevices: function() {
    if (this.data.listLoading && this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/coupons/select',
        data: {
          ...this.data.listParams,
          ...this.filterParams
        }
      })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }

        res.data.map(item => {
          if (this.data.chooseCoupons.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        })

        this.setData({
          listData: [...this.data.listData, ...res.data],
          selLen: this.data.chooseCoupons.length
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
      this.fetchDevices();
    }
  },




  /**
   * 选择优惠券
   */
  checkboxChange: function(e) {

    var listData = this.data.listData,
      values = e.detail.value,
      selLen = 0;

    if (this.data.filed == 'radio') { // 接受外部组件字段  判断是否单选
      for (var i = 0, lenI = listData.length; i < lenI; ++i) {
        listData[i].checked = false;
        if (listData[i].id == values) {
          listData[i].checked = true;
        }
      }
      selLen = 1
    } else {
      for (var i = 0, lenI = listData.length; i < lenI; ++i) {
        listData[i].checked = false;
        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (listData[i].id == values[j]) {
            listData[i].checked = true;
            break;
          }
        }
      }

      selLen = values.length
    }

    if(typeof values == 'string'){
      values = values.split(",")
    }

    this.setData({
      chooseCoupons: values,
      listData: listData,
      selLen: selLen
    });
  },

  /**
   * 确定所选
   */
  onConfirm: function() {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    prepage.setData({
      chooseCoupons: this.data.chooseCoupons
    })

    wx.navigateBack({
      detal: 1
    })
  }



})