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
    isTop: false,
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
      month: false
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
    sex: '',
    joinDate: {
      joinDateStart: null,
      joinDateEnd: null
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
      },
      joinDate: {
        joinDateStart: moment().format('YYYY-MM-DD'),
        joinDateEnd: moment().format('YYYY-MM-DD')
      },
    })

    this.fetchUserData()
    this.fetchVipCards()
  },

  /**
   *  获取列表数据 
   */
  fetchUserData: function() {
    fetch({
      url: '/customers',
      method: 'GET',
      data: {
        start: new Date(this.data.date.start).getTime(),
        end: new Date(this.data.date.end).getTime(),
        joinDateStart: new Date(this.data.joinDate.joinDateEnd).getTime(),
        joinDateEnd: new Date(this.data.joinDate.joinDateEnd).getTime(),
        ...this.data.listParams,
        field: this.data.field,
        desc: this.data.desc,
        name: this.data.name,
        mobile: this.data.mobile,
        cardId: this.data.cardId,
        sex: this.data.sex,
      }
    }).then(res => {
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
      showFilterMenue: !this.data.showFilterMenue
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
        end: e.detail.value
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
        joinDateEnd: e.detail.value
      }
    })
  },


  /**
   * 注册结束时间
   */
  rigisterEndDateChange: function(e) {
    this.setData({
      joinDate: {
        joinDateStart: this.data.joinDate.joinDateEnd,
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
      listData: []
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
        joinDateStart: moment().format('YYYY-MM-DD'),
        joinDateEnd: moment().format('YYYY-MM-DD')
      },

      date: {
        start: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD')
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
          dateItem: {
            today: true,
            week: false,
            month: false
          },
          date: {
            start: new Date(moment().format('YYYY-MM-DD')).getTime(),
            end: new Date(moment().format('YYYY-MM-DD')).getTime()
          }
        });

        this.fetchUserData()
        break;
      case 'week':
        this.setData({
          listData: [],
          dateItem: {
            today: false,
            week: true,
            month: false
          },
          date: {
            start: new Date(moment().format('YYYY-MM-DD')).getTime(),
            end: new Date(moment().add(1, 'week').format('YYYY-MM-DD')).getTime()
          }
        });

        this.fetchUserData()
        break;
      case 'month':
        this.setData({
          listData: [],
          dateItem: {
            today: false,
            week: false,
            month: true
          },
          date: {
            start: new Date(moment().format('YYYY-MM-DD')).getTime(),
            end: new Date(moment().add(1, 'month').format('YYYY-MM-DD')).getTime()
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