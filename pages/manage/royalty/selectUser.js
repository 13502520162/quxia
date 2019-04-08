// pages/manage/royalty/user.js
import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usersDataIndex: null,
    usersData: [],
    userIndex: 0,
    rate: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.usersDataIndex) {
      let pages = getCurrentPages();
      let prepage = pages[pages.length - 2];
      let newOrUpdateParams = prepage.data.newOrUpdateParams;

      this.setData({
        usersDataIndex: options.usersDataIndex,
        userIndex: options.usersDataIndex,
        rate: newOrUpdateParams.users[options.usersDataIndex].rate,
        userId: newOrUpdateParams.users[options.usersDataIndex].userId
      })
    }
    this.fetchUsers();
  },

  /**
   * 更改子账号选择
   */
  bindUserChange: function(e) {
    this.setData({
      userIndex: e.detail.value
    })
  },

  /**
   * 获取子账号列表
   */
  fetchUsers: function() {
    fetch({
        url: '/accounts/select'
      })
      .then(res => {
        this.setData({
          usersData: res.data
        });

        if (res.data && Array.isArray(res.data)) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == this.data.userId) {
              this.setData({
                userIndex: i
              });
              break;
            }
          }
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 分润管理
   */
  onRateChange: function(e) {
    let rate = e.detail.value ;
    if (rate > 100) {
      wx.showToast({
        title: '分成不能大于100',
        icon: 'none'
      })
      return;
    }
    this.setData({
      rate: rate
    })
  },

  /**
   * 确定
   */
  onConfirm: function() {
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];
    let newOrUpdateParams = prepage.data.newOrUpdateParams;
  
    // if (newOrUpdateParams.users == undefined ||JSON.stringify(newOrUpdateParams.users=='{}')) {
    //   newOrUpdateParams.users = []
    //   console.log(newOrUpdateParams)
    // }

    if (this.data.usersDataIndex == null) {
 
      for (let i = 0; i < newOrUpdateParams.users.length; i++) {
      
        if (newOrUpdateParams.users[i].userId == this.data.usersData[this.data.userIndex].id) {
          wx.showToast({
            title: '子账号不能相同,请重新选择',
            icon: 'none'
          })
          return;
        }
      }
    }


    if (this.data.rate == '') {
      wx.showToast({
        title: '分成比列不能为空',
        icon: 'none'
      })
      return;
    }

    if (this.data.usersDataIndex) {
      newOrUpdateParams.users[this.data.usersDataIndex] = {
        id: this.data.usersData[this.data.userIndex].id,
        rate: this.data.rate,
        name: this.data.usersData[this.data.userIndex].name
      }
    } else {
      newOrUpdateParams.users.push({
        id: this.data.usersData[this.data.userIndex].id,
        rate: this.data.rate,
        name: this.data.usersData[this.data.userIndex].name
      });
      prepage.setData({
        newOrUpdateParams: newOrUpdateParams
      })
    }

    wx.navigateBack({
      detal: 1
    })
  }
})