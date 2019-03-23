// pages/index/analysis.js
import moment from '../../../../../lib/moment.min.js';
import fetch from '../../../../../lib/fetch.js';
import {
  extendMoment
} from '../../../../../lib/moment-range.js';

const DateRange = extendMoment(moment);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listParams: {
      from: 0,
      size: 10
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    dateItem: {
      yesterday: false,
      today: true,
      week: false,
      month: false
    },
    date: {
      start: null,
      end: null
    },
    id: '',
    totalExpense: '',
    totalOrders: '',
    orders: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      id: options.id,
      totalExpense: options.totalExpense,
      totalOrders: options.totalOrders
    })

    this.initDate();
  },

  /**
   * 初始化日期
   */
  initDate: function() {
    this.setData({
      date: {
        start: moment().format('YYYY/MM/DD'),
        end: moment().format('YYYY/MM/DD')
      }
    }, () => {
      this.diffDurationData(1);
      this.fetchReportData();
    })
  },

  /**
   * date选项更改
   */
  selectDateItem: function(e) {
    let item = e.currentTarget.dataset.item;
    switch (item) {
      case 'today':
        this.setData({
          dateItem: {
            today: true,
            week: false,
            month: false
          },
          date: {
            start: moment().format('YYYY/MM/DD'),
            end: moment().format('YYYY/MM/DD')
          }
        }, () => {
          this.diffDurationData(1);
        });
        break;
      case 'week':
        this.setData({
          dateItem: {
            today: false,
            week: true,
            month: false
          },
          date: {
            start: moment().subtract(1, 'week').format('YYYY/MM/DD'),
            end: moment().format('YYYY/MM/DD')
          }
        }, () => {
          this.diffDurationData(7);
        })
        break;
      case 'month':
        this.setData({
          dateItem: {
            today: false,
            week: false,
            month: true
          },
          date: {
            start: moment().subtract(1, 'month').format('YYYY/MM/DD'),
            end: moment().format('YYYY/MM/DD')
          }
        }, () => {
          this.diffDurationData(30);
        })
        break;
    };
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchReportData();
  },

  fetchSummaryData(start, end) {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/customers/expense/summary',
          isShowLoading: true,
          data: {
            start: start,
            end: end,
            id: this.data.id
          }
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          console.error(err);
        })
    })

  },

  /**
   * 获取两个时间段的差值数据
   */
  diffDurationData: function(diffDays) {
    let startTime = moment(this.data.date.start.replace(/\//g, '-')).format('YYYY-MM-DD');
    let endTime = this.data.date.end.replace(/\//g, '-');
    this.fetchSummaryData(startTime, endTime).then(newData => {
      startTime = moment(startTime).subtract(diffDays === 1 ? 1 : diffDays, 'day').format('YYYY-MM-DD');
      endTime = moment(endTime).subtract(diffDays, 'day').format('YYYY-MM-DD');
      this.fetchSummaryData(startTime, endTime).then(oldData => {
        this.setData({
          expense: newData.expense,
          orders: newData.orders
        })
      })
    })
  },

  /**
   * 获取报表数据
   */
  fetchReportData: function() {
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
        url: '/customers/expense/audits',
        data: {
          ...this.data.listParams,
          start: this.data.date.start.replace(/\//g, '-'),
          end: this.data.date.end.replace(/\//g, '-'),
          id: this.data.id
        }
      })
      .then(res => {

        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        res.data = res.data.map(item => {
          item.day = moment(item.day).format('YYYY-MM-DD');
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

  loadMoreListData: function() {

    this.setData({
      listParams: { ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchReportData();

  },

  /**
   * 选择上一个日期的数据
   */

  lastData: function() {
    if (this.data.dateItem.today) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'days').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'days').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(1);
    } else if (this.data.dateItem.week) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'week').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'week').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(7);
    } else if (this.data.dateItem.month) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'month').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'month').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(30);
    }
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchReportData();
  },

  /**
   * 选择下一个日期的数据
   */
  nextData: function() {
    if (this.data.dateItem.today) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'days').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'days').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(1);
    } else if (this.data.dateItem.week) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'week').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'week').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(7);
    } else if (this.data.dateItem.month) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'month').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'month').format('YYYY/MM/DD')
        }
      });
      this.diffDurationData(30);
    }
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchReportData();

  },

  /**
   * 起始日期更改
   */
  onStartDateChange: function(e) {
    this.setData({
      dateItem: {
        yesterday: false,
        today: true,
        week: false,
        month: false
      },
      date: {
        ...this.data.date,
        start: e.detail.value.replace(/\-/g, '/')
      }
    });

    let diffDay = DateRange.range(e.detail.value, this.data.date.end.replace(/\//g, '-')).diff('days');
    this.diffDurationData(diffDay);

  },

  /**
   * 结束日期更改
   */
  onEndDateChange: function(e) {
    this.setData({
      dateItem: {
        yesterday: false,
        today: true,
        week: false,
        month: false
      },
      date: {
        ...this.data.date,
        end: e.detail.value.replace(/\-/g, '/')
      }
    });

    let diffDay = DateRange.range(this.data.date.start.replace(/\//g, '-'), e.detail.value).diff('days');
    this.diffDurationData(diffDay);
  }

})