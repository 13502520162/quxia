// pages/manage/bigVendingMachineShelfs/commotidyDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     commotidyData: '',
     commotidyDataIndex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    let index = options.index; //商品列表商品的下标索引，根据索引，获取该商品的数据
  
    this.setData({
      commotidyDataIndex:index,
      commotidyData: prePage.data.shelfs.shelfs[index],
    })
  },

  /**
   * 货道更改
   */
  shelfNumberChange: function (e) {
    this.setData({
      commotidyData: {
        ...this.data.commotidyData, 
        number: e.detail.value
      }
    })
  },

  /**
   * 价格更改
   */
  priceChange: function(e) {
    this.setData({
      commotidyData: {
        ...this.data.commotidyData,
        price: e.detail.value
      }
    })
  },

  /**
   * 删除商品
   */
  delCommotidy: function () {
    wx.showModal({
      title: '删除',
      content: '是否删除商品？',
      success: res => {
        if (res.cancel) {
          return;
        }
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        let preShelfs = prePage.data.shelfs.shelfs;
        preShelfs.splice(this.data.commotidyDataIndex, 1);
        prePage.setData({
          shelfs: { ...prePage.data.shelfs, shelfs: preShelfs, shelfCount: preShelfs.length }
        });
        wx.navigateBack({
          detal: 1
        })
      }
    })
  },

  /**
   * 选择商品
   */
  selectCommodity: function (e) {
        wx.navigateTo({
          url: './commotidy',
        })
  },
  
  /**
   *  确定商品
   */
  comfirmCommitidy: function () {

    if(!this.data.commotidyData.number){
      wx.showToast({
        title: '请输入货道号',
        icon: 'none'
      })
      return; 
    }

    if (!this.data.commotidyData.price) {
      wx.showToast({
        title: '请输入价格',
        icon: 'none'
      })
      return;
    }

    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    for (let i = 0; i < prePage.data.shelfs.shelfs.length; i++ ){
      if ( i != this.data.commotidyDataIndex && prePage.data.shelfs.shelfs[i].number == this.data.commotidyData.number ){
        wx.showToast({
          title: '货道号已存在,请重新输入',
          icon: 'none'
        })
        return;
      }
    }
   let shelfs = prePage.data.shelfs.shelfs;
    shelfs[this.data.commotidyDataIndex] = this.data.commotidyData;
    prePage.setData({
      shelfs: { ...prePage.data.shelfs, shelfs:shelfs }
    })

    wx.navigateBack({
      detal: 1
    })
   

  }

})