import fetch from '../../../lib/fetch.js'
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countData: 0,
    showFilterMenue: false,
    filterParams: {
      groupId: '',
      active: '',
      start: '',
      end: ''
    },

    listParams: {
      from: 0,
      size: 10
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    placesData: [],
    placesDataIndex: 0,
    deviceTypes: [],
    deviceTypesIndex: 0,
    groupsData: [],

    cargoStateIndex: 0,
    cargoState: [{
        id: '1',
        name: '销售订单'
      },
      {
        id: '2',
        name: '幸运免单'
      }
    ]

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    const {
      startDate,
      endDate,
      locationId,
      deviceId,
      cargoStateIndex
    } = options;
    if (startDate && endDate) {
      this.setData({
        filterParams: {
          ...this.data.filterParams,
          start: startDate,
          end: endDate
        }
      })
    }

    if (locationId) {
      this.setData({
        filterParams: {
          ...this.data.filterParams,
          locationId
        }
      })
    }

    if (deviceId) {
      this.setData({
        filterParams: {
          ...this.data.filterParams,
          deviceId
        }
      })
    }

    if (cargoStateIndex) {
      this.setData({
        cargoStateIndex: options.cargoStateIndex
      })
    }


    this.fetchDeviceTypes();
    this.fetchPlaces();
    this.fetchGroups();
  },

  onShow: function() {
    this.setData({
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    })
    let cargoStateIndex = this.data.cargoStateIndex
    if (cargoStateIndex == 0) {
      this.fetchSaleOrders();
      this.fetchSaleOrderCount()
    } else {
      this.fetchLuckyOrders();
      this.fetchLuckyOrderCount()
    }
  },



  setTab: function(e) {
    let index = e.detail.index
    this.setData({
      listData: [],
      listParams: {
        from: 0,
        size: 10
      },
      cargoStateIndex: e.detail.index
    })

    if (index == 0) {
      this.fetchSaleOrders();
      this.fetchSaleOrderCount()
    } else {
      this.fetchLuckyOrders();
      this.fetchLuckyOrderCount()
    }

  },

  toggleFilterMenue: function() {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue,
      filterParams: {
        ...this.data.filterParams,
        start: this.data.filterParams.start || '开始时间',
        end: this.data.filterParams.end || '结束时间'
      },
    })

    if (!this.data.showFilterMenue) {
      this.setData({
        filterParams: {
          ...this.data.filterParams,
          start: this.data.filterParams.start == '开始时间' ? '' : this.data.filterParams.start,
          end: this.data.filterParams.end == '结束时间' ? '' : this.data.filterParams.end,
        }
      })
    }
  },





  /**
   * 获取销售订单总数
   */

  fetchSaleOrderCount: function() {
    fetch({
        url: '/orders/count',
        data: {
          ...this.data.filterParams
        }
      })
      .then(res => {
        this.setData({
          countData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },



  /**
   * 获取销售订单列表
   */

  fetchSaleOrders: function() {
    if (this.data.listLoading) {
      return;
    }


    // if (this.data.listEnd) {
    //   return;
    // }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/orders',
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





  /**
   * 获取幸运免单列表
   */

  fetchLuckyOrders: function() {
    if (this.data.listLoading) {
      return;
    }


    // if (this.data.listEnd) {
    //   return;
    // }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/luckfree/orders',
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




  /**
   * 获取幸运免单总数
   */

  fetchLuckyOrderCount: function() {
    fetch({
        url: '/luckfree/orders/count',
        data: {
          ...this.data.filterParams
        }
      })
      .then(res => {
        this.setData({
          countData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 获取所有的设备类型
   */
  fetchDeviceTypes: function() {
    fetch({
        url: "/devices/types"
      })
      .then(res => {
        res.data.unshift({
          id: "",
          name: '全部'
        });
        this.setData({
          deviceTypes: res.data
        })
      })
      .catch(err => {
        console.error(err);
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
   * 获取所有分组
   */
  fetchGroups: function() {
    fetch({
        url: '/deviceGroups/select'
      })
      .then(res => {
        res.data.unshift({
          id: "",
          name: "全部",
          selected: true
        })
        this.setData({
          groupsData: res.data
        })
      })
  },

  /**
   * 选项分组
   */
  onselectGroup: function(e) {
    let groupsData = this.data.groupsData.map(item => {
      item.selected = false;
      if (item.id == e.target.dataset.id) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams,
            groupId: item.id
          }
        })
      }
      return item;
    })
    this.setData({
      groupsData: groupsData
    })
  },

  /**
   * 场地更改
   */
  onFilterPlaceChange: function(e) {
    this.setData({
      placesDataIndex: e.detail.value,
      filterParams: { ...this.data.filterParams,
        locationId: this.data.placesData[e.detail.value].id
      }
    })
  },

  /**
   * 设备类型更改
   */
  onFilterDeviceTypeChange: function(e) {
    this.setData({
      deviceTypesIndex: e.detail.value,
      filterParams: { ...this.data.filterParams,
        deviceTypeId: this.data.deviceTypes[e.detail.value].id
      }
    })
  },



  /**
   * 订单编号改变
   * query 对应订单编号
   */
  onDeviceIdChange: function(e) {
    this.setData({
      filterParams: { ...this.data.filterParams,
        query: e.detail.value
      }
    })
  },


  /**
   * 确定筛选
   */
  onSubmit: function() {
    this.setData({
      listEnd: false,
      showFilterMenue: false,
      listData: [],
      filterParams: {
        ...this.data.filterParams,
        start: this.data.filterParams.start == '开始时间' ? '' : this.data.filterParams.start,
        end: this.data.filterParams.end == '结束时间' ? '' : this.data.filterParams.end
      }
    }, () => {
      let index = this.data.cargoStateIndex;
      if (index == 0) {
        this.fetchSaleOrders();
        this.fetchSaleOrderCount()
      } else {
        this.fetchLuckyOrders();
        this.fetchLuckyOrderCount()
      }
    })
  },

  /**
   * 重置弹框的数据
   */
  resetPopData: function() {
    this.setData({
      filterParams: {
        groupId: '',
        query: '',
        locationId: '',
        deviceTypeId: ''
      }
    })
    this.onselectGroup({
      target: {
        dataset: {
          id: ""
        }
      }
    });
    this.onDeviceStatusChange({
      target: {
        dataset: {
          status: ""
        }
      }
    });
    this.onFilterPlaceChange({
      detail: {
        value: 0
      }
    })
  },

  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      if(this.data.cargoStateIndex===0){
        this.fetchSaleOrders();
      }else{
        this.fetchLuckyOrders()
      }
  
    }
  },

  /**
   * 跳转到订单详情
   */
  gotoOrderDetail: function(e) {
    wx.navigateTo({
      url: './detail?orderId=' + e.currentTarget.dataset.id + "&startDate=" + this.data.filterParams.start + "&endDate=" + this.data.filterParams.end + '&cargoStateIndex=' + this.data.cargoStateIndex,
    })
  },

  /**
   * 日期选择
   */

  onDateChange: function(e) {
    let type = e.currentTarget.dataset.type;
    let date = e.detail.value;
    if (type == "start") {
      this.setData({
        filterParams: { ...this.data.filterParams,
          start: date
        }
      })
    } else if (type == "end") {
      this.setData({
        filterParams: { ...this.data.filterParams,
          end: date
        }
      })
    }
  }

})