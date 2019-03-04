// pages/manage/device/list/list.js
import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo: {},
  },

  toggleFilterMenue: function () {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
  },



  onShow: function () {
    this.initData();
    this.fetchDevices();
    this.fetchPlaces();
    this.fetchDevicesSummary();
  },

  /**
   * 初始化数据
   */
  initData: function () {
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
      listLoading: false,
      listEnd: false,
      listData: [],

      placesData: [],
      placesDataIndex: 0,

      stockStatus: [
        { name: "全部", status: "",  selected: true },
        { name: "正常", status: "NORMAL", selected: false },
        { name: "缺货", status: "OUT_OF_STOCK", selected: false  }
      ],

      deviceStatus: [
        { name: '全部', status: '', selected: true },
        { name: '在线', status: true, selected: false },
        { name: '离线', status: false, selected: false }
      ]
    })
  },




  /**
 * 货道状态更改
 */
  onstockStatusChange: function (e) {
    let stockStatus = this.data.stockStatus.map(item => {
      item.selected = false;
      if (item.status === e.target.dataset.status) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams, stockState: e.target.dataset.status }
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

  fetchDevicesSummary: function () {
    fetch({
      url: '/shelfs/devices/summary',
      data: {
        ...this.data.filterParams
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

  fetchDevices: function () {

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
      url: '/shelfs/devices',
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
   * 场地更改
   */
  onFilterPlaceChange: function (e) {
    this.setData({
      placesDataIndex: e.detail.value,
      filterParams: { ...this.data.filterParams, locationId: this.data.placesData[e.detail.value].id }
    })
  },

  /**
   * 设备状态改变
   */
  onDeviceStatusChange: function (e) {
    let deviceStatus = this.data.deviceStatus.map(item => {
      item.selected = false;
      if (item.status === e.target.dataset.status) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.data.filterParams, active: e.target.dataset.status }
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
  onDeviceIdChange: function (e) {
    this.setData({
      filterParams: { ...this.data.filterParams, query: e.detail.value }
    })
  },

  onSubmit: function () {
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
  resetPopData: function () {
    this.setData({
      filterParams: {
        active: '',
        query: ''
      }
    })
    this.onstockStatusChange({ detail: { value: 0 } });
    this.onDeviceStatusChange({ target: { dataset: { status: "" } } });
    this.onFilterPlaceChange({ detail: { value: 0 } });
    this.onSubmit();
  },
  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchDevices();
    }
  },

  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    let { id, planid } = e.currentTarget.dataset;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['查看货道', '补货', '补货记录', '取消'];
    } else {
      itemList = ['查看货道', '补货', '补货记录'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './details?id=' + id + '&planid=' + planid,
              })
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
            default:
              break;
          }
        }
      }
    })
  }

})