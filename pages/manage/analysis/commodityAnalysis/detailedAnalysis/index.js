// pages/index/analysis.js

import fetch from '../../../../../lib/fetch.js';
import moment from '../../../../../lib/moment.min.js';



Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: '',
    userScreenHeight: '',

    product: {},

    summary: {},
    field: "units",
    desc: true,

    showFilterMenue: false,
    isTop: true,
    isTop1: true,
    isTop2: true,
    isTop3: true,
    listLoading: false,
    listEnd: false,
    listData: [],


    placesData: [],
    placesDataIndex: 0,


    trade: [],
    tradeIndex: 0,

    listParams: {
      from: 0,
      size: 10,
      locationId: '',
      categoryId: '',
      deviceId: '',
    },

    dateItem: {
      today: true,
      week: false,
      month: false
    },



    screenItem: {
      units: true,
      amount: false,
      profit: false,
      date: false
    },


    date: {
      start: null,
      end: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let query = wx.createSelectorQuery()
    query.select('#userScreen').boundingClientRect(rect => {
      this.setData({
        userScreenHeight: rect.height + 'px',
      })
    }).exec();

    if (options.id) {
      this.setData({
        id: options.id,
        date: {
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD')
        },
        product: JSON.parse(options.item)
      }, () => {
        this.fetchUserData()
        this.diffDurationData(1);
      })
    }
  },

  onShow: function() {
    this.fetchPlaces();
    this.fetchselect();
  },

  /**
   *  获取列表数据 
   */
  fetchUserData: function() {

    let start = this.data.date.start,
      end = this.data.date.end;


    fetch({
      url: '/productAnalytics/list',
      method: 'GET',
      data: {
        productId: this.data.id,
        start: this.data.date.start.replace(/\//g, '-'),
        end: this.data.date.end.replace(/\//g, '-'),
        ...this.data.listParams,
        field: this.data.field,
        desc: this.data.desc
      }
    }).then(res => {
      let screenItem = this.data.screenItem

      res.data.map((item) => {
        item.date = moment(item.date).format('YYYY-MM-DD')
        return item;
      })

      this.setData({
        listData: [...this.data.listData, ...res.data]
      })
    })

  },


  fetchSummaryData(start, end) {
    return new Promise((resolve, reject) => {
      fetch({
          url: '/productAnalytics/summary',
          isShowLoading: true,
          data: {
            productId: this.data.id,
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
   * 获取两个时间段的差值数据
   */
  diffDurationData: function(diffDays, start = new Date(), end = new Date()) {



    let startTime = moment(moment(start).valueOf()).subtract(diffDays === 1 ? 0 : diffDays, 'day').format('YYYY-MM-DD');
    let endTime = moment(moment(end).valueOf()).format('YYYY-MM-DD');


    this.fetchSummaryData(startTime, endTime).then(newData => {
      startTime = moment(start).subtract(diffDays === 1 ? 1 : diffDays * 2, 'day').format('YYYY-MM-DD');
      endTime = moment(end).subtract(diffDays, 'day').format('YYYY-MM-DD');


      this.fetchSummaryData(startTime, endTime).then(oldData => {
        this.setData({
          amount: newData.amount,
          diffamount: newData.amount - oldData.amount,
          units: newData.units,
          diffunits: newData.units - oldData.units,
          profit: newData.profit,
          diffprofit: newData.profit - oldData.profit,
          costPrice: oldData.costPrice
        })
      })
    })
  },






  /**
   * 获取所有的场地
   */
  fetchPlaces: function() {
    fetch({
        url: '/locations/select'
      })
      .then(res => {
        res.data.unshift({
          id: "",
          name: '全部'
        });
        this.setData({
          placesData: res.data
        })
      })
  },


  /**
   * 获取所有的商品分类
   */
  fetchselect: function() {
    fetch({
        url: '/categories/select'
      })
      .then(res => {
        res.data.unshift({
          id: '',
          name: '全部'
        })
        this.setData({
          trade: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 场地更改
   */
  onFilterPlaceChange: function(e) {
    this.setData({
      placesDataIndex: e.detail.value,
      listParams: {
        ...this.data.listParams,
        locationId: this.data.placesData[e.detail.value].id
      }
    })
  },


  /**
   * 商品分类更改
   */
  onFilterTradeChange: function(e) {
    this.setData({
      tradeIndex: e.detail.value,
      listParams: {
        ...this.data.listParams,
        categoryId: this.data.trade[e.detail.value].id
      }
    })
  },



  /**
   * 设备编号
   */

  onDeviceIdChange(e) {
    this.setData({
      listParams: {
        ...this.data.listParams,
        deviceId: e.detail.value
      }
    })

  },

  /**
   * 选择上一个日期的数据
   */

  lastData: function() {
    if (this.data.dateItem.today) {
      let start = moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'days').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'days').format('YYYY-MM-DD')
      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(1, start, end);
    } else if (this.data.dateItem.week) {
      let start = moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'week').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'week').format('YYYY-MM-DD')

      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(7, start, end);
    } else if (this.data.dateItem.month) {

      let start = moment(this.data.date.start.replace(/\//g, '-')).subtract(1, 'month').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).subtract(1, 'month').format('YYYY-MM-DD')

      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(30, start, end);
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
    this.fetchUserData();
  },

  /**
   * 选择下一个日期的数据
   */
  nextData: function() {
    if (this.data.dateItem.today) {
      let start = moment(this.data.date.start.replace(/\//g, '-')).add(1, 'days').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).add(1, 'days').format('YYYY-MM-DD')
      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(1, start, end);
    } else if (this.data.dateItem.week) {
      let start = moment(this.data.date.start.replace(/\//g, '-')).add(1, 'week').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).add(1, 'week').format('YYYY-MM-DD')

      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(7, start, end);
    } else if (this.data.dateItem.month) {
      let start = moment(this.data.date.start.replace(/\//g, '-')).add(1, 'month').format('YYYY-MM-DD')
      let end = moment(this.data.date.end.replace(/\//g, '-')).add(1, 'month').format('YYYY-MM-DD')

      this.setData({
        date: {
          start,
          end
        }
      });
      this.diffDurationData(30, start, end);
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
    this.fetchUserData();
  },



  /**
   * 筛选的切换
   */
  toggleFilterMenue: function() {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue,
    })
  },


  /**
   * 确定筛选
   */
  onSubmit: function() {
    this.setData({
      showFilterMenue: false,
      listData: [],
      listParams: {
        ...this.data.listParams,
        from: 0,
        size: 10
      }
    })
    this.fetchUserData();
  },


  /**
   * 重置
   */
  resetPopData: function() {

    this.setData({
      date: {
        start: this.data.date.start,
        end: this.data.date.end
      },
      listParams: {
        from: 0,
        size: 10,
        locationId: '',
        categoryId: '',
        deviceId: ''
      },
      tradeIndex: 0,
      placesDataIndex: 0,
    })


  },


  /**
   * 消费 余额 充值 注册选项更改
   */

  screenItem: function(e) {
    let item = e.currentTarget.dataset.item;
    switch (item) {
      case 'units':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            units: true,
            amount: false,
            profit: false,
            date: false
          },
          field: "units",
          desc: !this.data.isTop,
          isTop: !this.data.isTop
        });
        this.fetchUserData()
        break;
      case 'amount':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            units: false,
            amount: true,
            profit: false,
            date: false
          },
          field: "amount",
          desc: !this.data.isTop1,
          isTop1: !this.data.isTop1
        });
        this.fetchUserData();
        break;
      case 'profit':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            units: false,
            amount: false,
            profit: true,
            date: false
          },
          field: "profit",
          desc: !this.data.isTop2,
          isTop2: !this.data.isTop2
        });
        this.fetchUserData();
        break;
      case 'date':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            units: false,
            amount: false,
            profit: false,
            date: true
          },
          field: "date",
          desc: !this.data.isTop3,
          isTop3: !this.data.isTop3
        });
        this.fetchUserData();
        break;
    };


  },

  /**
   * date选项更改
   */
  selectDateItem: function(e) {
    let item = e.currentTarget.dataset.item;
    switch (item) {
      case 'today':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          dateItem: {
            today: true,
            week: false,
            month: false
          },
          date: {
            start: moment().format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
          }
        });

        this.fetchUserData();
        this.diffDurationData(1);
        break;
      case 'week':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          dateItem: {
            today: false,
            week: true,
            month: false
          },
          date: {
            start: moment().subtract(1, 'week').format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
          }
        });

        this.fetchUserData();
        this.diffDurationData(7);
        break;
      case 'month':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          dateItem: {
            today: false,
            week: false,
            month: true
          },
          date: {
            start: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
          }
        });

        this.fetchUserData();
        this.diffDurationData(30);
        break;
    };

  },
  /**
   * 用户信息查看
   */
  userInfo: function(e) {
    wx.navigateTo({
      url: './userView/userView?id=' + e.currentTarget.dataset.id
    })
  },

  userScrollLIst: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchUserData();
  }
})