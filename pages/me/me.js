// pages/me/me.js
import fetch from '../../lib/fetch.js';
import getStorePermissions from '../../utils/getStorePremissioin.js';
let permissions = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo: {},
    menuList: [
      { icon: '../../assets/images/alterPasswd.png', name: '修改密码', url: './alterPasswd/alterPasswd', tapEvent: 'showPage', permission: '', hide: false },
      { icon: '../../assets/images/withDraw.png', name: '我的钱包', url: './wallet/wallet', tapEvent: 'showPage', permission: 51, hide: true },
      { icon: '../../assets/images/help.png', name: '帮助', url: '', tapEvent: '', permission: '', hide: false  },
      { icon: '../../assets/images/logOut.png', name: '退出', url: '', tapEvent: 'logOutHandle', permission: '', hide: false }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let permissions = getStorePermissions();
    let menuList = this.data.menuList.map(item => {
      if (permissions.includes(item.permission)) {
        item.hide = false;
      }
      return item;
    });

    this.setData({
      menuList: menuList
    })
    this.getPersonInfo();
  },

  /**
   * 获取个人信息
   */
  getPersonInfo: function() {
    fetch({
      url:'/profile'
    })
    .then( res => {
       this.setData({
         personInfo: res.data
       })
    })
    .catch( err => {
      console.error(err);
    })
  },

  /**
   * 退出登陆
   */
  logOutHandle: function() {
    wx.clearStorage();
    wx.reLaunch({
      url: '../login/login',
    });
  },

  /**
   * 页面跳转
   */
  showPage: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }

})