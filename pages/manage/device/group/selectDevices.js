import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: null,
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    filterParams: {},

    typesData: [],
    typesDataIndex: 0,

    chooseDevices: [],

    inputShowed: false,
    inputVal: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      groupId: options.id
    });
    this.fetchAllDeviceTypes();
    this.fetchDevices();


  },

  /**
   * 获取设备
   */

  fetchDevices: function() {
    if (this.data.listLoading && this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/devices',
        data: {
          ...this.data.listParams,
          ...this.filterParams
        }
      })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }

        res.data.map(item => {
          if (this.data.chooseDevices.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
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
  loadMoreListData: function() {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams,
          from: this.data.listParams.from + this.data.listParams.size
        }
      })
      this.fetchDevices();
    }
  },


  /**
   * 获取所有的设备类型
   */
  fetchAllDeviceTypes: function() {
    fetch({
        url: '/devices/types'
      })
      .then(res => {
        if (res.data) {
          res.data.unshift({
            id: "",
            name: '全部'
          });
          this.setData({
            typesData: res.data
          })
        } else {
          this.setData({
            typesData: [{
              id: "",
              name: '全部'
            }]
          })
        }
      })
  },

  /**
   * 设备类型更改
   */
  onFilterDeviceChange: function(e) {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
      chooseDevices: [],
      typesDataIndex: e.detail.value,
      filterParams: { ...this.filterParams,
        typeId: this.data.typesData[e.detail.value].id
      }
    })
    this.fetchDevices();
  },


  /**
   * 选择设备
   */
  checkboxChange: function(e) {
    var listData = this.data.listData,
      values = e.detail.value;
    for (var i = 0, lenI = listData.length; i < lenI; ++i) {
      listData[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (listData[i].id == values[j]) {
          listData[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      chooseDevices: values,
      listData: listData
    });
  },

  /**
   * 确定所选的设备
   */
  onConfirm: function() {
    fetch({
        url: '/deviceGroups/addDevices?groupId=' + this.data.groupId,
        data: {
          groupId: this.data.groupId,
          deviceIds: this.data.chooseDevices
        },
        method: 'post'
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
      .catch(err => {
        console.error(err);
      })

  },

  /**
   * 搜索框搜索
   */
  searchInputConfirm: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
      chooseDevices: [],
    }, () => {
      this.fetchDevices();
    })
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.searchInputConfirm();
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  }




})