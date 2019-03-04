import fetch from '../../../lib/fetch.js'
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
    filterParams: {},

    choosePlaces: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.fetchDevices();

  },

  /**
   * 获取场地
   */

  fetchDevices: function () {
    if (this.data.listLoading && this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/locations/select',
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
          if (this.data.choosePlaces.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        })

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
      this.fetchDevices();
    }
  },




  /**
   * 选择设备
   */
  checkboxChange: function (e) {

    var listData = this.data.listData, values = e.detail.value;
    for (var i = 0, lenI = listData.length; i < lenI; ++i) {
      listData[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (listData[i].id == values[j]) {
          listData[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      choosePlaces: values,
      listData: listData
    });
  },

  /**
   * 确定所选
   */
  onConfirm: function () {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    let newOrUpdateParams = prepage.data.newOrUpdateParams;
    newOrUpdateParams.objectIds = this.data.choosePlaces;
    prepage.setData({
      newOrUpdateParams: newOrUpdateParams
    })

    wx.navigateBack({
      detal: 1
    })
  }



})