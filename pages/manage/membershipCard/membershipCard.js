// pages/manage/membershipCard/membershipCard.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    systemInfo: {},
    enabled: false
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
      }
    })
    this.initData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    this.setData({
      list: []
    })
    this.fetchCard()
  },
  initData: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
    })
  },

  fetchCard: function() {



    fetch({
      url: '/vipCards',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {

      if (res.data.length < this.data.listParams.size) {
        //return 
      }

      let list = res.data.map(item => {
        if (item.permanent) {
          item.Days = '永久有效'
        } else {
          item.Days = item.validDays + '天有效'
        }

        if (!item.enabled) {
          item.enabled = false;
        }
        return item
      })
      this.setData({
        list: [...this.data.list, ...res.data]
      })
    })
  },
  listScroll: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    })

    this.fetchCard()
  },
  /**
   * 操作菜单
   */
  listActionSheet: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let itemList, field;
    let enabled = e.currentTarget.dataset.enabled;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['查看', '查看成员', '失效', '删除', '取消'];
    } else {
      itemList = ['查看', '查看成员', '失效', '删除'];
    }

    if (!enabled) {
      itemList.splice(2, 1)
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        switch (res.tapIndex) {
          case 0:
            if (!enabled) {
              field = 'view'
            } else {
              field = 'edit'
            }
            wx.navigateTo({
              url: 'newMembershipCard/newMembershipCard?id=' + id + '&field=view',
            })
            break
          case 1:
            wx.navigateTo({
              url: '../userManagement/userManagement',
            })
            break
          case 2:
            if (itemList[2] == '删除') {
              wx.showModal({
                content: '是否删除该会员卡?',
                success(res) {
                  if (res.confirm) {
                    that.delPlace(id);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              this.cardInvalid(id)
            }

            break
          case 3:

            if (itemList[3] == '删除') {
              wx.showModal({
                content: '是否删除该会员卡?',
                success(res) {
                  if (res.confirm) {
                    that.delPlace(id);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            break
        }
      }
    })
  },

  /**
   * 失效
   */
  cardInvalid: function(id) {
    fetch({
      url: '/vipCards/disable?id=' + id,
      isShowLoading: true,
      data: {
        id
      },
      method: 'post'
    }).then(res => {
      let listData = this.data.list.map(item => {
        if (item.id == id) {
          item.enabled = false
        }
        return item;
      })
      console.log(listData)
      this.setData({
        list: listData
      });
    })
  },

  /**
   * 删除
   */
  delPlace: function(id) {
    fetch({
        url: '/vipCards?id=' + id,
        isShowLoading: true,
        method: 'delete'
      })
      .then(res => {
        let listData = [];
        this.data.list.map(item => {
          if (item.id != id) {
            listData.push(item)
          }
        });
        this.setData({
          list: listData
        })
      })
      .catch(err => {
        console.error(err);
      })

  },


  /**
   * 新增会员卡
   */
  newMembershipCard: function() {
    wx.navigateTo({
      url: 'newMembershipCard/newMembershipCard?field=add'
    })
  }
})