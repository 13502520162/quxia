//app.js

import CusBase64 from './lib/base64'
import config from './config.js'
const BASE_URL = config.BASE_URL;


//为Promise添加finally方法
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};


App({
  onLaunch: function() {},



  getToken(cb) {
    let self = this
    this.globalData.token = wx.getStorageSync('tokenInfo');
    this.globalData.loginInfo = wx.getStorageSync('loginInfo');
    if (this.globalData.token && this.globalData.token.expireTime > new Date().getTime()) {
      cb(this.globalData.token.access_token)
      return
    } else {

      self.globalData.queuecb.push(cb)
      if (self.globalData.tokenIsReady === true) {
        self.globalData.tokenIsReady = false
      } else {
        return
      }
    }

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('run')
          // 登录
          wx.login({
            success: res => {
              // ------ 获取凭证 ------
              var code = res.code;
              if (code) {
                let p = new Promise(function(resolve, reject) {
                  wx.request({
                    url: BASE_URL + '/merchant/api/wx/login?code=' + code,
                    data: {
                      code
                    },
                    method: 'post',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(res) {
                      wx.setStorageSync('loginInfo', res.data.data)
                      self.globalData.loginInfo = res.data.data;
                      self.fetchWxlogin(res.data)
                    }
                  })
                })
              }
            }
          })
        } else {
          wx.redirectTo({
            url: "/pages/authorization/authorization"
          })
        }
      }
    })
  },


  hasPermission: function() {
    try {
      let permissionss = wx.getStorageSync('permissions');
      if (permissionss != '') {
        return permissionss.admin
      }
    } catch (err) {
      console.error(err);
    }
  },


  /**
   * 微信快速登录
   */
  fetchWxlogin: function(res) {
    let self = this
    let Authorization = CusBase64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);
    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data: {
        username: '',
        password: '',
        grant_type: 'merchant_wxa',
        openId: res.data.openId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Authorization}`
      },
      success: res => {
        if (res.data.access_token) {
          let expireTime = new Date().valueOf() + res.data.expires_in * 1000;
          res.data.expireTime = expireTime;
          try {
            self.globalData.token = res.data;
            wx.setStorageSync('tokenInfo', res.data);
            self.fetchPermissions(res.data)
          } catch (err) {
            console.error(err);
          }

        } else {
          if (res.statusCode == 401) {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }

        }

      }
    })
  },



  /**
   * 获取用户权限
   */
  fetchPermissions: function(token) {
    wx.request({
      url: BASE_URL + "/merchant/api/wx/permissions",
      data: {
        access_token: token.access_token
      },
      success: res => {
        if (res.data.code == 0) {
          if (!res.data.data.permissions) {
            res.data.data.permissions = []
          }
          wx.setStorageSync('permissions', res.data.data);
        }
        wx.reLaunch({
          url: '/pages/index/index',
          fail: err => {
            console.error(err);
          }
        })
      },
      fail: error => {
        console.error(error);
      }
    })
  },

  emit(type, data) {
    let listeners = this.globalData._events[type]
    if (listeners) {
      for (let listener of listeners) {
        listener[0](data)
      }
    }
  },

  on(type, listener) {
    if (!this.globalData._events[type]) {
      this.globalData._events[type] = []
    }
    this.globalData.listenerID += 1
    this.globalData._events[type].push([listener, this.globalData.listenerID])
    return this.globalData.listenerID
  },

  removeListener(type, listenerID) {
    let listeners = this.globalData._events[type]
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i][1] === this.globalData.listenerID) {
          listeners.splice(i, 1)
          break
        }
      }
    }
    if (listeners.length === 0) {
      this.globalData._events[type] = null
    }
  },

  removeAllListeners(type) {
    this.globalData._events[type] = null
  },

  listeners(type) {
    return this.globalData._events[type]
  },

  globalData: {
    userInfo: null,
    loginInfo: null,
    _events: {},
    listenerID: 0,
    token: null,
    tokenIsReady: true,
    queuecb: []
  }
})