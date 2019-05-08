// pages/manage/device/list/list.js
import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';

const DEVICE_TYPES = {
  'quxia': {
    managePage: './details'
  },
  'quxia-vm': {
    managePage: '../bigVendingMachineShelfsStatus/details'
  }

};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo: {},
    typeId: '',
    cargoState: [],

    stateIndex: 0
  },

  toggleFilterMenue: function() {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },

  onLoad: function() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
    this.initData()
  },



  onShow: function() {
    this.setData({
      listData: [],
      listParams: {
        size: 20,
        from: 0
      }
    }, () => {
      this.fetchDevicesTpes()
      this.fetchPlaces();
    })

  },

  /**
   * 初始化数据
   */
  initData: function() {
    this.setData({
      showFilterMenue: false,
      filterParams: {
        groupId: '',
        active: ''
      },

      devicesSummary: {
        outOfStockDevices: 0,
        devices: 0
      },

      listParams: {
        from: 0,
        size: 20
      },
      scrollTop:-1,
      listLoading: false,
      showLoading: false,
      listEnd: false,
      listData: [],

      placesData: [],
      placesDataIndex: 0,

      stockStatus: [{
          name: "全部",
          status: "",
          selected: true
        },
        {
          name: "正常",
          status: "NORMAL",
          selected: false
        },
        {
          name: "缺货",
          status: "OUT_OF_STOCK",
          selected: false
        }
      ],

      deviceStatus: [{
          name: '全部',
          status: '',
          selected: true
        },
        {
          name: '在线',
          status: true,
          selected: false
        },
        {
          name: '离线',
          status: false,
          selected: false
        }
      ]
    })
  },


  /**
   * 组件事件
   */
  setTab: function(e) {
    let item = e.detail.item
    let index = e.detail.index
    this.setData({
      listData: [],
      stateIndex: index,
      typeId: e.detail.item.id,
      listParams: {
        from: 0,
        size: 20
      }
    })
    this.fetchDevices()
    this.fetchDevicesSummary()
  },

  fetchDevicesTpes: function() {
    fetch({
      url: '/devices/types'
    }).then(res => {
      this.setData({
        cargoState: res.data,
        typeId: this.data.typeId || res.data[0].id
      }, () => {
        this.fetchDevices();
        this.fetchDevicesSummary()
      })
    })
  },


  /**
   * 货道状态更改
   */
  onstockStatusChange: function(e) {
    let stockStatus = this.data.stockStatus.map(item => {
      item.selected = false;
      if (item.status === e.target.dataset.status) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams,
            stockState: e.target.dataset.status
          }
        })
      }
      return item;
    })
    this.setData({
      stockStatus: stockStatus
    })
  },

  /**
   * 获取设备总数+缺货
   */

  fetchDevicesSummary: function() {
    fetch({
        url: '/shelfs/devices/summary',
        data: {
          ...this.data.filterParams,
          typeId: this.data.typeId
        }
      })
      .then(res => {
        this.setData({
          devicesSummary: res.data
        })
      })
  },

  /**
   * 获取设备列表
   */

  fetchDevices: function() {

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
        url: '/shelfs/devices',
        data: {
          ...this.data.listParams,
          ...this.data.filterParams,
          typeId: this.data.typeId
        }
      })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }

        res.data.map((item) => {
          if (item.stockState == 'NORMAL') {
            item.info = '库存正常'
          } else {
            item.info = item.alertCount ? item.alertCount + '个货道缺货,' : "" + item.soldoutCount ? item.soldoutCount + '个货道售罄' : ""
          }

          return item
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
   * 设备状态改变
   */
  onDeviceStatusChange: function(e) {
    let deviceStatus = this.data.deviceStatus.map(item => {
      item.selected = false;
      if (item.status === e.target.dataset.status) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams,
            active: e.target.dataset.status
          }
        })
      }
      return item;
    })
    this.setData({
      deviceStatus: deviceStatus
    })
  },

  /**
   * 设备编号改变
   * query 对应设备编号
   */
  onDeviceIdChange: function(e) {
    this.setData({
      filterParams: { ...this.data.filterParams,
        query: e.detail.value
      }
    })
  },

  onSubmit: function() {
    this.setData({
      listEnd: false,
      showFilterMenue: false,
      listParams: {
        from: 0,
        size: 20
      },
      listData: []
    }, () => {
      this.fetchDevices();
      this.fetchDevicesSummary();
    })
  },

  /**
   * 重置弹框的数据
   */
  resetPopData: function() {
    this.setData({
      filterParams: {
        active: '',
        query: ''
      }
    })
    this.onstockStatusChange({
      detail: {
        value: 0
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
    });
    this.onSubmit();
  },
  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {
    if (!this.data.listLoading) {
      this.setData({
        listParams: {
          ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      this.fetchDevices();
    }
  },

  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let {
      id,
      planid
    } = e.currentTarget.dataset;
    let deviceTypeId = this.data.cargoState[this.data.stateIndex].id
    let index = this.data.stateIndex;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['查看货道', '补货', '补货记录', '同步', '取消'];
    } else {
      itemList = ['查看货道', '补货', '补货记录', '同步'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          this.setData({
            scrollTop: 0,
          })
          switch (res.tapIndex) {
            case 0:

              var type = DEVICE_TYPES[deviceTypeId];
              if (type) {
                wx.navigateTo({
                  url: type.managePage + '?id=' + id + '&planid=' + planid + '&deviceTypeId=' + deviceTypeId,
                })
              } else {
                console.log("deviceTypeId ", deviceTypeId, " is not valid!");
              }


              break;
            case 1:
              wx.navigateTo({
                url: '/pages/manage/replenish/replenish?sence=' + id
              })
              break;
            case 2:
              wx.navigateTo({
                url: '/pages/manage/replenishRecord/replenishRecord?id=' + id
              })
              break;
            case 3:
              this.synchronization(id)
              break;
            default:
              break;
          }
        }
      }
    })
  },

  synchronization: function(id) {
    fetch({
        url: '/quxia/vm/remote/sync?deviceId=' + id,
        method: "POST",
        data: {
          id
        }
      })
      .then(res => {
        wx.showToast({
          title: '同步成功',
          icon: 'none'
        })
      })
  }

})