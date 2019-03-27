// pages/manage/messageReminder/messageReminder.js

import fetch from '../../../lib/fetch.js'
import moment from '../../../lib/moment.js'

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: [{
      name: "缺货提醒",
      num: 0,
      type: 'STOCK_ALERT'
    }, {
      name: "订单通知",
      num: 0,
      type: 'ORDER'
    }, {
      name: '收入通知',
      num: 0,
      type: 'INCOME'
    }],

    type: 'STOCK_ALERT',
    STOCK_ALERT: 0,
    ORDER: 0,
    INCOME: 0,
    listData: [],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    listParams: {
      from: 0,
      size: 10
    },


    listLoading: false

  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    this.fetchTab()
    this.fetchList()
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      type: e.currentTarget.dataset.type,
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    }, () => {
      this.fetchList()
    });
  },


  /**
   * 获取tab 消息条数
   */
  fetchTab: function() {
    fetch({
      url: '/notifications/summary'
    }).then(res => {
      this.setData({
        STOCK_ALERT: res.data.STOCK_ALERT || 0,
        ORDER: res.data.ORDER || 0,
        INCOME: res.data.INCOME || 0
      })

    })
  },


  /**
   * 消息列表
   */
  fetchList: function() {

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/notifications',
      data: {
        ...this.data.listParams,
        type: this.data.type
      }
    }).then(res => {
      res.data.map((item) => {
        item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
        return item;
      })
      this.setData({
        listData: [...this.data.listData, ...res.data]
      })
    }).finally(() => {
      this.setData({
        listLoading: false
      })
    })
  },

  /**
   * 标记已读
   */
  markedRead: function(e) {
    let id = e.currentTarget.dataset.id
    let type = this.data.type
    fetch({
      url: '/notifications/read?id=' + id,
      data: {
        id
      },
      method: "POST"
    }).then(res => {
      let listData = this.data.listData.map(item => {
        if (item.id == id) {
          item.read = true
        }
        return item;
      })
      let {
        STOCK_ALERT,
        ORDER,
        INCOME
      } = this.data
      if (type == 'STOCK_ALERT') {
        STOCK_ALERT--
      } else if (type == 'ORDER') {
        ORDER--
      } else {
        INCOME--
      }
      this.setData({
        listData: listData,
        STOCK_ALERT,
        ORDER,
        INCOME
      });
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
    this.fetchList();
  }
});