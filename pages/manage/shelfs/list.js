import fetch from '../../../lib/fetch.js'
import getStorePermissions from '../../../utils/getStorePremissioin.js';
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
    systemInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  permissionFilter: function () {
    let permissions = getStorePermissions();
    //列表
    if (permissions.includes(28)) {
      this.setData({
        disList: false
      })
    }
    //添加
    if (permissions.includes(29)) {
      this.setData({
        disAdd: false
      })
    }
    //编辑
    if (permissions.includes(30)) {
      this.setData({
        disEdit: false
      })
    }
  },

  onShow: function (){
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
    this.fetchCommodityList();
  },

  /**
   * 搜索框事件 
   */
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
  },


  /**
   * 获取货道列表
   */

  fetchCommodityList: function () {

    if(this.data.disList){
      return;
    }

    if (this.data.listLoading ) {
      return;
    }

    if (this.data.listEnd){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/shelfs',
      data: {
        ...this.data.listParams,
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
 * 列表触底加更多列表数据
 */
  loadMoreListData: function () {
    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchCommodityList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    let enable = e.currentTarget.dataset.enbale;
    let itemList = [];
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['方案上架', '编辑方案', '删除', '取消'];
    } else {
      itemList = ['方案上架', '编辑方案', '删除'];
    }
    if(this.data.disEdit){
      itemList.splice(1,2);
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './putaway?id=' + id,
              })
              break;
            case 1:
              if(!this.data.disEdit){
                wx.navigateTo({
                  url: './details?type=edit&id=' + id,
                })
              }
              break;
            case 2:
              if( !this.data.disEdit ){
                this.delShelfs(id);
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
   * 启用账号
   */
  enableAccount: function (id) {
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
  disableAccount: function (id) {
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
  delShelfs: function (id) {
    fetch({
      url: '/shelfs?id='+id,
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
  onAddShelfs: function () {
    wx.navigateTo({
      url: './details',
    })
  },




})