import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationId: null,
    productId: null,
    amount: 0,
    note: null,
    isDisabled: false,
    summaryData: {},
    placeList: [],
    fromLocationIndex: 0,
    toLoactionIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.locationId && options.productId) {
      this.setData({
        locationId: options.locationId,
        productId: options.productId
      })
      this.fetchSummary();
    }
    this.fetchPlaceList();
  },

  /**
   * 获取汇总
   */
  fetchSummary: function() {
    fetch({
        url: '/inventory/totalStock',
        data: {
          locationId: this.data.locationId,
          productId: this.data.productId
        }
      })
      .then(res => {
        this.setData({
          summaryData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 添加入库数量
   */

  addBtn: function() {
    let num = this.data.amount;
    if (num >= this.data.summaryData.availableStock) {
      return;
    }
    this.setData({
      amount: num + 1
    })
  },

  /**
   * 减少入库数量
   */

  reduceBtn: function() {
    let num = this.data.amount
    if (num > 0) {
      this.setData({
        amount: num - 1
      })
    }
  },

  /**
   * 备注改变
   */
  onNoteChange: function(e) {
    if (e.detail.value.length <= 200) {
      this.setData({
        note: e.detail.value
      })
    }
  },

  /**
   * 提交数据
   */
  submit: function() {
    if (this.data.amount == 0) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
      return;
    }



    if (this.data.summaryData.availableStock < this.data.amount) {
      wx.showToast({
        title: '请输入正确的发货数量',
        icon: 'none'
      })
      return;
    }
    this.setData({
      isDisabled: true
    })
    fetch({
        url: '/inventory/transfer',
        method: 'post',
        data: {
          locationId: this.data.locationId,
          productId: this.data.productId,
          amount: this.data.amount,
          fromLocationId: this.data.placeList[this.data.fromLocationIndex].id,
          toLocationId: this.data.placeList[this.data.toLoactionIndex].id,
          note: this.data.note
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
      .catch(err => {
        this.setData({
          isDisabled: false
        })
        console.error(err);
      })
  },

  /**
   * 获取所有的场地
   */
  fetchPlaceList: function() {
    fetch({
        url: '/locations/select'
      })
      .then(res => {
        let temArr = [];
        if (res.data) {
          res.data.map((item, index) => {
            if (item.id == this.data.locationId) {
              this.setData({
                fromLocationId: item.id,
                fromLocationName: item.name
              })
            } else {
              temArr.push(item);
            }
          })
        }
        this.setData({
          placeList: temArr
        })
      })
      .catch(err => {
        console.error(err);
      })
  },



  /**
   * 收货场地更改
   */
  onToLocationIdChange: function(e) {
    this.setData({
      toLoactionIndex: e.detail.value
    })
  },

  /**
   * 发货数量更改
   */
  onAmountChange: function(e) {
    this.setData({
      amount: e.detail.value
    })
  }
})