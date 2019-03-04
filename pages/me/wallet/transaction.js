import fetch from '../../../lib/fetch.js'
import moment from '../../../lib/moment.js'
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["全部", "收入", "提现"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,

    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    filterParams: {
      type:''
    }

    
  },
  onLoad: function () {
    //tabs 导航初始化数据
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    this.fetchTransactionList();

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    switch( Number(e.currentTarget.id) ){
      case 0: 
        this.setData({
          filterParams: {...this.data.filterParams,type:''}
        });
        break;
      case 1: 
        this.setData({
          filterParams: { ...this.data.filterParams, type: 'TRANSFER'}
        });
        break;
      case 2: 
        this.setData({
          filterParams: { ...this.data.filterParams, type: 'WITHDRAW' }
        });
        break;
      default:
        break;
    }
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    });
    this.fetchTransactionList();

  },

  

  /**
   * 获取交易记录订单列表
   */

  fetchTransactionList: function () {
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
      url: '/transactions',
      data: {
        ...this.data.listParams,
        ...this.data.filterParams
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        res.data = res.data.map(item => {
          item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm');
          item.gatwayType == 'wx' ? item.gatwayType = '微信' : item.gatwayType = '支付宝';
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

  
});