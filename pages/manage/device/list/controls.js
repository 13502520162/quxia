// pages/manage/device/list/controls.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeId: '',
    deviceId: '',
    funcList: [{
        name: '开门',
        url: './quxia/door'
      },
      {
        name: '蓝牙',
        url: "./quxia/bluetooth"
      },
      {
        name: '睡眠灯',
        url: "./quxia/lamp"
      }
    ],

    shelfs: {
      id: null,
      name: "",
      shelfCount: 0,
      shelfs: [],
      number: 0
    },
    isAll: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.typeId) {
      this.setData({
        typeId: options.typeId,
        deviceId: options.id
        //  deviceId: 4095821684827392
      })
    }

    this.fetchShelfDetials()
  },


  /**
   * 获取方案详情
   */
  fetchShelfDetials: function(id) {

    let deviceId = this.data.deviceId
    fetch({
        url: '/shelfs/devices/detail',
        data: {
          id: deviceId
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
            ...res.data
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
  },



  /**
   * 批量设置选中事件
   */
  checkboxChange: function(e) {
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
   * 是否全选
   */
  allChecked: function(e) {
    let isAll = this.data.isAll
    let shelfs = this.data.shelfs.shelfs
    if (!isAll) {
      for (let j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
        shelfs[j].checked = true
      }
    } else {
      for (let j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
        shelfs[j].checked = false
      }
    }

    this.setData({
      shelfs: {
        ...this.data.shelfs,
        shelfs
      },
      isAll: !this.data.isAll
    })
  },


  /**
   * 出货
   */
  shipment: function() {
    let deviceId = this.data.deviceId
    let shelfs = this.data.shelfs.shelfs,
      numbers = []

    for (let j = 0, lenJ = shelfs.length; j < lenJ; ++j) {
      if (shelfs[j].checked) {
        numbers.push(shelfs[j].number)
      }
    }

    if (!numbers.length) {
      wx.showToast({
        title: '请选择要出货的货道',
        icon: 'none'
      })
      return;
    }


    fetch({
      url: '/quxia/vm/remote/open',
      method: 'POST',
      data: {
        deviceId: parseInt(deviceId),
        numbers
      }
    }).then(res => {
      wx.showToast({
        title: '出货成功',
        icon: 'success'
      })

      setTimeout(res => {
        wx.navigateBack({
          detil: 1
        })
      }, 1500)
    })
  }

})