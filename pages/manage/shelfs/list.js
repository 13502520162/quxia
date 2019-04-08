import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
import ActionSheet from '../../../utils/actionSheet.js';

const app = getApp();

const DEVICE_TYPES = {
  'quxia' : {
      managePage : './details'
  },
  'quxia-vm': {
      managePage : '../bigVendingMachineShelfs/details'
  }

};

const ACTIONS =  [
    {
        name : '方案上架',
        click : function(id){
            wx.navigateTo({
                url: './putaway?id=' + id,
            });
        }
    },
    {
        name : '编辑方案',
        click : function(id,deviceTypeId){
            var type = DEVICE_TYPES[deviceTypeId];
            if(type){
                wx.navigateTo({
                    url: type.managePage + '?type=edit&id=' + id + '&deviceTypeId=' + deviceTypeId,
                })
            }else{
                console.log("deviceTypeId ", deviceTypeId, " is not valid!");
            }
        },
        test : function(){
            return !this.data.disEdit;
        }
    },
    {
        name : '删除',
        click : function(id){
            let self = this;
            wx.showModal({
                content: '是否删除该方案?',
                success(res) {
                    if (res.confirm) {
                        self.delShelfs(id);
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })

        },
        test : function(){
            return !this.data.disEdit;
        }
    }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",

    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    disEdit: true,
    disAdd: true,
    disList: true,
    systemInfo: {},
    deviceTypeId: '',


    cargoStateIndex: 0,
    cargoState: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.permissionFilter();
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
  },


  /**
   * 权限过滤
   */
  permissionFilter: function() {
    let permissions = getStorePermissions();

    if (app.hasPermission()) {
      this.setData({
        disList: false,
        disAdd: false,
        disEdit: false
      })
    } else {
      //列表
      if (permissions.permissions.includes(28)) {
        this.setData({
          disList: false
        })
      }
      //添加
      if (permissions.permissions.includes(29)) {
        this.setData({
          disAdd: false
        })
      }
      //编辑
      if (permissions.permissions.includes(30)) {
        this.setData({
          disEdit: false
        })
      }
    }

  },

  onShow: function() {
    this.setData({
      inputShowed: false,
      inputVal: "",

      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchDevicesTpes()
  },


  /**
   * 组件中的点击事件
   */
  setTab: function(e) {
    this.setData({
      cargoStateIndex: e.detail.index,
      deviceTypeId: e.detail.item.id,
      listData: [],
      listParams: {
        from: 0,
        size: 20
      }
    })

    this.fetchCommodityList()
  },



  /**
   * 搜索框事件
   */
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },


  fetchDevicesTpes: function() {
    fetch({
      url: '/devices/types'
    }).then(res => {
      this.setData({
        cargoState: res.data,
        deviceTypeId: this.data.deviceTypeId || res.data[0].id
      }, () => {
        this.fetchCommodityList();
      })
    })
  },


  /**
   * 确定搜索
   */

  fetchconfirmList: function(e) {

    this.setData({
      listData: [],
      listParams: {
        from: 0,
        size: 20
      },
    }, () => {
      this.fetchCommodityList()
    })
  },


  /**
   * 获取货道列表
   */

  fetchCommodityList: function() {

    if (this.data.disList) {
      return;
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

    let iptVal = this.data.inputVal

    fetch({
        url: '/shelfs',
        data: {
          ...this.data.listParams,
          query: iptVal,
          deviceTypeId: this.data.deviceTypeId
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
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      this.fetchCommodityList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let deviceTypeId = this.data.deviceTypeId;
      ActionSheet.show(ACTIONS,this, id,deviceTypeId);


  },

  /**
   * 启用账号
   */
  enableAccount: function(id) {
    fetch({
        url: '/partners/enable',
        method: 'post',
        data: {
          id: id
        }
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enable = true
          }
          return item;
        })
        this.setData({
          listData: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 禁用账号
   */
  disableAccount: function(id) {
    fetch({
        url: '/partners/disable',
        method: 'post',
        data: {
          id: id
        }
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enable = false
          }
          return item;
        })
        this.setData({
          listData: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 删除
   */
  delShelfs: function(id) {
    fetch({
        url: '/shelfs?id=' + id,
        method: 'delete'
      })
      .then(res => {
        let listData = [];
        this.data.listData.map(item => {
          if (item.id != id) {
            listData.push(item)
          }
        });
        this.setData({
          listData: listData
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 跳转到方案详情
   */
  onAddShelfs: function() {
    let deviceTypeId = this.data.deviceTypeId
    let cargoStateIndex = this.data.cargoStateIndex

    if (cargoStateIndex === 0) {
      wx.navigateTo({
        url: './details?&deviceTypeId=' + deviceTypeId,
      })
    } else if (cargoStateIndex === 1) {
      wx.navigateTo({
        url: '../bigVendingMachineShelfs/details?deviceTypeId=' + deviceTypeId,
      })
    }
  },




})