// pages/manage/device/list/controls.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeId:'',
    deviceId:'',
    funcList:[
      { name: '开门',url: './quxia/door' },
      { name:'蓝牙', url: "./quxia/bluetooth" },
      { name: '睡眠灯', url: "./quxia/lamp" }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.typeId){
       this.setData({
         typeId: options.typeId,
         deviceId: options.id
        //  deviceId: 4095821684827392
       })
     }
  },

})