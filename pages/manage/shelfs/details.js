import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    shelfs: {
      id: null,
      name: "",
      shelfCount: 0,
      shelfs: [],
      number: 0
    },
    systemInfo: {},

    isAll: 'notAll',
    commotidyData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        shelfs: { ...this.data.shelfs,
          id: options.id
        }
      })
      this.fetchShelfDetials(options.id)
    };
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })
  },

  onShow: function() {
    let isAll = this.data.isAll
    let shelfs = this.data.shelfs
    let commotidyData = this.data.commotidyData
    if (isAll == 'notAll') {
      this.setData({
        shelfs
      })
    } else {
      let newShelfs = []
      for (let i = 0; i < shelfs.shelfs.length; i++) {
        newShelfs.push(commotidyData)
      }
      this.setData({
        shelfs: {
          ...this.data.shelfs,
          shelfCount: newShelfs.length,
          shelfs: newShelfs,
          id: shelfs.id
        }
      })
    }
  },

  /**
   * 方案名称更改
   */
  onChangeShelfsName: function(e) {
    this.setData({
      shelfs: { ...this.data.shelfs,
        name: e.detail.value
      }
    })
  },


  /**
   * iptNum
   */
  iptNum: function(e) {
    let value = e.detail.value;
    let shelfs = this.data.shelfs.shelfs;
    shelfs = []
    if (value < 100) {
      for (let i = 0; i < value; i++) {
        shelfs.push({});
      }
      this.setData({
        shelfs: {
          ...this.data.shelfs,
          shelfCount: parseInt(e.detail.value),
          shelfs: shelfs
        }
      })
    }
  },

  /**
   * 添加货道数量
   */

  addBtn: function() {
    let num = this.data.shelfs.shelfCount;
    let shelfs = this.data.shelfs.shelfs;

    if (num < 100) {
      shelfs.push({});
      this.setData({
        shelfs: { ...this.data.shelfs,
          shelfCount: num + 1,
          shelfs: shelfs
        }
      })
    }
  },

  /**
   * 减少货道数量
   */

  reduceBtn: function() {
    let num = this.data.shelfs.shelfCount;
    if (num > 0) {
      let shelfs = this.data.shelfs.shelfs;
      shelfs.splice(shelfs.length - 1, 1);
      this.setData({
        shelfs: { ...this.data.shelfs,
          shelfCount: num - 1,
          shelfs: shelfs
        }
      })
    }
  },

  /**
   * 提交
   */

  submit: function() {



    if (!this.data.shelfs.name) {
      wx.showToast({
        title: '请输入方案名称',
        icon: 'none'
      });
      return;
    }

    if (this.data.shelfs.shelfs.length === 0) {
      wx.showToast({
        title: '请添加货道',
        icon: 'none'
      });
      return;
    }

    let shelfs = this.data.shelfs.shelfs

    for (let i = 0; i < shelfs.length; i++) {
      if (!shelfs[i].productId) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return;
      }


      if (!shelfs[i].number) {
        wx.showToast({
          title: '请填写货道号',
          icon: 'none'
        });
        return;
      }

      for (let j = i + 1; j < shelfs.length; j++) {
        if (shelfs[j].number == shelfs[i].number) {
          wx.showToast({
            title: '货道号重复，请重新填写',
            icon: 'none'
          });
          return;
        }
      }

    }


    let id = this.data.shelfs.id;
    fetch({
        url: id ? '/shelfs?id=' + id : '/shelfs',
        method: id ? 'put' : 'post',
        data: { ...this.data.shelfs
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
  },


  showActionSheet: function(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: './commotidyDetail?index=' + index + '&isAll=notAll',
    })


  },

  /**
   * 设置货道号
   */

  cargoNumber: function(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let currShelfs = item[index];
    currShelfs.number = parseInt(e.detail.value)
    this.setData({
      shelfs: {
        ...this.data.shelfs,
        shelfs: item,
        shelfCount: item.length
      }
    })
  },


  /**
   * 批量设置
   */
  batchSetup: function(e) {
    let shelfs = this.data.shelfs.shelfs
    if (shelfs.length) {
      wx.navigateTo({
        url: './commotidyDetail?isAll=all'
      })
    } else {
      wx.showToast({
        title: '请添加货道数量',
        icon: 'none'
      });
      return;
    }


  },

  /**
   * 获取方案详情
   */
  fetchShelfDetials: function(id) {
    fetch({
        url: '/shelfs/detail',
        data: {
          id: id
        }
      })
      .then(res => {
        this.setData({
          shelfs: { ...this.data.shelfs,
            ...res.data
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  }


})