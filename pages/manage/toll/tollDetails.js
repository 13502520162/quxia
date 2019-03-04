// pages/manage/toll/tollDetails.js
import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 商品
     */
    plansId:null,
    planItems:[],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        plansId: options.id
      })
      this.fetchTollDetail();
    }
  },

  onShow: function(){
    this.setData({
      planItems: this.data.planItems
    })
  },

  onAddGoods: function () {
    wx.navigateTo({
      url: './goods',
    })
  },

  changeGoods: function(index) {
    let params = { ...this.data.planItems[index]};
    wx.navigateTo({
      url: './goods?params='+JSON.stringify(params)+'&index='+index,
    })
  },

  onNameChange: function(e) {
     this.setData({
       name: e.detail.value
     })
  },

  /**
   * 获取套餐详情
   */
  fetchTollDetail: function () {
    fetch({
      url: '/plans/detail',
      data: {
        id: this.data.plansId
      }
    })
    .then( res => {
      this.setData({
        name: res.data.name,
        planItems: [...res.data.items]
      })
    })
  },

  showActionSheet: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['编辑商品', '删除商品'],
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              this.changeGoods(index);
              break;
            case 1:
              let planItems = [];
            
               this.data.planItems.map( (item,i ) => {
                 if( i != index ){
                   planItems.push(item)
                 }
              })
              this.setData({
                planItems: planItems
              })
              break;
            case 2:
              this.delToll(id);
              break;
            default:
              break;
          }
        }
    },
    })
  },
  
  /**
   * 提交套餐数据
   */
  onSubmit: function () {
    if( !this.data.name ) {
      wx.showToast({
        title: '请输入套餐名称',
        icon: 'none'
      })
      return;
    }

    if( !this.data.planItems.length ){
      wx.showToast({
        title: '请添加商品',
        icon: 'none'
      })
      return
    }

    if(this.data.plansId){
      this.fetchUpdateToll();
    } else {
      this.fethNewToll();
    }

  },

  /**
   * 新增套餐
   */
  fethNewToll: function() {
    fetch({
      url: '/plans',
      data: {
        name: this.data.name,
        items: this.data.planItems
      },
      method: 'post'
    })
      .then(res => {
        wx.showToast({
          title: '提交成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(err => {
        if (err.errstr && err.errstr.data && err.errstr.data.code == '401'){
          wx.showToast({
            title: '名称已存在',
            icon: 'none'
          })
        }
        console.error(err)
      })
  },

  /**
   * 更新套餐
   */
  fetchUpdateToll:function() {
    fetch({
      url: '/plans?id=' + this.data.plansId,
      data: {
        name: this.data.name,
        items: this.data.planItems
      },
      method: 'put'
    })
      .then(res => {
        wx.showToast({
          title: '提交成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(err => {
        console.error(err)
      })
  }


})