// pages/manage/partner/list/partner.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    type:"",   //三种情况， 空，新增合伙人， edit, 编辑合伙人， alter, 修改密码
    parnterData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.type){
       this.setData({
         type: options.type,
         id: options.id
       });
       if(options.type == 'edit'){
         this.fetchPartnerDetail(options.id);
       }
     }
  },


  onSubmit: function (e) {
      if(this.data.type == ''){
        this.fetchNewPartner( e.detail.value )
      } else if( this.data.type =='edit' ){
        this.fetchEditPartner();
      } else if( this.data.type == 'alter' ){
        this.fetchAlterPassword();
      }
  },


  /**
   * 基础资料验证
   */
  validateBasicData: function ( values ) {
    if (!values.username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!values.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }

    if (!values.mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!(/^1[3|5|7|8][0-9]{9}$/.test(values.mobile))) {
      wx.showToast({
        title: '请输入11位正确手机号',
        icon: 'none'
      });
      return;
    }
  },

  /**
   * 密码校验
   */

  validatePassword: function() {
    if (!values.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }


    if (values.password !== values.repeatPassword) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none'
      });
      return;
    }
  },


  /**
   * 新增合伙人
   */

  fetchNewPartner: function( values ) {

    this.validateBasicData(values);

    this.validatePassword(values);
    
    fetch({
      url: '/partners',
      method: 'post'
    })
    .then( res=> {
      wx.showToast({
        title: '新增成功',
      })
      setTimeout(()=> {
        wx.navigateBack({
          detal: 1
        })
      },1500)
    })
    .catch( err => {
      console.error( err );
    })
  },

  /**
   * 编辑合伙人
   */
  fetchEditPartner: function (values ) {
    this.validateBasicData( values )
    fetch({
      url: '/partners',
      method: 'put',
      data: {
        id: this.data.id,
        ...values
      }
    })
    .then( res => {
      wx.showToast({
        title: '修改成功',
      })
      setTimeout(() => {
        wx.navigateBack({
          detal: 1
        })
      }, 1500)
    })
    .catch( error => {
      console.error( error );
    })
  },

  /**
   *  修改密码
   */
  fetchAlterPassword: function (values) {
    this.validateBasicData(values)
    fetch({
      url: '/partners/changePassword',
      method: 'POST',
      data: {
        id: this.data.id,
        newPassword: values.password
      }
    })
      .then(res => {
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1500)
      })
      .catch(error => {
        console.error(error);
      })
  },

  /**
   * 获取合伙人详情
   */
  fetchPartnerDetail: function(id) {
    fetch({
      url: '/partners/detail',
      data: {
        id: id
      }
    })
    .then( res => {
      this.setData({
        parnterData: res.data
      })
    })
    .catch( err => {
      console.error(err);
    })
  }

})