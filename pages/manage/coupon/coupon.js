// pages/coupon/coupon.js
import fetch from '../../../lib/fetch.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    systemInfo: {},
    disAdd: true,
    listLoading: false,
    listEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function() {
    this.initData()

    this.setData({
      couponList: []
    })


    this.fetchCoupon()
  },
  initData: function() {

    this.setData({
      listParams: {
        from: 0,
        size: 10
      }
    })

  },

  /**
   * 获取优惠券列表
   */
  fetchCoupon: function() {
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
        url: '/coupons',
        data: {
          ...this.data.listParams
        }
      }).then(res => {
        let newData = res.data.map(item => {
          if (item.type == 'AMOUNT_OFF') {
            item.type = '减免卷'


          } else {
            item.type = '折扣券'
            item.isDate = false;

          }

          if (item.dateRule == 'AFTER_ACQUIRED') {
            item.date = '领取后' + item.validDays + '天有效';
          } else {

            item.date = util.formatTimeTwo(item.startDate) + ' 至 ' + util.formatTimeTwo(item.endDate);
          }


          return item;
        })
        this.setData({
          couponList: [...this.data.couponList, ...newData]
        })

      }).catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setData({
          listLoading: false
        })
      })
  },
  /**
   * 创建优惠券
   */
  newCoupons: function() {
    wx.navigateTo({
      url: 'newCoupons/newCoupons?field=add'
    })
  },
  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let $this = this;
    let {
      id,
      name,
      date,
      stock
    } = e.currentTarget.dataset;
    let enabled = e.currentTarget.dataset.enabled;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['查看', '开始投放', '调整库存', '数据统计', '删除', '取消'];
    } else {
      itemList = ['查看', '开始投放', '调整库存', '数据统计', '删除'];
    }

    if (enabled) {
      itemList[1] = "暂停投放";
    } else {
      itemList[1] = "开始投放"
    }


    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: 'newCoupons/newCoupons?id=' + id + '&field=view'
              })
              break;
            case 1:
              if (enabled) {
                this.disableCoupons(id)
              } else {
                this.enableCoupons(id)
              }
              break;
            case 2:
              let dataObj = {
                id,
                name,
                date,
                stock
              }
              wx.navigateTo({
                url: 'adjustingInventory/adjustingInventory?data=' + JSON.stringify(dataObj)
              })
              break;
            case 3:

              wx.navigateTo({
                url: 'couponStatistics/couponStatistics?couponId=' + id
              })
              break;
            case 4:
              wx.showModal({
                content: '是否删除该优惠券',
                success(res) {
                  if (res.confirm) {
                    fetch({
                      url: '/coupons?id=' + id,
                      method: 'delete',
                      data: {
                        id: id
                      }
                    }).then(res => {
                      $this.fetchCoupon()
                    })
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
      },
      fail: res => {
        console.log(res);
      }

    })
  },

  /**
   * 开始投放
   */
  enableCoupons: function(id) {
    fetch({
        url: '/coupons/enable?id=' + id,
        method: 'post',
        data: {
          id
        }
      })
      .then(res => {
        let listData = this.data.couponList.map(item => {
          if (item.id == id) {
            item.enabled = true
          }
          return item;
        })
        this.setData({
          couponList: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 结束投放
   */
  disableCoupons: function(id) {
    fetch({
        url: '/coupons/disable?id=' + id,
        method: 'post'
      })
      .then(res => {
        let listData = this.data.couponList.map(item => {
          if (item.id == id) {
            item.enabled = false
          }
          return item;
        })
        this.setData({
          couponList: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {
    this.setData({
      listParams: { ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchCoupon();
  },
})