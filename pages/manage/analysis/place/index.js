// pages/index/analysis.js
import moment from '../../../../lib/moment.min.js';
import fetch from '../../../../lib/fetch.js';
import { extendMoment } from '../../../../lib/moment-range.js';

const DateRange = extendMoment(moment);

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

    dateItem: {
      yesterday: false,
      today: true,
      week: false,
      month: false
    },
    date: {
      start: null,
      end: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate();
  },

  /**
   * 初始化日期
   */
  initDate: function () {
    this.setData({
      date: {
        start: moment().format('YYYY/MM/DD'),
        end: moment().format('YYYY/MM/DD')
      }
    }, () => {
      this.fetchReportData();
    })
  },

  /**
   * date选项更改
   */
  selectDateItem: function (e) {
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
        })
        break;
    };
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchReportData();
  },



  /**
   * 获取报表数据
   */
  fetchReportData: function () {
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
      url: '/locationAnalytics',
      data: {
        ...this.data.listParams,
        start: this.data.date.start.replace(/\//g, '-'),
        end: this.data.date.end.replace(/\//g, '-')
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        res.data = res.data.map(item => {
          item.date = moment(item.date).format('YYYY-MM-DD');
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

  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchReportData();
    }
  },

  /**
   * 选择上一个日期的数据
   */

  lastData: function () {
    if (this.data.dateItem.today) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'days').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'days').format('YYYY/MM/DD')
        }
      });
     
    } else if (this.data.dateItem.week) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'week').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'week').format('YYYY/MM/DD')
        }
      });
    } else if (this.data.dateItem.month) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'month').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'month').format('YYYY/MM/DD')
        }
      });
    }
    this.setData({
      listParams: {
        from: 0,
        size: 20
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
  nextData: function () {
    if (this.data.dateItem.today) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'days').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'days').format('YYYY/MM/DD')
        }
      });
    } else if (this.data.dateItem.week) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'week').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'week').format('YYYY/MM/DD')
        }
      });
    } else if (this.data.dateItem.month) {
      this.setData({
        date: {
          start: moment(this.data.date.start.replace(/\//g, '-')).add(1, 'month').format('YYYY/MM/DD'),
          end: moment(this.data.date.end.replace(/\//g, '-')).add(1, 'month').format('YYYY/MM/DD')
        }
      });
    }
    this.setData({
      listParams: {
        from: 0,
        size: 20
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
  onStartDateChange: function (e) {
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
  },

  /**
   * 结束日期更改
   */
  onEndDateChange: function (e) {
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
  },

  /**
   * 跳转分析详情
   */
  gotoDetail: function (e) {
    let params = {...e.currentTarget.dataset};
    params.startData = this.data.date.start.replace(/\//g,'-');
    params.endData = this.data.date.end.replace(/\//g, '-');
    wx.navigateTo({
      url: './detail?params=' + JSON.stringify(params) ,
    })
  }



})