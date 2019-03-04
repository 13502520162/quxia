// pages/login/register.js
import fetch from '../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    username: '',
    password: '',
    comfirmPassword: '',
    mobile: '',
    validateCode:'',
    getValidateCodeTimer:null,
    restgetValidateCodeTime: 60,    
    validateCodeBtnText:'获取验证码'
  },

  nameChangeHandle: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  userNameChangeHandle: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  passwordChangeHandle: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  comfirmChangeHandle: function (e) {
    this.setData({
      comfirmPassword: e.detail.value
    })
  },

  mobileChangeHandle: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  validateCodeChangeHandle: function (e) {
    this.setData({
      validateCode: e.detail.value
    })
  },

  registerHandle: function () {
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none'
      });
      return;
    }
    if(!this.data.username){
      wx.showToast({
        title: '请输入用户名！',
        icon:'none'
      });
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'none'
      });
      return;
    }
    if (this.data.password !== this.data.comfirmPassword ) {
      wx.showToast({
        title: '两次密码不一致！',
        icon: 'none'
      });
      return;
    }
    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      });
      return;
    }
    if (!this.data.validateCode) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none'
      });
      return;
    }

    fetch({
      url:`/api/register?mobile=${this.data.mobile}&code=${this.data.validateCode}`,
      method: 'put',
      data: {
        username: this.data.username,
        name: this.data.name,
        password: this.data.password,
        mobile: this.data.mobile
      }
    })
    .then( res => {
      wx.showToast({
        title: '注册成功',
      });
      setTimeout(()=> {
        wx.reLaunch({
          url: './login',
        });
      },1500)
    })
    .catch( err => {
      console.error(err);
    })
  },

  getValidateCode: function() {
    if(!this.data.mobile ){
      wx.showToast({
        title: '请输入手机号码',
        icon:'none'
      })
      return
    }

    let mobileReg = /^1[3|5|7|8][0-9]{9}$/;
    if (!mobileReg.test(this.data.mobile)){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      });
      return;
    }

    if (this.data.getValidateCodeTimer) return;
    let restTime = this.data.restgetValidateCodeTime;
    let timer = setInterval(() => {
      restTime--;
      if (restTime != 0) {
        this.setData({
          validateCodeBtnText: restTime + 's',
        });
      } else {
        clearInterval(this.data.getValidateCodeTimer);
        this.setData({
          getValidateCodeTimer: null,
          validateCodeBtnText: '获取验证码'
        });
      }
    }, 1000);
    this.setData({
      getValidateCodeTimer: timer
    });
    fetch({
      url: `/api/registerCode`,
      method: 'get',
      data: {
        mobile: this.data.mobile
      }
    })
      .then(res => {
        wx.showToast({
          title: '验证发已发送,请注意查收',
        });
      })
      .catch(err => {
        console.log(err);
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})