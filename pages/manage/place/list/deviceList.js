// pages/manage/device/list/list.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeId: '',
    systemInfo:{}
  },

  toggleFilterMenue: function() {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },

  onLoad: function (option) {
    this.setData({
      placeId: option.id 
    });
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
  },
  

  onShow: function() {
    this.initData();
    this.fetchDevices();
    this.fetchPlaces();
    this.fetchGroups();
    this.fetchDevicesSummary();
  },

  /**
   * 初始化数据
   */
  initData: function() {
    this.setData({
      showFilterMenue: false,
      filterParams: {
        locationId: this.data.placeId,
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
        { name: '在线', status: true, selected: false },
        { name: '离线', status: false, selected: false }
      ]
    })
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
    .then( res => {
       this.setData({
         devicesSummary: res.data
       })
    })
  },

  /**
   * 获取设备列表
   */

  fetchDevices: function () {

    if (this.data.listLoading){
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
        ...this.data.filterParams
      }
    })
    .then ( res => {
      if( res.data.length < this.data.listParams.size ){
        this.setData({
          listEnd: true
        })
      }
      this.setData({
        listData: [...this.data.listData, ...res.data]
      })
    })
    .catch( err => {
      console.error( err );
    })
    .finally(()=> {
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
    .then( res => {
      res.data.unshift({id:"",name:'全部'});
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
    .then( res => {
      res.data.unshift({ id: "", name: "全部", selected: true })
      this.setData({
        groupsData: res.data
      })
    })
  },

  /**
   * 选项分组
   */
  onselectGroup:function( e ) {
     let groupsData = this.data.groupsData.map( item => {
        item.selected = false;
        if( item.id == e.target.dataset.id ){
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

  /**
   * 场地更改
   */
  onFilterPlaceChange: function( e ) {
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
   * 设备ID改变
   * query 对应设备id 
   */
  onDeviceIdChange: function( e ) {
     this.setData({
       filterParams: { ...this.data.filterParams, query: e.detail.value }
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
      }
    },()=> {
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
         groupId: '',
         active: '',
         query:''
       }
     })
    this.onselectGroup({ target: { dataset:{id:""}}});
    this.onDeviceStatusChange({ target: { dataset: { status: "" } } });
    this.onFilterPlaceChange({detail:{ value: 0 }} )
  },
  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function () {
    
    if( !this.data.listLoading ) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size  }
      })
      this.fetchDevices();
    }
  },

  /**
   * 跳转投放设备
   */
  goToPutawayDevice: function() {
    wx.navigateTo({
      url: './selectDevices?id='+this.data.placeId,
    })
  },

  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑设备', '设备离场', '取消'];
    } else {
      itemList = ['编辑设备', '设备离场'];
    }
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './deviceDetails?id='+id,
              })
              break;
            case 1:
                this.offPlace(id);
              break;
            default:
              break;
          }
        }
      }
    })
  },

  /**
   * 设备离场
   */
  offPlace: function(deviceId) {
    fetch({
      url: '/locations/deleteDevice?locationId=' + this.data.placeId +'&deviceId='+deviceId,
      method: 'post',
    })
    .then( res => {
      let listData = [];
      this.data.listData.map(item => {
        if (item.id != deviceId) {
          listData.push(item)
        }
      });
      this.setData({
        listData: listData
      })
      this.fetchDevicesSummary();
    })
    .catch( err => {
      console.error(err);
    })
  }

})