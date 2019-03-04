// pages/manage/device/list/list.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    partnerId:'',
    isShowDialog: false,
    newCommissionRate: 0,
    dialogId: null,

    showFilterMenue: false,
    filterParams: {
      groupId: '',
      active: ''
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
    ]
  },

  toggleFilterMenue: function () {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },


/**
 * 切换显示更改分成比例的对话框
 */
  toggleDialog: function () {
    this.setData({
      isShowDialog: !this.data.isShowDialog
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     partnerId: options.id 
    },()=> {
      this.fetchDevices();
    })
    this.fetchPlaces();
    this.fetchGroups();
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
      url: '/partners/devices',
      data: {
        partnerId: this.data.partnerId,
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
  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    let comissionRate = e.currentTarget.dataset.comissionrate;
    wx.showActionSheet({
      itemList: ['修改分成', '取消设备合伙'],
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              this.alterCommissionRateHanle(id, comissionRate);
              break;
            case 1:
              this.fetchCancelRelationShip(id);
              break;
            default:
              break;
          }
        }
      }
    })
  },

  /**
   * 修改分成比例处理
   */
  alterCommissionRateHanle: function (deviceId, comissionRate) {
    this.toggleDialog();
    this.setData({
      dialogId: deviceId,
      newCommissionRate: comissionRate
    })
  },

  /**
   * 分成比例改变
   */
  onNewCommissionRateChange: function (e) {
    let comissionRate = Number(e.detail);
    if (comissionRate > 100  ){
      wx.showToast({
        title: '最大值为100',
        icon: 'none'
      })
    } else {
      this.setData({
        newCommissionRate: comissionRate
      })
    }
  },

  /**
   * 发请求更新分成比例
   */
  fetchUpdateCommissionRate: function () {
    fetch({
      url: '/partners/devices/updateCommissionRate',
      data: {
        partnerId: this.data.partnerId,
        deviceId: this.data.dialogId,
        commissionRate: this.data.newCommissionRate
      }
    })
    .then( res => {
      let listData = this.data.listData.map( item => {
        if( item.id == this.data.dialogId ){
          item.commissionRate = this.data.newCommissionRate
        }
        return item;
      })
      this.setData({
        dialogId: null,
        newCommissionRate: null,
        listData: [...listData],
      })
    })
    .catch( err => {
      console.error(err);
    })
  },


  /**
   * 对话框关闭
   */

  onDialogClose: function (e) {
    if (e.detail === 'cancel') {
      this.setData({
        newCommissionRate: '',
        dialogId: null
      })
    } else if (this.data.dialogId) {
      this.fetchUpdateCommissionRate();
    } 

    this.toggleDialog();
  },

  /**
   * 取消设备合伙关系
   */
  fetchCancelRelationShip: function(id) {
    fetch({
      url: '/partners/devices',
      method: 'delete',
      data: {
        id: id,
        partnerId: this.data.partnerId
      },
      isShowDialog: true
    })
    .then( res => {
      let listData = [];
      this.data.listData.map( item => {
        if( item.id != id ) {
          listData.push( item );
        }
      })
      this.setData({
        listData: listData
      })
    })
    .catch( err => {
      console.error( err );
    })
  },

  onAddDevices: function () {
    wx.navigateTo({
      url: './addDevices?partnerId=' + this.data.partnerId,
    })
  }


})