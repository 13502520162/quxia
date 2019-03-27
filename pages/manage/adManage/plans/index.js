import fetch from '../../../../lib/fetch.js'
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      { name: '全部', value: '' }, 
      { name: '图片', value: 'IMAGE'},
      { name: '视频', value: 'VIDEO'}
      ],
    typesIndex: 0,
    inputShowed: false,
    inputVal: "",

    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    systemInfo: {},

    disEdit: true,
    disAdd: true,
    disList: true
  },

  onLoad: function () {
   
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
    this.permissionFilter();
  },

  /**
   * 权限过滤
   */
  permissionFilter: function () {
    let permissions = getStorePermissions();
    //列表
    if (permissions.permissions.includes(16)) {
      this.setData({
        disList: false
      })
    }
    //添加
    if (permissions.permissions.includes(17)) {
      this.setData({
        disAdd: false
      })
    }
    //编辑
    if (permissions.permissions.includes(18)) {
      this.setData({
        disEdit: false
      })
    }
  },

  onShow: function () {
      this.setData({
        listParams: {
          from: 0,
          size: 20
        },
        listLoading: false,
        listEnd: false,
        listData: [],
      })
      this.fetchPlanList();
  },



  /**
   * 类型选项改变
   */
  onFilterTypesChange: function (e) {
    this.setData({
      typesIndex: e.detail.value
    })
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    })
    this.fetchPlanList();
  },

  /**
   * 获取计划列表
   */

  fetchPlanList: function () {

    if (this.data.disList) {
      return;
    }

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
      url: '/ad/plans',
      data: {
        ...this.data.listParams,
        type: this.data.types[this.data.typesIndex].value,
        query: this.data.inputVal
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
 * 列表每一项操作
 */
  showActionSheet: function (e) {
    let { id, state } = e.currentTarget.dataset;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['发布', '查看', '删除', '取消'];
    } else {
      itemList = ['发布', '查看', '删除'];
    }

    if (state == 'PENDING' || state == 'PAUSED' ) {
      itemList[0] = "发布";
    } else if (state == 'PUBLISHED') {
      itemList[0] = "暂停"
    }
    if (this.data.disEdit) {
      itemList.splice(1, 2);
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              if (state == 'PENDING' || state == 'PAUSED'){
                this.fetchPublishPlan(id);
              } else if (state == 'PUBLISHED'){
                this.fetchUnPublishPlan(id);
              }
              break;
            case 1:
              if (!this.data.disEdit) {
                wx.navigateTo({
                  url: './details?id=' + id + '&state='+ state,
                })
              }
              break;
            case 2:
              if (!this.data.disEdit) {
                this.delPlan(id);
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
   * 发布计划
   */
  fetchPublishPlan: function (id) {
      fetch({
        url:"/ad/plans/publish?id="+id,
        method: 'post'
      })
      .then( res => {
        let listData = [];
        listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.state = 'PUBLISHED'
          }
          return item;
        });
        this.setData({
          listData: listData
        })
      })
      .catch(err =>{
        console.error(err);
      })
  },

  /**
   * 暂停计划
   */

  fetchUnPublishPlan: function (id) {
    fetch({
      url: "/ad/plans/pause?id=" + id,
      method: 'post'
    })
      .then(res => {
        let listData = [];
        listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.state = 'PAUSED'
          }
          return item;
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
   * 删除计划
   */
  delPlan: function (id) {
    fetch({
      url: '/ad/plans?id=' + id,
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
   * 加载更多
   */
  loadMoreListData: function () {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchPlanList();
    }
  },

  /**
   * 跳转到添加计划
   */
  onAddPlan: function () {
    wx.navigateTo({
      url: './details',
    })
  },

  /**
   * 搜索
   */
  searchInputConfirm: function () {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    }, () => {
      this.fetchPlanList();
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }

})