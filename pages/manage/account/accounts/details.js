// pages/manage/account/accounts/details.js
import fetch from '../../../../lib/fetch.js';
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    accountData: {
      locationIds: []
    },
    roles: [],
    isAdmin: false,
    rolesIndex: 0,
    type: '',
    hides: false,
    editAdmin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.id) {
      this.setData({
        id: options.id,
        type: options.type,
        editAdmin: Boolean(options.admin)
      })
    }
    this.fetchRoles();
    let isAdmin = getStorePermissions().admin
    this.setData({
      isAdmin: isAdmin
    })
  },



  /**
   * 获取角色列表
   */
  fetchRoles: function() {
    fetch({
        url: '/roles/select',
        isShowLoading: true
      })
      .then(res => {
        this.setData({
          roles: res.data
        })
        //如果存在id 则获取账号详情
        if (this.data.id) {
          this.fetchAccountDetail();
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  /**
   * 姓名更改
   */
  onNameChange: function(e) {
    this.setData({
      accountData: { ...this.data.accountData,
        name: e.detail.value
      }
    })
  },


  /**
   * 用户名更改
   */
  onUsernameChange: function(e) {
    this.setData({
      accountData: { ...this.data.accountData,
        username: e.detail.value
      }
    })
  },

  /**
   * 手机号更改
   */
  onMobileChange: function(e) {
    this.setData({
      accountData: { ...this.data.accountData,
        mobile: e.detail.value
      }
    })
  },

  // /**
  //  * 分润权限更改
  //  */
  // onRoyaltyChange: function (e) {
  //   this.setData({
  //     accountData: { ...this.data.accountData, royaltyPermission: e.detail.value }
  //   }) 
  // },

  /**
   * 是否管理员
   */

  isAdmin: function(e) {
    let value = e.detail.value
    if (value) {
      this.setData({
        editAdmin: true
      })
    }

    this.setData({
      accountData: { ...this.data.accountData,
        admin: value,
      },
      hides: value
    })
  },


  /**'
   * 更改角色
   */
  bindRoleChange: function(e) {
    this.setData({
      rolesIndex: e.detail.value
    })
  },

  /**
   * 
   * 更改场地
   */
  goToSelectPlace: function() {
    wx.navigateTo({
      url: './selectPlace',
    })
  },


  /**
   * 获取详情
   */

  fetchAccountDetail: function() {
    fetch({
        isShowLoading: true,
        url: '/accounts/detail',
        data: {
          id: this.data.id
        }
      })
      .then(res => {
        for (let i = 0; i < this.data.roles.length; i++) {
          if (this.data.roles[i].id == res.data.roleId) {
            this.setData({
              rolesIndex: i
            })
            break;
          }
        }
        this.setData({
          accountData: res.data,
          isAdmin: res.data.admin,
          hides: res.data.admin,
        })
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 提交
   */

  submit: function(e) {
    const {
      name,
      username,
      mobile,
      password,
      confirmPassword
    } = e.detail.value;
    let isAdmin = this.data.isAdmin
    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return;
    }
    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
      })
      return;
    }

    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
      })
      return;
    }

    if (!isAdmin) {
      if (!this.data.accountData.locationIds.length) {
        wx.showToast({
          title: '请选择场地',
          icon: 'none',
        })
        return;
      }
    }


    /**
     * 新增账号，密码校验
     */
    if (!this.data.id) {
      if (!password) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
        })
        return;
      }

      if (password.length < 6) {
        wx.showToast({
          title: '密码至少6位',
          icon: 'none',
        })
        return;
      }

      if (password != confirmPassword) {
        wx.showToast({
          title: '两次输入密码不一致',
          icon: 'none',
        })
        return;
      }
    }

    let roleId = this.data.roles[this.data.rolesIndex].id,
      locationIds = this.data.accountData.locationIds
    if (this.data.accountData.admin) {
      roleId = '', locationIds = []
    }


    fetch({
        url: this.data.id ? '/accounts?id=' + this.data.id : '/accounts',
        method: this.data.id ? 'PUT' : 'POST',
        data: {
          ...e.detail.value,
          admin: this.data.accountData.admin,
          roleId,
          locationIds,
        }
      })
      .then(res => {
        wx.showToast({
          title: '操作成功',
          icon: 'none'

        });
        setTimeout(() => {
          wx.navigateBack({
            detal: 1
          })
        }, 1500)
      })

  }
})