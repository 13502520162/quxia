import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    shelfs: {
      shelfCount: 0,
      shelfs: []
    },
    systemInfo: {},
    id: '',
    deviceTypeId: '',
    isAll: 'notAll',
    commotidyData: {},
    isBatch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        shelfs: {
          ...this.data.shelfs
        },
        id: options.id,
        deviceTypeId: options.deviceTypeId
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
    if (isAll == 'notAll') {
      this.setData({
        shelfs
      })
    }
  },



  /**
   * 批量更新商品
   */
  updateBatch: function(data, shelfs) {
    let shelfAll = this.data.shelfs
    for (var i = 0; i < shelfs.length; i++) {
      if (shelfs[i].checked) {
        shelfs[i].checked = false
        shelfs[i].number = shelfs[i].number
        shelfs[i].image = data.image
        shelfs[i].name = data.name
        shelfs[i].price = data.price
        shelfs[i].productId = data.productId
      } else {
        shelfs[i].checked = false
        shelfs[i].number = shelfs[i].number || ''
        shelfs[i].image = shelfs[i].image || ''
        shelfs[i].name = shelfs[i].name || ''
        shelfs[i].price = shelfs[i].price || ''
        shelfs[i].productId = shelfs[i].productId || ''
      }
    }
    this.setData({
      shelfs: {
        ...this.data.shelfs,
        shelfCount: shelfs.length,
        shelfs: shelfs,
        id: shelfAll.id
      },
      isBatch: false
    })
  },

  /**
   * 方案名称更改
   */
  onChangeShelfsName: function(e) {
    this.setData({
      shelfs: {
        ...this.data.shelfs,
        name: e.detail.value
      }
    })
  },



  /**
   * 添加货道数量
   */

  addBtn: function() {
    let num = this.data.shelfs.shelfCount;
    let shelfs = this.data.shelfs.shelfs;
    if (num < 100) {
      shelfs.push({
        number: shelfs.length + 1,
        checked: false,
        value: shelfs.length
      });

      this.setData({
        shelfs: {
          ...this.data.shelfs,
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
        shelfs: {
          ...this.data.shelfs,
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
    let id = this.data.id;
    let deviceTypeId = this.data.deviceTypeId

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



    fetch({
        url: '/shelfs/devices',
        method: 'post',
        data: {
          ...this.data.shelfs,
          deviceId: parseInt(id),
          deviceTypeId: deviceTypeId
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

  /**
   * 单个商品的选择
   */
  showActionSheet: function(e) {
    let isBatch = this.data.isBatch;
    if (!isBatch) {
      let index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: '../shelfs/commotidyDetail?index=' + index + '&isAll=notAll',
      })
    }
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
    if (!shelfs.length) {
      wx.showToast({
        title: '请添加货道数量',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isBatch: !this.data.isBatch
    })
  },

  /**
   * 取消
   */
  batchCancel: function() {
    let shelfs = this.data.shelfs.shelfs
    for (var j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
      shelfs[j].checked = false
    }
    this.setData({
      isBatch: !this.data.isBatch,
      shelfs: {
        ...this.data.shelfs,
        shelfs: shelfs
      }
    })
  },



  /**
   * 删除
   */
  batchRemove: function() {
    let shelfs = this.data.shelfs.shelfs
    let count = 0
    for (var j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
      if (shelfs[j].checked) {
        count++
      }
    }
    if (!count) {
      wx.showToast({
        title: '请选择要删除的货道',
        icon: 'none'
      });
      return;
    }


    wx.showModal({
      content: '确定删除选择的货道?',
      success: (e) => {
        if (e.confirm) {
          let newShelfs = []
          for (var j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
            if (!shelfs[j].checked) {
              newShelfs.push(shelfs[j])
            }
          }
          this.setData({
            isBatch: !this.data.isBatch,
            shelfs: {
              ...this.data.shelfs,
              shelfs: newShelfs,
              shelfCount: newShelfs.length
            }
          })
        }
      }
    })
  },



  /**
   * 批量设置
   */
  batchSetupTop: function(e) {
    let shelfs = this.data.shelfs.shelfs
    let count = 0
    for (var j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
      if (shelfs[j].checked) {
        count++
      }
    }
    if (!count) {
      wx.showToast({
        title: '请选择要批量设置的货道',
        icon: 'none'
      });
      return;
    }


    if (shelfs.length) {
      wx.navigateTo({
        url: '../shelfs/commotidyDetail?isAll=all'
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
   * 批量设置选中事件
   */
  checkboxChange: function(e) {
    let isBatch = this.data.isBatch

    if (!isBatch) return
    var checkboxItems = this.data.shelfs.shelfs,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      shelfs: {
        ...this.data.shelfs,
        shelfs: checkboxItems
      }
    })
  },

  /**
   * 获取方案详情
   */
  fetchShelfDetials: function(id) {
    fetch({
        url: '/shelfs/devices/detail',
        data: {
          id: id
        }
      })
      .then(res => {
        let shelfs = res.data.shelfs.map((item, index) => {
          item.checked = false
          item.value = index
          return item
        })
        res.data.shelfs = shelfs
        this.setData({
          shelfs: {
            ...this.data.shelfs,
            ...res.data,
            shelfCount: res.data.shelfs.length
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  }


})