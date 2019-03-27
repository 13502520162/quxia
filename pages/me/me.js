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
    isBinding: false,
    menuList: [{
        icon: '../../assets/images/withDraw.png',
        name: '我的钱包',
        url: './wallet/wallet',
        tapEvent: 'showPage',
        permission: 51,
        hide: true
      },
      {
        icon: '../../assets/images/withDraw.png',
        name: '绑定微信',
        url: '',
        tapEvent: 'weChatBinding',
        permission: 51,
        hide: true
      },
      {
        icon: '../../assets/images/alterPasswd.png',
        name: '修改密码',
        url: './alterPasswd/alterPasswd',
        tapEvent: 'showPage',
        permission: '',
        hide: false
      },
      {
        icon: '../../assets/images/help.png',
        name: '帮助',
        url: '',
        tapEvent: '',
        permission: '',
        hide: false
      },
      {
        icon: '../../assets/images/logOut.png',
        name: '退出',
        url: '',
        tapEvent: 'logOutHandle',
        permission: '',
        hide: false
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let permissions = getStorePermissions();
    let menuList = this.data.menuList.map(item => {
      if (permissions.permissions.includes(item.permission)) {
        item.hide = false;
      }
      return item;
    });

    this.setData({
      menuList: menuList
    })
    this.getPersonInfo();
    this.getWx()
  },

  /**
   * 获取个人信息
   */
  getPersonInfo: function() {
    fetch({
        url: '/profile'
      })
      .then(res => {
        this.setData({
          personInfo: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 获取是否绑定微信
   */
  getWx: function() {
    fetch({
        url: '/bindWxa',
        mehtod: 'get'
      })
      .then(res => {
        this.setData({
          isBinding: res.data
        })
      })
      .catch(err => {
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
  },

  /**
   * 微信绑定
   */

  weChatBinding: function(event) {
    let isBinding = this.data.isBinding
    let that = this
    if (!isBinding) {

      wx.showModal({
        content: '确定绑定微信嘛?',
        success(res) {
          if (res.confirm) {
            //调用微信登录接口
            wx.login({
              success: function(login) {
                if (login.errMsg == "login:ok") {
                  var code = login.code;
                  if (code) {
                    let p = new Promise(function(resolve, reject) {
                      fetch({
                          url: '/openId?code=' + login.code,
                          method: 'GET',
                          data: {
                            code: login.code
                          }
                        })
                        .then(res => {
                          that.fetchbindWxa(res)
                        })
                    })
                  }
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        content: '确定解除绑定微信嘛?',
        success(res) {
          if (res.confirm) {
            fetch({
                url: '/unbindWxa',
                method: 'post'
              })
              .then(res => {
                that.setData({
                  isBinding: false
                })

                wx.showToast({
                  title: '解绑成功',
                  icon: 'none'
                })
              })
          }
        }
      })



    }
  },

  fetchbindWxa: function(res) {
    fetch({
        url: '/bindWxa?openId=' + res.data,
        method: 'post',
        data: {
          openId: res.data
        }
      })
      .then(res => {
        this.setData({
          isBinding: true
        })
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        })
      })
  }

})