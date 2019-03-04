// pages/manage/device/list/log.js
import fetch from '../../../../lib/fetch.js';
import moment from '../../../../lib/moment.min.js'
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
    this.fetchLogs(options.id);
  },

  /**
   * 获取日志列表
   */

  fetchLogs: function (id) {

    if (this.data.listLoading) {
      return;
    }

    if(this.data.listEnd){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/devices/onlineLogs?id='+id,
      data: {
        ...this.data.listParams
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        if(res.data){
          res.data = res.data.map( item => {
            item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm')
            return item;
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

  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchDevices();
    }
  },

})