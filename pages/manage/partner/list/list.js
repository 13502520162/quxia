// pages/manage/partner/list/list.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchPartnersList();
  },


  /**
   * 获取合伙人列表
   */

  fetchPartnersList: function () {

    if (this.data.listLoading) {
      return;
    }

    if( this.data.listEnd ){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/partners',
      data: {
        ...this.data.listParams,
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
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
  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchPartnersList();
    }
  },


  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    let enable = e.currentTarget.dataset.enbale;
    let itemList = ['编辑资料', '查看合伙人设备', '修改密码', '启用账号', '删除'];
    if ( enable ){
      itemList[3] = "禁用账号";
    } else {
      itemList[3] = "启用账号"
    }
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: './partner?type=edit&id='+ id,
              })
              break;
            case 1:
              wx.navigateTo({
                url: './devices?id=' + id,
              })
              break;
            case 2:
              wx.navigateTo({
                url: './partner?type=alter&id=' + id,
              })
              break;
            case 3:
              if(enable){
                this.disableAccount(id)
              } else {
                this.enableAccount(id)
              }
              break;
            case 4:
              this.delPartner(id);
              break;
              
            default:
              break;
          }
        }
      }
    })
  },

  /**
   * 启用账号
   */
  enableAccount: function(id) {
    fetch({
      url:'/partners/enable',
      method: 'post',
      data: {
        id: id
      }
    })
    .then( res => {
      let listData = this.data.listData.map( item => {
        if( item.id == id ){
          item.enable = true
        }
        return item;
      })
      this.setData({
        listData: listData
      });
    })
    .catch( err => {
      console.error( err );
    })
  },

  /**
   * 禁用账号
   */
  disableAccount: function (id) {
    fetch({
      url: '/partners/disable',
      method: 'post',
      data: {
        id: id
      }
    })
      .then(res => {
        let listData = this.data.listData.map(item => {
          if (item.id == id) {
            item.enable = false
          }
          return item;
        })
        this.setData({
          listData: listData
        });
      })
      .catch(err => {
        console.error(err);
      })
  },

/**
 * 删除合伙人
 */
  delPartner: function (id) {
    fetch({
      url: '/partners',
      data: { id: id },
      method: 'delete'
    })
      .then(res => {
        let listData = [];
        this.data.listData.map(item => {
          if (item.id != id) {
            listData.push(item)
          }
        });
        this.setData({
          listData: listData
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 跳转到合伙人页面
   */
  onAddPartner: function () {
    wx.navigateTo({
      url: './partner',
    })
  },




})