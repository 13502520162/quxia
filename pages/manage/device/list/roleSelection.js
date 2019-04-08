import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listParams: {
      from: 0,
      size: 10
    },
    listLoading: false,
    listEnd: false,
    listData: [],
    users: [],
    choosePlaces: [],


    inputVal: "",
    inputShowed: false,
    id: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
 
    this.setData({
      users: options.users
    }, () => {
      this.fetchUsers();
    })
  },

  /**
   * 获取用户
   */

  fetchUsers: function() {
    if (this.data.listLoading && this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
        url: '/accounts',
        data: {
          ...this.data.listParams,
          query: this.data.inputVal
        }
      })
      .then(res => {
        let choosePlaces = []
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }

        res.data.map(item => {
          if (this.data.users.includes(item.id)) {
          
            item.checked = true;
            choosePlaces.push(item.id)
          } else {
            item.checked = false;
          }
          return item;
        })

        this.setData({
          listData: [...this.data.listData, ...res.data],
          choosePlaces
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
      this.fetchUsers();
    }
  },



  /**
   * 搜索
   */
  searchInputConfirm: function() {
    this.setData({
      listParams: {
        from: 0,
        size: 10
      },
      listData: [],
    }, () => {
      this.fetchUsers();
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
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },




  /**
   * 选择用户
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
      choosePlaces: values,
      listData: listData
    });
  },

  /**
   * 确定所选
   */
  onConfirm: function() {

    fetch({
        url: '/devices/users',
        method: 'post',
        data: {
          deviceId: this.data.id,
          userIds: this.data.choosePlaces
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
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setData({
          listLoading: false
        })
      })

  }



})