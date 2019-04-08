// pages/manage/account/accounts/details.js
import fetch from '../../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    permissionsList:[
      {
        permission: { name: '统计报表', value: '1' },
        subpermissions:[
          { name: '运营统计', value: '2' },
          { name: '收益统计', value: '3' },
          { name: '场地统计', value: '4' },
          { name: '设备统计', value: '5' },
          { name: '订单统计', value: '6' }
        ]
      },
      {
        permission: { name: '设备管理', value: '7' },
        subpermissions: [
          { name: '设备列表', value: '8' },
          { name: '设备授权', value: '9' },
          { name: '设备编辑', value: '10' }
        ]
      },
      {
        permission: { name: '分组管理', value: '11' },
        subpermissions: [
          { name: '分组列表', value: '12' },
          { name: '新建分组', value: '13' },
          { name: '分组编辑', value: '14' }
        ]
      },
      {
        permission: { name: '场地管理', value: '15' },
        subpermissions: [
          { name: '场地列表', value: '16' },
          { name: '新增场地', value: '17' },
          { name: '场地编辑', value: '18' }
        ]
      },
      {
        permission: { name: '套餐管理', value: '19' },
        subpermissions: [
          { name: '套餐列表', value: '20' },
          { name: '新增套餐', value: '21' },
          { name: '套餐编辑', value: '22' }
        ]
      },
      {
        permission: { name: '商品资料管理', value: '23' },
        subpermissions: [
          { name: '商品列表', value: '24' },
          { name: "商品分类管理" , value: '91' },
          { name: '新建商品', value: '25' },
          { name: '编辑商品', value: '26' }
        ]
      },
      {
        permission: { name: '货道管理', value: '27' },
        subpermissions: [
          // { name: '货道方案列表', value: '28' },
          { name: "货道配货", value: '28' },
          { name: '新建货道方案', value: '29' },
          { name: '编辑货道方案', value: '30' },
          { name: '货道状态', value: '54' }
        ]
      },
      {
        permission: { name: '库存管理', value: '31' },
        subpermissions: [
          { name: '库存列表', value: '32' },
          { name: '入库', value: '33' },
          { name: '退货', value: '34' },
          { name: '发货', value: '35' },
          { name: '库存记录', value: '36' }
        ]
      },
      // {
      //   permission: { name: '合伙人管理', value: '60' },
      //   subpermissions: [
      //     { name: "合伙人列表", value: '61' }
      //   ]
      // },
      {
        permission: { name: '用户管理', value: '81' },
        subpermissions: [
          { name: "用户列表", value: '82' },
          { name: "充值管理", value: '83' },
          { name: "会员卡管理", value: '84' }
        ]
      },
      {
        permission: { name: '分润管理', value: '37' },
        subpermissions: [
          { name: '设备分润', value: '38' },
          { name: '场地分润', value: '38' },
          { name: '新建分润方案', value: '39' },
          { name: '编辑分润方案', value: '40' }
        ]
      },
      {
        permission: { name: '补货管理', value: '41' },
        subpermissions: [
          { name: '补货记录', value: '42' },
          { name: '补货', value: '43' }
        ]
      },
      {
        permission: { name: '广告管理', value: '55' },
        subpermissions: [
          { name: '素材管理', value: '56' },
          { name: '广告投放', value: '57' }
        ]
      },
      {
        permission: { name: '子账号管理', value: '44' },
        subpermissions: [
          { name: '角色列表', value: '45' },
          { name: '新建角色', value: '46' },
          { name: '编辑角色', value: '47' },
          { name: '子账号列表', value: '48' },
          { name: '新建子账号', value: '49' },
          { name: '编辑子账号', value: '50' }
        ]
      },
      {
        permission: { name: '营销中心', value: '71' },
        subpermissions: [
          { name: '优惠券管理', value: '72' },
          { name: '新手有礼', value: '73' },
          { name: '促销活动', value: '74' },
          { name: '支付有礼', value: '75' },
          { name: '幸运免单', value: '76' },
          { name: '抽奖活动', value: '77' }
        ]
      },
      {
        permission: { name: '我的', value: '' },
        subpermissions: [
          { name: '钱包', value: '51' },
          { name: '提现', value: '52' }
        ]
      }
    ],

    roleData: {
      id:'',
      name: '',
      permissions:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.id){
        this.setData({
          roleData: { ...this.data.roleData, id: options.id }
        })
        this.fetchDetails(options.id);
      }
  },

  onNameChange: function (e) {
     this.setData({
       roleData: { ...this.data.roleData, name: e.detail.value}
     })
  },

  submit: function (e) {

    let permissions = [];
    Object.keys(e.detail.value).map( key => {
      if( e.detail.value[key] ){
        permissions.push(key)
      }
    });
    fetch({
      url: this.data.roleData.id ? '/roles?id=' + this.data.roleData.id : '/roles',
      method: this.data.roleData.id ? 'PUT' : 'POST',
      data: {
        name: this.data.roleData.name,
        permissions: permissions
      }
    })
    .then( ()=> {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout( ()=> {
          wx.navigateBack({
            detal:1
          })
        },1500)
    })
    .catch( err => {
      console.error( err );
    })
  },

  /**
   * 获取角色详情
   */
  fetchDetails: function() {
    fetch({
      url: '/roles/detail?id=' + this.data.roleData.id
    })
    .then( res =>{
      let permissionsList = this.data.permissionsList;
        permissionsList = permissionsList.map( item => {
        
          let permission = {
             name: item.permission.name,
             value: item.permission.value,
             checked: res.data.permissions.includes(Number(item.permission.value))
          }

          let subpermissions = item.subpermissions.map( subpermission => {
            if (res.data.permissions.includes(Number(subpermission.value)) ){
                subpermission.checked = true;
             }
            return subpermission;
           });

          return {
            permission: permission,
            subpermissions: subpermissions
          }
        });

        this.setData({
          permissionsList: permissionsList,
          roleData: {...this.data.roleData,...res.data}
        })
    })
    .catch( err => {
      console.error( err );
    })
  },

  /**
   * 总分类权限更改
   */
  onPermissionChange: function(e) {
    let permissionsList = this.data.permissionsList;
    if( !e.detail.value ) {
      let subpermissions = permissionsList[e.currentTarget.dataset.index].subpermissions ;
      subpermissions = subpermissions.map( item => {
        item.checked = false;
        return item;
      });
      permissionsList[e.currentTarget.dataset.index].subpermissions = subpermissions;
      permissionsList[e.currentTarget.dataset.index].permission.checked = false;
    } else {
      permissionsList[e.currentTarget.dataset.index].permission.checked = true;
    }
    this.setData({
      permissionsList: permissionsList
    })
  },

  /**
   * 子权限更改
   */
  onSubPermissionChange: function (e) {
    let permissionsList = this.data.permissionsList;
    permissionsList[e.currentTarget.dataset.index].subpermissions[e.currentTarget.dataset.subindex].checked = e.detail.value;
    this.setData({
      permissionsList: permissionsList
    })
  }

})