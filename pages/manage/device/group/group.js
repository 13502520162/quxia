// pages/manage/device/group/group.js
import fetch from '.../../../../../../lib/fetch.js';
import getStorePermissions from '../../../../utils/getStorePremissioin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [], 
    isShowDialog: false,
    newGroundName: '',
    dialogId: null,
    systemInfo:{},


    disEdit: true,
    disAdd: true,
    disList: true 
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          systemInfo: res
        })
      },
    })

    this.permissionFilter();
  },

  /**
 * 权限过滤
 */
  permissionFilter: function () {
    let permissions = getStorePermissions();
    //列表
    if (permissions.permissions.includes(12)) {
      this.setData({
        disList: false
      })
    }
    //添加
    if (permissions.permissions.includes(13)) {
      this.setData({
        disAdd: false
      })
    }
    //编辑
    if (permissions.permissions.includes(14)) {
      this.setData({
        disEdit: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
      isShowDialog: false,
      newGroundName: '',
      dialogId: null
    })
    this.fetchGroups();
  },

  /**
   * 获取分组列表
   */

  fetchGroups: function () {

    if (this.data.disList) {
      return;
    }

    if (this.data.listLoading ) {
      return;
    }

    if (this.data.listEnd ){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/deviceGroups',
      data: {
        ...this.data.listParams
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        this.setData({
          listData: [...this.data.listData, ...res.data]
        })
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setData({
          listLoading: false
        })
      })
  },

  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchDevices();
    }
  },

  showActionSheet: function (e) {
    const id = e.currentTarget.dataset.id;
    let itemList;
    if (this.data.systemInfo.platform == 'android') {
      itemList = ['添加设备', '编辑分组', '删除分组','取消'];
    } else {
      itemList = ['添加设备', '编辑分组', '删除分组'];
    }


    if (this.data.disEdit) {
      itemList.splice(1, 2);
    }

    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0: 
              wx.navigateTo({
                url: './selectDevices?id='+id,
              })
              break;
            case 1:
              if( !this.data.disEdit ){
                this.setData({
                  dialogId: id,
                  newGroundName: e.currentTarget.dataset.name
                });
                this.toggleDialog();
              }
              break;
            case 2:
              if( !this.data.disEdit ){
                this.fetchDelGroup(id);
              }
              break;
            default:
              break;
          }
        }
      }
    })
  },

  /**
   * 切换显示更改分组名称的对话框
   */
  toggleDialog: function () {
     this.setData({
       isShowDialog: !this.data.isShowDialog
     })
  },

  /**
   * 对话框关闭
   */

  onDialogClose: function (e) {
    if( e.detail === 'cancel' ){
      this.setData({
        newGroundName: '',
        dialogId: null
      })
    } else if( this.data.dialogId ) {
      this.fetchUpdateGroupName();
    } else {
      this.fetchAddGroup();
    }
   
    this.toggleDialog();
  },

  /**
   * 删除分组
   */
  fetchDelGroup: function ( id ) {
    fetch({
      url: '/deviceGroups?id='+id,
      method: 'delete',
      data: {
        id: id
      }
    })
    .then( res => {
       this.setData({
         listData:[],
         listEnd: false,
       },()=> {
         this.fetchGroups();
       })
    })
    .catch( err => {
      console.error( err );
    })
  },

  /**
   * 更新分组名称
   */
  fetchUpdateGroupName: function (  ) {
    fetch({
      url: '/deviceGroups?id=' + this.data.dialogId,
      method: 'put',
      data: {
        name: this.data.newGroundName
      }
    })
    .then( res => {
      this.setData({
        dialogId: null,
        newGroundName: '',
        listParams: {
          from: 0,
          size: 20
        },
        listData:[],
        listEnd: false,
      })
      this.fetchGroups();
    })
  },

  onNewGroundNameChange: function(e) {
    this.setData({
      newGroundName: e.detail
    })
  },

  /**
   * 添加分组处理
   */
  onAddGround: function() {
    this.toggleDialog();
  },

  /**
   * 发送请求添加分组
   */
  fetchAddGroup: function() {
    fetch({
      url:'/deviceGroups',
      isShowDialog: true,
      method:'post',
      data:{
        name: this.data.newGroundName
      }
    })
    .then( res =>{
       this.setData({
         newGroundName: '',
         listData:[],
         listParams: {
           from: 0,
           size: 20
         },
         listLoading: false,
         listEnd: false,
       },()=> {

         this.fetchGroups();
       })
    })
    .catch( err => {
      console.error(err);
    })

  }


})