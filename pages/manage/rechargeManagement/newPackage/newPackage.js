// pages/manage/rechargeManagement/newPackage/newPackage.js
import fetch from '../../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    field: '',
    name: '',
    price: '',
    packageValue: '',

    newPackageItem: [{
      name: '充值送优惠券',
      value: '0',
      checked: false
    }],
    isPackage: true,
    refillMembershipCard: [{
      name: '充值送会员',
      value: '0',
      checked: false
    }],
    isCard: true,

    coupons: [],
    vipCards: [],
    couponIds: [],
    selCardId: '',
    couponList: [{
      listIndex: 0,
      listTap: 'listAdd'
    }],
    selIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchCoupons()
    this.fetchCards()
    console.log(options)
    this.setData({
      id: options.id,
      field: options.field
    })

    if (options.field == 'view') {
      this.fetchDetail()
    }
  },


  fetchDetail: function() {
    fetch({
      url: '/rechargePlans/detail?id=' + this.data.id
    }).then(res => {
      this.setData({
        name: res.data.name,
        price: res.data.price,
        packageValue: res.data.value
      })
      console.log(res)
    })
  },

  /**
   * 添加
   */
  listAdd: function(e) {

    let checked = this.data.isPackage
    if (checked) {
      wx.showToast({
        title: '请选择充值送优惠券',
        icon: 'none'
      })
      return;
    }

    let couponList = this.data.couponList
    let obj = {
      listIndex: couponList.length,
      listTap: 'listRemove'
    }

    couponList.push(obj)

    this.setData({
      couponList
    })

  },


  /**
   * 删除
   */
  listRemove: function(e) {
    let index = e.currentTarget.dataset.listindex;
    let couponList = this.data.couponList
    for (let i = 0; i < couponList.length; i++) {
      if (couponList[i].listIndex == index) {
        couponList.splice(i, 1)
      }
    }
    this.setData({
      couponList
    })

  },



  /**
   * 获取优惠券列表
   */
  fetchCoupons: function() {
    fetch({
      url: '/coupons/select'
    }).then(res => {
      let index = 0;
      let coupons = res.data.map(item => {
        item.index = index++
          return item;
      })
      this.setData({
        coupons
      })
    })
  },




  /**
   * 获取会员卡列表
   */
  fetchCards: function() {
    fetch({
      url: '/vipCards/select'
    }).then(res => {

      this.setData({
        vipCards: res.data
      })
    })
  },


  checkboxConponChange: function(e) {
    var checkboxItems = this.data.newPackageItem,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      newPackageItem: checkboxItems,
      isPackage: !this.data.isPackage
    });
  },


  checkboxVipChange: function(e) {
    var checkboxItems = this.data.refillMembershipCard,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      refillMembershipCard: checkboxItems,
      isCard: !this.data.isCard
    });
  },

  couponListSel: function() {
    let checked = this.data.isPackage
    if (checked) {
      wx.showToast({
        title: '请选择充值送优惠券',
        icon: 'none'
      })
      return;
    }
  },

  cardSel: function() {
    let checked = this.data.isCard
    if (checked) {
      wx.showToast({
        title: '请选择充值送会员',
        icon: 'none'
      })
      return;
    }
  },


  /**
   * 充值送优惠券
   */
  onFilterChange: function(e) {

    let index = e.currentTarget.dataset.index;
    let value = parseInt(e.detail.value);
    let id = e.currentTarget.dataset.id
    let couponList = this.data.couponList;

    couponList[index].index = value;

    this.setData({
      couponList: couponList
    })

  },


  /**
   * 充值送会员
   */
  onFilterCardChange: function(e) {
    let value = e.detail.value
    this.setData({
      selCardId: value,
      selIndex: value
    })
  },

  packageName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },


  packagePrice: function(e) {
    this.setData({
      price: e.detail.value
    })
  },


  packageValue: function(e) {
    this.setData({
      packageValue: e.detail.value
    })
  },

  /**
   *  确定
   */
  preservation: function() {
    let couponList = this.data.couponList;
    let coupons = this.data.coupons;
    let couponListIndex = []
    let couponIds = []

    for (var j = 0, lenJ = couponList.length; j < lenJ; ++j) {
      couponListIndex.push(couponList[j].index)
    }

    coupons.map(item => {
      if (couponListIndex.includes(item.index)) {
        couponIds.push(item.id)
      }
    })
    this.setData({
      couponIds
    })

    if (this.data.name == '') {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return;
    }


    if (this.data.price == '') {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
      return;
    }



    if (this.data.packageValue == '') {
      wx.showToast({
        title: '请填写面值',
        icon: 'none'
      })
      return;
    }


    this.confirmRequest()

  },
  confirmRequest: function() {
    let id = this.data.id;
    fetch({
      url: '/rechargePlans',
      method: id ? 'PUT' : "POST",
      data: {
        id: id,
        name: this.data.name,
        price: this.data.price,
        value: this.data.packageValue,
        couponIds: this.data.couponIds,
        cardId: this.data.vipCards[this.data.selIndex].id
      }
    }).then(res => {
      wx.showToast({
        title: '成功',
        icon: 'none'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })
      }, 1500)
    })
  }
})