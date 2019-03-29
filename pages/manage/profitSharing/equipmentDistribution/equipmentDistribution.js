// pages/manage/equipmentDistribution/equipmentDistribution.js

import fetch from '../../../../lib/fetch.js';
import moment from '../../../../lib/moment.min.js';



Page({

  /**
   * 页面的初始数据
   */
  data: {


    userScreenHeight: '',

    showFilterMenue: false,
    listLoading: false,
    listEnd: false,
    listData: [],

    listParams: {
      from: 0,
      size: 10
    },


    number: '',
    fieldData: [],
    fieldIndex: 0,
    typeData: [],
    typeIndex: 0,
    groupData: [],
    groupIndex: 0,


    locationId: '',
    typeId: '',
    groupId: '',


    systemInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })

    let query = wx.createSelectorQuery()
    query.select('#userScreen').boundingClientRect(rect => {
      this.setData({
        userScreenHeight: rect.height + 'px'
      })
    }).exec();


    this.fetchSel()


  },
  onShow: function() {
    this.setData({
      listData: [],
      listParams: {
        from: 0,
        size: 10
      }
    })
    this.fetchDistribution()
  },


  /**
   * 获取筛选的select 选择
   */

  fetchSel: function() {
    fetch({
      url: '/locations/select',
      method: 'GET',
    }).then(res => {
      res.data.unshift({
        id: "",
        province:'',
        city:'',
        district:'',
        name: '全部',
      });

      let fieldData = res.data.map(item => {
        item.name = item.province + item.city + item.district + item.name
        return item;
      })
      this.setData({
        fieldData
      })
    })

    fetch({
      url: '/devices/types',
      method: 'GET',
    }).then(res => {
      res.data.unshift({
        id: "",
        name: '全部'
      });
      this.setData({
        typeData: res.data
      })
    })


    fetch({
      url: '/deviceGroups/select',
      method: 'GET',
    }).then(res => {
      res.data.unshift({
        id: "",
        name: '全部'
      });

      this.setData({
        groupData: res.data
      })
    })
  },

  /**
   *  获取列表数据 
   */
  fetchDistribution: function() {
    this.setData({
      listLoading: true
    })
    fetch({
      url: '/deviceRoyalties',
      method: 'GET',
      data: {
        ...this.data.listParams,
        locationId: this.data.locationId,
        typeId: this.data.typeId,
        groupId: this.data.groupId,
        query: this.data.number
      }
    }).then(res => {
      this.setData({
        listData: [...this.data.listData, ...res.data],
        listLoading: false
      })
    })

  },






  /**
   * 设备编号
   */
  equipmentNumber: function(e) {
    this.setData({
      number: e.detail.value
    })
  },

  /**
   * 场地
   */
  bindFieldChange: function(e) {
    this.setData({
      fieldIndex: e.detail.value
    })
  },

  /**
   * 类型
   */
  bindTypeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      typeIndex: e.detail.value
    })
  },


  /**
   * 分组
   */
  bindGroupChange: function(e) {
    this.setData({
      groupIndex: e.detail.value
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
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    let itemList;
    let enabled = e.currentTarget.dataset.enabled;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑', '生效', '取消'];
    } else {
      itemList = ['编辑', '生效'];
    }

    if (enabled) {
      itemList[1] = '失效'
    } else {
      itemList[1] = '生效'
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './setUp/setUp?field=edit&id=' + id,
              })
              break;
            case 1:
              if (enabled) {
                this.disableManagement(id)

              } else {
                this.enableManagement(id)
              }
              break;
            default:
              break;
          }
        }
      }
    })
  },



  /**
   * 失效 
   */
  disableManagement: function(id) {
    fetch({
        url: '/deviceRoyalties/disable?id=' + id,
        method: 'post',
        data: {
          id
        }
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enabled = false
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
   * 生效
   */
  enableManagement: function(id) {
    fetch({
        url: '/deviceRoyalties/enable?id=' + id,
        data: {
          id
        },
        method: 'post'
      })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enabled = true
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
   * 确定筛选
   */
  onSubmit: function() {
    this.setData({
      ...this.data.listParams,
      locationId: this.data.fieldData[this.data.fieldIndex].id,
      typeId: this.data.typeData[this.data.typeIndex].id,
      groupId: this.data.groupData[this.data.groupIndex].id,
      query: this.data.number,
      showFilterMenue: false,
      listData: []
    })
    this.fetchDistribution();
  },


  /**
   * 重置
   */
  resetPopData: function() {
    this.setData({
      fieldIndex: 0,
      typeIndex: 0,
      groupIndex: 0,
      locationId: '',
      typeId: '',
      groupId: '',
      query: '',
      number: '',
      listData: []
    })
    this.fetchDistribution();

  },





  userScrollLIst: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })
    this.fetchDistribution();
  }
})