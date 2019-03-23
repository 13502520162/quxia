//index.js
import fetch from '../../lib/fetch.js';
import moment from '../../lib/moment.min.js';
import getStorePermissions from '../../utils/getStorePremissioin.js'
//获取应用实例
const app = getApp();
let permissions = [];
Page({
  data: {

    summaryData: {},
    icomeSummaryData: '0.00',
    isShowSummary: false, //统计报表权限则显示
    dateItem: {
      yesterday: false,
      today: true,
      week: false,
      month: false
    },
    funcList: [{
        title: '营收统计',
        icon: '../../assets/images/replenish.png',
        desc: "查看实时收益流水",
        pageUrl: './analysis',
        premission: 3,
        hide: true
      },
      {
        title: '消息提醒',
        icon: '../../assets/images/messageNotification.png',
        desc: "条未读",
        pageUrl: '../manage/messageReminder/messageReminder',
        premission: 8,
        hide: true
      },
      {
        title: '设备列表',
        icon: '../../assets/images/list.png',
        desc: "在线设备",
        pageUrl: '../manage/device/list/list',
        premission: 8,
        hide: true
      },
      {
        title: '设备绑定',
        icon: '../../assets/images/device.png',
        desc: "扫描设备二维码",
        pageUrl: '',
        premission: 9,
        hide: true
      },
      {
        title: '商品套餐',
        icon: '../../assets/images/toll.png',
        desc: "管理商品信息",
        pageUrl: '../manage/toll/toll',
        premission: 19,
        hide: true
      },
      {
        title: '场地管理',
        icon: '../../assets/images/location.png',
        desc: "管理投放场地",
        pageUrl: '../manage/place/list/list',
        premission: 15,
        hide: true
      },
      {
        title: '库存管理',
        icon: '../../assets/images/repertory.png',
        desc: "库存信息管理",
        pageUrl: '../manage/inventory/list',
        premission: 31,
        hide: true
      },
      {
        title: '补货',
        icon: '../../assets/images/scan.png',
        desc: "扫码补货",
        pageUrl: '../manage/replenish/replenish',
        premission: 43,
        hide: true
      },
      {
        title: '货道状态',
        icon: '../../assets/images/location.png',
        desc: "货道状态信息",
        pageUrl: '../manage/shelfsStatus/list',
        premission: 54,
        hide: true
      },
      {
        title: '优惠券',
        icon: '../../assets/images/coupon2.png',
        desc: "优惠券管理",
        pageUrl: '../manage/coupon/coupon',
        premission: 55,
        hide: true
      },
    ],

    deviceActiveInfo: {},

    messageNumber: 0
  },

  onLoad: function() {
    permissions = getStorePermissions();
    let funcList = this.data.funcList.map(item => {
      if (permissions.includes(item.premission)) {
        item.hide = false
      }
      return item;
    });
    let isShowSummary = permissions.includes(1);

    this.setData({
      funcList: funcList,
      isShowSummary: isShowSummary
    })
    this.fetchSummaryData();
    this.fetchDeviceActiveInfo();
    this.fetchMessageNumber()
  },



  /**
   * 获取汇总数据
   */
  fetchSummaryData() {
    let start, end = moment().format('YYYY-MM-DD');;
    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      start = moment().subtract(1, 'day').format('YYYY-MM-DD');
    } else if (dateItem.today) {
      start = moment().format('YYYY-MM-DD');
    } else if (dateItem.week) {
      start = moment().subtract(1, 'week').format('YYYY-MM-DD');
    } else if (dateItem.month) {
      start = moment().subtract(1, 'month').format('YYYY-MM-DD');
    }
    fetch({
        url: '/analytics/summary',
        isShowLoading: true,
        data: {
          start: start,
          end: end
        }
      })
      .then(res => {
        this.setData({
          summaryData: res.data
        });
        this.fetchIncomeSummary(start, end);
      })
  },

  /**
   * 获取收入汇总数据
   */
  fetchIncomeSummary: function(startDate, endDate) {
    fetch({
        url: '/incomeAnalytics/summary',
        data: {
          start: startDate,
          end: endDate
        }
      })
      .then(res => {
        this.setData({
          icomeSummaryData: res.data
        })
      })
  },


  /**
   * 获取设备列表在线数和总数
   */
  fetchDeviceActiveInfo: function() {
    fetch({
        url: "/devices/summary"
      })
      .then(res => {
        this.setData({
          deviceActiveInfo: res.data
        })
      })
  },




  /**
   * 获取消息提醒条数
   */
  fetchMessageNumber: function() {
    fetch({
        url: "/notifications/summary"
      })
      .then(res => {
        this.setData({
          messageNumber: res.data.income + res.data.order + res.data.stockAlert
        })
      })
  },


  // 获取营业数据
  fetchOperationData(startTime, endTime) {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/analytics/data',
          isShowLoading: true,
          data: {
            startStr: startTime,
            endStr: endTime
          },
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  /**
   * 下一个日期时间段
   */

  nextDate: function() {

    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: true,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.today) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: true,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.week) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: false,
          month: true
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    }
  },


  /**
   * 上一个日期时间段
   */

  lastDate: function() {

    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: false,
          month: true,
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.today) {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.week) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: true,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    }
  },

  /**
   * 去到数据分析页
   */
  goToAnalysis: function() {
    wx.navigateTo({
      url: './analysis',
    })
  },


  /**
   * 跳转到相应的功能
   */
  goToFunc: function(e) {
    let url = e.currentTarget.dataset.url;
    if (url == '../manage/replenish/replenish') {
      wx.scanCode({
        success: (res) => {
          wx.navigateTo({
            url: `${url}?sence=${res.result}`,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }

})