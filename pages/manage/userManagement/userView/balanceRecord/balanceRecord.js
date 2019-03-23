// pages/manage/userManagement/userView/balanceRecord/balanceRecord.js
import fetch from '../../../../../lib/fetch.js';
import moment from '../../../../../lib/moment.min.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '',
    totalRecharge: '',
    totalPaidBalance: '',
    date: '2019-03-01',
    start: '',
    end: '',
    id: '',
    type: '',
    listData: [],

    totalRecharge1: '',
    totalBalancePaid: '',

    source: [{
      value: '',
      name: '全部记录',
      checked: true
    }, {
      value: 'RECHARGE',
      name: '充值记录',
      checked: false
    }, {
      value: 'EXPENSE',
      name: '支付记录',
      checked: false
    }, {
      value: 'ADJUST',
      name: '调整记录',
      checked: false
    }],

    listParams: {
      from: 0,
      size: 10
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      totalRecharge: options.totalRecharge,
      totalPaidBalance: options.totalPaidBalance,
      date: moment().format("YYYY-MM"),
      start: moment().startOf('month').format("YYYY-MM-DD"),
      end: moment().endOf('month').format("YYYY-MM-DD"),
      id: options.id
    })
    this.fetchSummary()
    this.fetchList()


    let query = wx.createSelectorQuery()
    query.select('.balanceRecord').boundingClientRect(rect => {
      this.setData({
        scrollHeight: rect.height + 'px'
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  fetchList: function() {
    fetch({
      url: '/customers/balance/audits?start=' + this.data.start + '&end=' + this.data.end + '&type=' + this.data.type + '&id=' + this.data.id,
      data: {
        ...this.data.listParams,
      }
    }).then(res => {
      let listData = res.data.map(item => {
        if (item.type == 'RECHARGE') {
          item.info = '常规充值'
        } else if (item.type == 'EXPENSE') {
          item.info = '支付余额'
        } else if (item.type == "ADJUST") {
          item.info = '调整记录'
        }

        if (item.amount > 0) {
          item.amount = '+' + item.amount
        } else {
          item.amount = item.amount
        }
        item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:MM:SS')

        return item;
      })
      this.setData({
        listData: [...this.data.listData, ...listData]
      })
    })
  },

  /**
   * 日期筛选 
   */
  bindDateChange: function(e) {
    let value = e.detail.value
    let start = moment(value + '-01').startOf('month').format("YYYY-MM-DD"),
      end = moment(value + '-01').endOf('month').format("YYYY-MM-DD");
    this.setData({
      start,
      end,
      date: value,
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    })
    this.fetchSummary()
    this.fetchList()
  },

  fetchSummary: function() {
    fetch({
      url: '/customers/balance/summary?start=' + this.data.start + '&end=' + this.data.end + '&id=' + this.data.id,
    }).then(res => {
      this.setData({
        totalRecharge1: res.data.totalRecharge,
        totalBalancePaid: res.data.totalBalancePaid
      })
    })
  },
  /**
   * tab 切换
   */
  selSource: function(e) {
    let source = this.data.source;
    let value = e.currentTarget.dataset.value

    let select = source.map(item => {
      item.checked = false;
      if (item.value == value) {
        item.checked = true
      }
      return item;
    })

    this.setData({
      source: select,
      type: value,
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    })

    this.fetchList()
  },

  banlanceScrollLIst: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchList();
  }
})