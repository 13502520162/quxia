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
      shelfs: []
    },
    systemInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        shelfs:{ ...this.data.shelfs, id: options.id }
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

  onShow: function () {
    this.setData({
      shelfs: this.data.shelfs
    })
  },

  /**
   * 方案名称更改
   */
  onChangeShelfsName: function (e) {
    this.setData({
      shelfs: { ...this.data.shelfs, name: e.detail.value }
    })
  },

  /**
   * 添加货道数量
   */

  addBtn: function () {
    let num = this.data.shelfs.shelfCount;
    let shelfs = this.data.shelfs.shelfs;
   
    if(num < 100){
      shelfs.push({ });
      this.setData({
        shelfs: { ...this.data.shelfs, shelfCount: num + 1, shelfs: shelfs  }
      })
    }
  },

  /**
   * 减少货道数量
   */

  reduceBtn: function () {
    let num = this.data.shelfs.shelfCount;
    if (num > 0) {
      let shelfs = this.data.shelfs.shelfs;
     shelfs.splice(shelfs.length-1, 1);
      this.setData({
        shelfs: { ...this.data.shelfs, shelfCount: num - 1, shelfs: shelfs }
      })
    }
  },

  /**
   * 提交
   */

  submit: function () {

    if (this.data.shelfs.shelfs.length === 0 ){
      wx.showToast({
        title: '请添加货道',
        icon: 'none'
      });
      return;
    }

    if( !this.data.shelfs.name.trim()){
      wx.showToast({
        title: '请输入方案名称',
        icon: 'none'
      });
      return;
    }

    for( let i=0; i < this.data.shelfs.shelfs.length; i++){
      if (!this.data.shelfs.shelfs[i].productId){
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return;
      }
    }

    let id = this.data.shelfs.id;
    fetch({
      url: id ? '/shelfs?id=' + id : '/shelfs',
      method: id ? 'put' : 'post',
      data: { ...this.data.shelfs }
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


  showActionSheet: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: './commotidyDetail?index=' + index,
    })
   

  },

  /**
   * 获取方案详情
   */
  fetchShelfDetials: function(id){
    fetch({
      url:'/shelfs/detail',
      data: {id:id}
    }) 
    .then( res => {
      this.setData({
        shelfs: {...this.data.shelfs, ...res.data}
      })
    })
    .catch( err =>{
      console.error(err);
    })
  }


})