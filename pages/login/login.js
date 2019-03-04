// pages/login/login.js
//获取应用实例
const app = getApp();

import config from '../../config.js';
import base64 from '../../lib/base64.js'
const BASE_URL = config.BASE_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showTopTips: false,
    tips: '',

    userInfo:{},

    username:'',
    password: '',


    isCanRegister: true, //场地管理员，没有注册
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWXuserinfo();
  },

  /**
   * 获取微信用户信息
   */
  getWXuserinfo: function() {
      wx.getUserInfo({
        success: res => {
          this.setData({
            userInfo: res.userInfo
          })
        } 
      })
  },


  rolesChangeHandle: function (e) {
    this.setData({
      rolesIndex: e.detail.value
    })
    if (e.detail.value == 0 ){
      this.setData({
        isCanRegister: true
      })
    } else {
      this.setData({
        isCanRegister: false
      })  
    }
    
  },

  userNameChangeHandle: function (e) {
    this.setData({
      showTopTips: false,
      username: e.detail.value.trim()
    });
  },

  passwordChangehandle: function (e) {
    this.setData({
      showTopTips: false,
      password: e.detail.value.trim()
    })
  },

  gotoRegister: function(){
    wx.navigateTo({
      url: './register',
    });
  },
  
  loginHandle: function () {

    if( !this.data.username || !this.data.username.trim() ) {
      this.setData({
        showTopTips: true,
        tips: '请输入用户名'
      })
      return;
    }

    if (!this.data.password || !this.data.password.trim()) {
      this.setData({
        showTopTips: true,
        tips: '请输入密码'
      })
      return;
    }
    let Authorization = base64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);

    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data : {
        username: this.data.username,
        password: this.data.password,
        grant_type: config.grant_type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Authorization}`
      },
      success:  res => {
        if (res.data.access_token) {
          let expireTime = new Date().valueOf() + res.data.expires_in * 1000;
          res.data.expireTime = expireTime;
          try {
            app.globalData.token = res.data;
            wx.setStorageSync('tokenInfo', res.data);
            this.fetchPermissions(res.data);
          } catch (err) {
            console.error(err);
          }

        } else {
          this.setData({
            showTopTips: true,
            tips: '账号或密码错误'
          })
        }
      },
      fail:  error => {
        console.error(error);
        this.setData({
          showTopTips: true,
          tips: '用户名或密码错误'
        })
      }
    })
  },

  /**
  * 获取用户权限
  */
  fetchPermissions: function (token) {
    wx.request({
      url: BASE_URL + "/merchant/api/wx/permissions",
      data:{
        access_token: token.access_token
      },
      success: res => {
        if( res.data.code == 0){
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
})