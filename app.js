
//app.js

import CusBase64 from './lib/base64'
import config from './config.js'
const BASE_URL = config.BASE_URL;

//为Promise添加finally方法
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};


App({
  onLaunch: function () {
  },
  
  

  getToken(cb) {
    let self = this
    this.globalData.token = wx.getStorageSync('tokenInfo');
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
      success:  res => {
        if( res.authSetting['scope.userInfo'] ){
           wx.redirectTo({
             url: '/pages/login/login',
            //  url:'/pages/index/index'
           })
        } else {
          wx.redirectTo({
            url: "/pages/authorization/authorization"
          })
        }
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
    _events: {},
    listenerID: 0,
    token: null,
    tokenIsReady: true,
    queuecb: []
  }
})