// pages/manage/device/list/list.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerId: null,
    showFilterMenue: false,
    filterParams: {
      groupId: '',
      active: ''
    },

    devicesSummary: {
      activeDevices: 0,
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
    groupsData: [],

    deviceStatus: [
      { name: '全部', status: '', selected: true },
      { name: '在线', status: 1, selected: false },
      { name: '离线', status: 0, selected: false }
    ],

    chooseDevices: []  //勾选的设备
  },

  toggleFilterMenue: function () {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      partnerId: options.partnerId
    })
    this.fetchDevices();
    this.fetchPlaces();
    this.fetchGroups();
    this.fetchDevicesSummary();
  },

  /**
   * 获取设备总数+在线数
   */

  fetchDevicesSummary: function () {
    fetch({
      url: '/devices/summary',
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
      url: '/devices',
      data: {
        ...this.data.listParams,
        ...this.filterParams
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
   * 选项分组
   */
  onselectGroup: function (e) {
    let groupsData = this.data.groupsData.map(item => {
      item.selected = false;
      if (item.id == e.target.dataset.id) {
        item.selected = true;
        this.setData({
          filterParams: { ...this.filterParams, groupId: item.id }
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
  onFilterPlaceChange: function (e) {
    this.setData({
      placesDataIndex: e.detail.value,
      filterParams: { ...this.filterParams, locationId: this.data.placesData[e.detail.value].id }
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
          filterParams: { ...this.filterParams, active: e.target.dataset.status }
        })
      }
      return item;
    })
    this.setData({
      deviceStatus: deviceStatus
    })
  },

  /**
   * 设备ID改变
   * query 对应设备id 
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
      listData: []
    }, () => {
      this.fetchDevices();
    })
  },

  /**
   * 重置弹框的数据
   */
  resetPopData: function () {
    this.setData({
      filterParams: {
        groupId: '',
        active: '',
        query: ''
      }
    })
    this.onselectGroup({ target: { dataset: { id: "" } } });
    this.onDeviceStatusChange({ target: { dataset: { status: "" } } });
    this.onFilterPlaceChange({ detail: { value: 0 } })
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

  checkboxChange: function (e) {
     this.setData({
       chooseDevices: e.detail.value
     })
    var checkboxItems = this.data.listData, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      listData: checkboxItems
    });
  },

  /**
   * 设置分成比例
   */
  onSetCommissionRate: function () {
    wx.navigateTo({
      url: './setCommissionRate?devices=' + JSON.stringify(this.data.chooseDevices) + "&partnerId=" + this.data.partnerId,
    })
  }

})