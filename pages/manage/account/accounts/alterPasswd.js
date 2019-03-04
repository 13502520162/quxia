// pages/me/alterPasswd/alterPasswd.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips:false,
    tips:'',
    newPasswd: null,
    confirmPasswd: null,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id: options.id
      })
  },



  newPasswdHandle: function (e) {
    this.setData({
      newPasswd:e.detail.value
    });
  },

  confirmPasswdHandle: function (e) {
    this.setData({
      confirmPasswd: e.detail.value
    })
  },

  confirmHandle: function () {


    if(!this.data.newPasswd) {
      this.setData({
        showTopTips: true,
        tips: '请输入新密码'      
      });
      this.timeoutCloseTips();
      return;
    }

    if (this.data.newPasswd.length < 6) {
      this.setData({
        showTopTips: true,
        tips: '密码至少6位'
      });
      this.timeoutCloseTips();
      return;
    }

    if(this.data.newPasswd != this.data.confirmPasswd) {
      this.setData({
        showTopTips: true,
        tips: '两次密码输入不一致'
      });
      this.timeoutCloseTips();
      return;
    }

    fetch({
      url: `/accounts/changePassword?id=${this.data.id}&password=${this.data.newPasswd}`,
      method: 'post'
    })
    .then( res => {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        setTimeout( ()=> {
          wx.navigateBack({
            detal: 1
          }, 1500)
        })
    })
    .catch( err => {
      console.error(err)
    })
    
  },

  timeoutCloseTips: function () {
    setTimeout(()=> {
      this.setData({
        showTopTips: false
      })
    },1500)
  }

})