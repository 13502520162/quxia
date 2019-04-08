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

    deviceTypeData: {

    },

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
    },

    placesData: [],
    placesDataIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if ((options.params)) {
      let params = JSON.parse(options.params);
      this.setData({
        deviceTypeData: {
          id: params.id,
          name: params.name,
          deviceNum: params.devicenum
        }
      })
      this.initDate(params.startDate, params.endDate);
    }
    this.fetchGroups();
    this.fetchPlaces();
  },

  /**
 * 获取所有的场地
 */
  fetchPlaces: function () {
    fetch({
      url: '/locations/select'
    })
      .then(res => {
        res.data.unshift({ id: "", name: '全部' });
        this.setData({
          placesData: res.data
        })
      })
  },

  /**
   * 初始化日期
   */
  initDate: function (startDate = moment().format('YYYY/MM/DD'), endDate = moment().format('YYYY/MM/DD')) {
    this.setData({
      date: {
        start: startDate,
        end: endDate
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

  fetchSummaryData(start, end) {
    return new Promise((resolve, reject) => {
      fetch({
        url: '/analytics/location/detail/summary',
        isShowLoading: true,
        data: {
          id: this.data.deviceTypeData.id,
          start: start,
          end: end
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
      url: '/deviceAnalytics/devices',
      data: {
        typeId: this.data.deviceTypeData.id,
        ...this.data.listParams,
        ...this.data.filterParams,
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
    let params = { ...e.currentTarget.dataset };
    params.startData = this.data.date.start.replace(/\//g, '-');
    params.endData = this.data.date.end.replace(/\//g, '-');

    wx.navigateTo({
      url: './deviceDetails?params=' + JSON.stringify(params),
    })
  },

  /**
 * 筛选抽屉切换
 */
  toggleFilterMenue: function () {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },

  /**
   * 获取所有分组
   */
  fetchGroups: function () {
    fetch({
      url: '/deviceGroups/select'
    })
      .then(res => {
        res.data.unshift({ id: "", name: "全部", selected: true })
        this.setData({
          groupsData: res.data
        })
      })
  },

  /**
   * 场地筛选
   */

  onFilterPlaceChange: function(e) {
    this.setData({
      placesDataIndex: e.detail.value,
      filterParams: { ...this.data.filterParams, locationId: this.data.placesData[e.detail.value].id }
    })
  },

  /**
   * 选项分组
   */
  onselectGroup: function (e) {
    let groupsData = this.data.groupsData.map(item => {
      item.selected = false;
      if (item.id == e.target.dataset.id) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams, groupId: item.id }
        })
      }
      return item;
    })
    this.setData({
      groupsData: groupsData
    })
  },

  onSubmit: function () {
    this.setData({
      listEnd: false,
      showFilterMenue: false,
      listData: [],
       listParams: {
        from: 0,
        size: 20
      },
      
    }, () => {
      this.fetchReportData();
    })
  },

  /**
   * 重置弹框的数据
   */
  resetPopData: function () {
    this.setData({
      filterParams: {
        groupId: '',
        query: ''
      }
    })
    this.onselectGroup({ target: { dataset: { id: "" } } });
    this.onFilterPlaceChange({ detail: { value: 0 } })
  },

  /**
   * 设备编号输入
   */
  onDeviceIdChange: function (e) {
    this.setData({
      filterParams: { ...this.data.filterParams, query: e.detail.value }
    })
  },

})