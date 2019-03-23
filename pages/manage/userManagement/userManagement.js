// pages/index/analysis.js

import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/moment.min.js';



Page({

  /**
   * 页面的初始数据
   */
  data: {


    userScreenHeight: '',
    field: "expense",
    desc: true,

    showFilterMenue: false,
    isTop: true,
    isTop1: true,
    isTop2: true,
    isTop3: true,
    listLoading: false,
    listEnd: false,
    listData: [],

    listParams: {
      from: 0,
      size: 10
    },

    dateItem: {
      today: true,
      week: false,
      month: false,
      cumulative: false
    },



    screenItem: {
      consumption: true,
      balance: false,
      recharge: false,
      register: false
    },


    name: "",
    mobile: "",
    vipCards: [],
    cardId: '',

    sexArr: [{
      id: '',
      name: '全部',
      checked: true
    }, {
      id: 1,
      name: '男',
      checked: false
    }, {
      id: 2,
      name: '女',
      checked: false
    }, {
      id: 0,
      name: '未知',
      checked: false
    }],
    sex: '',
    joinDate: {
      joinDateStart: '',
      joinDateEnd: ''
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
        userScreenHeight: rect.height + 'px'
      })
    }).exec();


    this.setData({
      date: {
        start: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD')
      }
    })

    this.fetchUserData()
    this.fetchVipCards()
  },

  /**
   *  获取列表数据 
   */
  fetchUserData: function() {
    let joinDateStart = this.data.joinDate.joinDateStart,
      joinDateEnd = this.data.joinDate.joinDateEnd
    if (joinDateStart == '开始时间') {
      joinDateStart = ''
    }

    if (joinDateEnd == '结束时间') {
      joinDateEnd = ''
      if (joinDateStart != '开始时间') {
        joinDateEnd = joinDateStart
      }
    }
    fetch({
      url: '/customers',
      method: 'GET',
      data: {
        start: this.data.date.start,
        end: this.data.date.end,
        joinDateStart,
        joinDateEnd,
        ...this.data.listParams,
        field: this.data.field,
        desc: this.data.desc,
        name: this.data.name,
        mobile: this.data.mobile,
        cardId: this.data.cardId,
        sex: this.data.sex,
      }
    }).then(res => {
      let screenItem = this.data.screenItem

      res.data.map((item) => {
        if (screenItem.consumption) {
          item.info = '累计消费' + item.value + '元'
        } else if (screenItem.balance) {
          item.info = '余额' + item.value + '元'
        } else if (screenItem.recharge) {
          item.info = '累计充值' + item.value + '元'
        } else {
          item.info = '注册日期: ' + moment(item.value).format('YYYY-MM-DD')
        }
        return item;
      })

      this.setData({
        listData: [...this.data.listData, ...res.data]
      })
    })

  },
  /**
   *  获取会员等级
   */
  fetchVipCards: function() {
    fetch({
      url: '/vipCards/select'
    }).then(res => {

      let all = {
        id: null,
        name: '全部'
      }
      res.data.unshift(all);
      let select = res.data.map(item => {
        if (item.name == '全部') {
          item.checked = true
        } else {
          item.checked = false;
        }

        return item;
      })
      this.setData({
        vipCards: select
      })
    })
  },

  /**
   *  选择会员等级 
   */
  selectVip: function(e) {
    let vipCards = this.data.vipCards;
    let id = e.currentTarget.dataset.id

    let select = vipCards.map(item => {
      item.checked = false;
      if (item.id == id) {
        item.checked = true
      }
      return item;
    })

    this.setData({
      vipCards: select,
      cardId: id,
    })
  },


  /**
   *  选择性别
   */
  selectSex: function(e) {
    let sexArr = this.data.sexArr;
    let id = e.currentTarget.dataset.id


    let select = sexArr.map(item => {
      item.checked = false;
      if (item.id == id) {
        item.checked = true
      }
      return item;
    })

    this.setData({
      sexArr: select,
      sex: id,
    })
  },

  /**
   * 筛选的切换
   */
  toggleFilterMenue: function() {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue,
      joinDate: {
        joinDateStart: this.data.joinDate.joinDateStart || '开始时间',
        joinDateEnd: this.data.joinDate.joinDateEnd || '结束时间'
      },
      date: {
        start: this.data.date.start,
        end: this.data.date.end
      }
    })
  },

  /**
   * 姓名
   */
  paramesNmae: function(e) {
    this.setData({
      name: e.detail.value,
    })
  },

  /**
   * 手机
   */
  paramesMobile: function(e) {

    this.setData({
      mobile: e.detail.value,
    })
  },

  /**
   * 筛选开始时间
   */
  screenStartDateChange: function(e) {
    this.setData({
      date: {
        start: e.detail.value,
        end: this.data.date.end
      }
    })
  },


  /**
   * 筛选结束时间
   */
  srceenEndDateChange: function(e) {

    this.setData({
      date: {
        start: this.data.date.start,
        end: e.detail.value
      }
    })
  },


  /**
   * 注册开始时间
   */
  rigisterStartDateChange: function(e) {
    this.setData({
      joinDate: {
        joinDateStart: e.detail.value,
        joinDateEnd: this.data.joinDate.joinDateEnd,
      }
    })
  },


  /**
   * 注册结束时间
   */
  rigisterEndDateChange: function(e) {
    this.setData({
      joinDate: {
        joinDateStart: this.data.joinDate.joinDateStart,
        joinDateEnd: e.detail.value
      }
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

    let vipCards = this.data.vipCards.map(item => {
      item.checked = false;
      if (item.name == '全部') {
        item.checked = true;
      }
      return item;
    })

    this.setData({
      name: "",
      mobile: "",
      vipCards: vipCards,
      sexArr: [{
        id: null,
        name: '全部',
        checked: true
      }, {
        id: 1,
        name: '男',
        checked: false
      }, {
        id: 2,
        name: '女',
        checked: false
      }, {
        id: 0,
        name: '未知',
        checked: false
      }],
      joinDate: {
        joinDateStart: '开始时间',
        joinDateEnd: '结束时间'
      },

      date: {
        start: this.data.date.start,
        end: this.data.date.end
      }
    })


  },


  /**
   * 消费 余额 充值 注册选项更改
   */

  screenItem: function(e) {
    let item = e.currentTarget.dataset.item;
    switch (item) {
      case 'consumption':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            consumption: true,
            balance: false,
            recharge: false,
            register: false
          },
          field: "expense",
          desc: !this.data.isTop,
          isTop: !this.data.isTop
        });
        this.fetchUserData()
        break;
      case 'balance':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            consumption: false,
            balance: true,
            recharge: false,
            register: false
          },
          field: "balance",
          desc: !this.data.isTop1,
          isTop1: !this.data.isTop1
        });
        this.fetchUserData()
        break;
      case 'recharge':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            consumption: false,
            balance: false,
            recharge: true,
            register: false
          },
          field: "recharge",
          desc: !this.data.isTop2,
          isTop2: !this.data.isTop2
        });
        this.fetchUserData()
        break;
      case 'register':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          screenItem: {
            consumption: false,
            balance: false,
            recharge: false,
            register: true
          },
          field: "join",
          desc: !this.data.isTop3,
          isTop3: !this.data.isTop3
        });
        this.fetchUserData()
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
          joinDate: {
            joinDateStart: '',
            joinDateEnd: ''
          },
          dateItem: {
            today: true,
            week: false,
            month: false,
            cumulative: false
          },
          date: {
            start: moment().format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
          }
        });

        this.fetchUserData()
        break;
      case 'week':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          joinDate: {
            joinDateStart: '',
            joinDateEnd: ''
          },
          dateItem: {
            today: false,
            week: true,
            month: false,
            cumulative: false
          },
          date: {
            start: moment().format('YYYY-MM-DD'),
            end: moment().add(1, 'week').format('YYYY-MM-DD')
          }
        });

        this.fetchUserData()
        break;
      case 'month':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          joinDate: {
            joinDateStart: '',
            joinDateEnd: ''
          },
          dateItem: {
            today: false,
            week: false,
            month: true,
            cumulative: false
          },
          date: {
            start: moment().format('YYYY-MM-DD'),
            end: moment().add(1, 'month').format('YYYY-MM-DD')
          }
        });

        this.fetchUserData()
        break;
      case 'cumulative':
        this.setData({
          listData: [],
          listParams: {
            from: 0,
            size: 10
          },
          joinDate: {
            joinDateStart: '',
            joinDateEnd: ''
          },
          dateItem: {
            today: false,
            week: false,
            month: false,
            cumulative: true
          },
          date: {
            start: '',
            end: ''
          }
        });

        this.fetchUserData()
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
      listParams: { ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchUserData();
  }
})