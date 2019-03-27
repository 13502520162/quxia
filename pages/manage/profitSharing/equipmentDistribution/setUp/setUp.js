import fetch from '../../../../../lib/fetch.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    enabled: false, //分润是否启用的标识, 暂停时不可提交编辑数据
    typeIndex: 0,
    newOrUpdateParams: {
      users: []
    },



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

    if (options.id) {
      this.setData({
        id: options.id
      })
      if (options.enabled == 'true') {

        this.setData({
          enabled: true
        })
      }

      this.fetchDetail();
    }
  },

  onShow: function() {


    let users = this.data.newOrUpdateParams.users.map((item) => {
      if (item.id) {
        item.userId = item.id
        item.rate = parseInt(item.rate)
        item.userName = item.name
        delete item.id
        delete item.name
      }
      return item;
    })
    let newOrUpdateParams = {
      users
    }
    this.setData({
      newOrUpdateParams
    })
  },



  /**
   * 跳转分润对象
   */
  gotoSelectUser: function() {
    wx.navigateTo({
      url: '../../../royalty/selectUser',
    })
  },

  showActionSheet: function(e) {
    wx.navigateTo({
      url: '../../../royalty/selectUser?usersDataIndex=' + e.currentTarget.dataset.index,
    })
  },



  /**
   * 列表每一项操作
   */
  showActionSheet: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['编辑', '删除', '取消'];
    } else {
      itemList = ['编辑', '删除'];
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: '../../../royalty/selectUser?usersDataIndex=' + index,
              })
              break;
            case 1:
              wx.showModal({
                content: '是否删除该分润对象?',
                success(res) {
                  if (res.confirm) {
                    that.delPlace(id);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
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
  },

  /**
   * 删除分润对象
   */

  delPlace: function(id) {
    let users = this.data.newOrUpdateParams.users
    let newUsers = [];
    console.log(id)

    for (let i = 0; i < users.length; i++) {
      if (users[i].userId != id) {
        console.log(users[i])
        newUsers.push(users[i])
      }
    }

    this.setData({
      newOrUpdateParams: {
        users: newUsers
      }
    })
  },



  /**
   * 确定更新
   */
  onConfirm: function() {
    let newOrUpdateParams = this.data.newOrUpdateParams;
    console.log(newOrUpdateParams)
    if (newOrUpdateParams.users == undefined || !newOrUpdateParams.users.length) {
      wx.showToast({
        title: '请选择分润对象',
        icon: 'none'
      })
      return;
    }

    fetch({
        url: '/deviceRoyalties',
        method: 'POST',
        data: {
          id: this.data.id,
          items: newOrUpdateParams.users
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1500)
      })
  },

  fetchDetail: function() {
    fetch({
        url: '/deviceRoyalties/detail?id=' + this.data.id
      })
      .then(res => {
        this.setData({
          newOrUpdateParams: {
            users: res.data
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  }
})