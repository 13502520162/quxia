// pages/manage/inventory/recordDetails.js
import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsData: {},
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchDetails( options.id );
  },

  /**
   * 获取详情数据
   */

  fetchDetails: function (id) {
    fetch({
      url: '/inventory/audits/detail',
      data: {
        id: id
      }
    })
    .then( res => {
      let data = res.data;
      switch (data.type) {
        case 'RETURN':
          data.type = '退货';
          break;
        case 'STOCKIN':
          data.type = '进货';
          break;
        case 'TRANSFER':
          data.type = '发货';
          break;
        case 'RESTOCK':
          data.type = '补货';
          break;
        default:
          break;
      };

      let listData = [
        { name: '类型', value: data.type },
        { name: '件数', value: data.amount },
        { name: '起始库存', value: data.beforeStocks },
        { name: '结束库存', value: data.afterStocks },
        { name: '场地', value: data.locationName },
        { name: '场地地址', value: data.province + data.city + data.district + data.street },
        { name: '操作人', value: data.userName },
        { name: '操作时间', value: moment(data.createdDate).format('YYYY-MM-DD HH:mm') }
      ];

      if (data.type == '发货'){
        listData.push( { name: '收货场地', value: data.toLocationName });
        listData.push({ name: '收货地址', value: data.toProvince + data.toCity + data.toDistrict + data.toStreet });
      }

      this.setData({
        detailsData: data,
        listData: listData
      })
    })
    .catch( err =>{
      console.error(err);
    })
  }
})