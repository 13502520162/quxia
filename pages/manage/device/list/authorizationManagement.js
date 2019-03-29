// pages/manage/device/list/list.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    id: '',
    systemInfo: {},
    name: ''
  },


  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    });
    if (options.id) {
      this.setData({
        id: options.id,
        name: options.name
      }, () => {})
    }

  },
  onShow: function() {
    this.setData({
      listData: []
    })
    this.fetchList()
  },


  /**
   * 获取授权列表
   */

  fetchList: function() {

    fetch({
        url: '/devices/users',
        data: {
          deviceId: this.data.id
        }
      })
      .then(res => {
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

  preservation: function() {
    let users = []
    this.data.listData.map((item) => {
      users.push(item.id)
      return item
    })
    wx.navigateTo({
      url: './roleSelection?id=' + this.data.id + '&users=' + users,
    })
  },


  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function() {

    if (!this.data.listLoading) {
      this.setData({
        listParams: {
          ...this.data.listParams,
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
    let that = this
    let userId = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['删除', '取消'];
    } else {
      itemList = ['删除'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.showModal({
                content: '你确定删除该授权账号嘛?',
                success: res => {
                  if (res.errMsg === 'showModal:ok') {
                    fetch({
                      url: '/devices/users?deviceId=' + that.data.id + '&userId=' + userId,
                        method: 'delete',
                        data: {
                          deviceId: parseInt(that.data.id),
                          userId
                        }
                      })
                      .then(res => {
                        let listData = [];
                        that.data.listData.map(item => {
                          if (item.id != userId) {
                            listData.push(item)
                          }
                        });
                        that.setData({
                          listData: listData
                        })
                      })
                      .catch(err => {
                        console.error(err);
                      })
                      .finally(() => {

                      })
                  }
                }
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