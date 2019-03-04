// pages/manage/shareAd/putting/index.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     types: [
       { name: '全部', value: '' },
       { name: '待投放', value: 'WAITING' },
       { name: '投放中', value: 'RUNNING' },
       { name: '已暂停', value: 'PAUSED' },
       { name: '已结束', value: 'COMPLETED ' }
     ],
     typeIndex: 0,

    inputShowed: false,
    inputVal: "",

    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    systemInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
  },


  onShow: function () {
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
    this.fetchListData();
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
    this.searchHandle();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.searchHandle();
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

/**
 * 列表搜索
 */
  searchHandle: function () {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    }, () => {
      this.fetchListData();
    })
  },


  /**
   * 获取列表
   */

  fetchListData: function () {
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
      url: '/adpub/plans',
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
        res.data = res.data.map( item => {
           switch( item.state ){
             case 'WAITING':
               item.state = '待投放';
               break;
             case 'RUNNING':
               item.state = '投放中';
               break;
             case 'PAUSED':
               item.state = '已暂停';
               break;
             case 'COMPLETED':
              item.state = '已结束';
              break;
            default: 
              break;
           }
           return item;
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
 * 列表触底加更多列表数据
 */
  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchListData();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑','取消'];
    } else {
      itemList = ['编辑'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './details?type=edit&id=' + id,
              })
              break;
            // case 2:
            //     delAd(id);
            //   break;
            default:
              break;
          }
        }
      }
    })
  },

  /**
   * 删除广告投放
   */
  delAd: function (id){

  },

  /**
   * 跳转新增投放
   */
  onPuttingHandle: function(){
    wx.navigateTo({
      url: './details',
    })
  }



})