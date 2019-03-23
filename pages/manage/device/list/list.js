// pages/manage/device/list/list.js
import fetch from '../../../../lib/fetch.js'
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo: {},
    typeId: '',
    disEdit: true,
    disList: true,
  },

  setTab: function(e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      deviceTypesIndex: edata.tabindex,
      typeId: edata.id,
      listData: []
    })

    this.fetchDevices()
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
    this.permissionFilter();
  },

  /**
   * 权限过滤
   */
  permissionFilter: function() {
    let permissions = getStorePermissions();
    //列表
    if (permissions.includes(8)) {
      this.setData({
        disList: false
      })
    }
    //编辑
    if (permissions.includes(10)) {
      this.setData({
        disEdit: false
      })
    }
  },


  onShow: function() {
    this.initData();
    this.fetchDeviceTypes();
    this.fetchPlaces();
    this.fetchGroups();
    this.fetchDevicesSummary();
  },
  onReady: function() {

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

      deviceTypesIndex: 0,
      deviceTypes: [],
      typeId: '',


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
   * 获取所有的设备类型
   */
  /**
   * 获取所有的设备类型
   */
  fetchDeviceTypes: function() {
    fetch({
        url: "/devices/types"
      })
      .then(res => {
        // res.data.unshift({
        //   id: "",
        //   name: '全部'
        // });
        this.setData({
          deviceTypes: res.data,
          typeId: this.data.typeId || res.data[0].id
        })
        this.fetchDevices();
      })
      .catch(err => {
        console.error(err);
      })
  },

  // /**
  //  * 设备类型更改
  //  */
  // onFilterDeviceTypeChange: function(e) {
  //   this.setData({
  //     deviceTypesIndex: e.detail.value,
  //     filterParams: { ...this.data.filterParams,
  //       typeId: this.data.deviceTypes[e.detail.value].id
  //     }
  //   })
  // },

  /**
   * 获取设备总数+在线数
   */

  fetchDevicesSummary: function() {
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

  fetchDevices: function() {
    let typeId = this.data.typeId
    if (this.data.disList) {
      return
    }

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
        url: '/devices',
        data: {
          ...this.data.listParams,
          ...this.data.filterParams,
          typeId
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
        groupId: '',
        active: '',
        query: ''
      }
    })
    this.onFilterDeviceTypeChange({
      detail: {
        value: 0
      }
    });
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
      this.fetchDevices();
    }
  },

  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let {
      id,
      typeid
    } = e.currentTarget.dataset;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['在线日志', '远程控制', '编辑设备', '取消'];
    } else {
      itemList = ['在线日志', '远程控制', '编辑设备'];
    }

    if (this.data.disEdit) {
      itemList.splice(2, 1);
    }
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './log?id=' + id,
              })
              break;
            case 1:
              wx.navigateTo({
                url: './controls?id=' + id + '&typeId=' + typeid,
              })
              break;
            case 2:
              if (!this.data.disEdit) {
                wx.navigateTo({
                  url: './details?id=' + id,
                })
              }
              break;
            default:
              break;
          }
        }
      }
    })
  }

})