import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchDetails(options.id);
  },

  /**
   * 获取详情数据
   */

  fetchDetails: function(id) {
    fetch({
        url: '/restocks/detail',
        data: {
          id: id
        }
      })
      .then(res => {
        let data = res.data;
        let listData = [{
            name: '场地',
            value: data.locationName
          },
          {
            name: '场地地址',
            value: data.province + data.city + data.district + data.street
          },
          {
            name: '设备编号',
            value: data.deviceId
          },
          {
            name: '设备名称',
            value: data.deviceName
          },
          {
            name: '补货人',
            value: data.userName
          },
          {
            name: '补货人手机',
            value: data.userMoibile
          },
          {
            name: '补货时间',
            value: moment(data.createdDate).format('YYYY-MM-DD HH:mm')
          },
        ];

        data.items.forEach(item => {
          listData.push({
            name: '货道' + item.number,
            value: item.name + ' X ' + item.amount
          })
        })

        this.setData({
          listData: listData
        })

      })
      .catch(err => {
        console.error(err);
      })
  }
})