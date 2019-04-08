// pages/me/me.js
import fetch from '../../lib/fetch.js';
import getStorePermissions from '../../utils/getStorePremissioin.js';
import WxHelper from './getSession.js';
let permissions = [];
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo: {},
    session: {},
    isBindingPhone: false,
    avatarUrl: '',
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
        icon: '../../assets/images/bindCellPhone.png',
        name: '绑定手机',
        url: '',
        tapEvent: 'bindCellPhone',
        permission: '',
        hide: false
      },
      {
        icon: '../../assets/images/wxbing.png',
        name: '微信绑定',
        url: '',
        tapEvent: 'weChatBinding',
        permission: '',
        hide: false
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
    let that = this
    let permissions = getStorePermissions();

    let menuList = this.data.menuList.map(item => {
      if (app.hasPermission()) {
        item.hide = false;
      } else {
        if (permissions.permissions.includes(item.permission)) {
          item.hide = false;
        }
      }

      return item;
    });
    that.setData({
      avatarUrl: wx.getStorageSync('userInfo').avatarUrl || app.globalData.userInfo.avatarUrl 
    })

    this.setData({
      menuList: menuList,
      session: app.globalData.loginInfo
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
  },


  /**
   * 绑定手机
   */
  bindCellPhone(e) {
    let that = this

    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let {
        encryptedData,
        iv
      } = e.detail

      // WxHelper.login(session => {
      //   fetch({
      //       // url: '/decrypt?sessionKey=' + encodeURIComponent(session.sessionKey) + '&encryptedData=' + encodeURIComponent(encryptedData) + '&iv=' + encodeURIComponent(iv),
      //       url: '/decrypt',
      //       data: {
      //         sessionKey: session.sessionKey,
      //         encryptedData: encryptedData,
      //         iv: iv,
      //       },
      //       method: 'post'
      //     })
      //     .then(result => {
      //       fetch({
      //         url: '/bindMobile?mobile=' + JSON.parse(result.data).phoneNumber,
      //         method: 'post',
      //         data: {
      //           mobile: JSON.parse(result.data).phoneNumber
      //         }
      //       }).then(res => {
      //         wx.showToast({
      //           title: '绑定成功',
      //           icon: 'none'
      //         })
      //       })
      //     })
      // });





      that.isLogin(session => {
        fetch({
            url: '/decrypt',
            data: {
              sessionKey: session.sessionKey,
              encryptedData: encryptedData,
              iv: iv,
            },
            method: 'post'
          })
          .then(reslut => {
            if (JSON.stringify(reslut.data) != '{}') {
              fetch({
                url: '/bindMobile?mobile=' + JSON.parse(reslut.data).phoneNumber,
                method: 'post',
                data: {
                  mobile: JSON.parse(reslut.data).phoneNumber
                }
              }).then(res => {
                wx.showToast({
                  title: '绑定成功',
                  icon: 'none'
                })
                that.setData({
                  personInfo: {
                    ...that.data.personInfo,
                    mobile: JSON.parse(reslut.data).phoneNumber
                  }
                })
              })
            } else {
              wx.showToast({
                title: '绑定失败，请重试',
                icon: 'none'
              })
            }

          })
      })

    }
  },

  isLogin: function(loginInfo) {
    let that = this
    let session = this.data.session
    if (session) {
      wx.checkSession({
        success: function() {
          console.log('成功')
          loginInfo(session)
        },
        fail() {
          console.log('失败')
          that.doLogin(loginInfo)
        }
      });
    } else {
      console.log('没有值，重新获取')
      that.doLogin(loginInfo)
    }

  },
  doLogin: function(loginInfo) {
    let that = this
    return new Promise(function(resolve, reject) {
      wx.login({
        success: res => {
          var code = res.code;
          if (code) {
            fetch({
                url: '/login?code=' + code,
                method: 'post'
              })
              .then(res => {
                resolve(res.data)
                that.setData({
                  session: res.data
                })
                loginInfo(res.data)
              })
          }
        }
      })
    })
  }
})