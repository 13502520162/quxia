// pages/manage/toll/placeDevices.js
import fetch from '../../../../lib/fetch.js'
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
    filterParams:{},

    typesData: [],
    typesDataIndex: 0,

    chooseDevices: [],

    initChooseDevices: [] //上一页已选的设备，在获取设备列表的时候初始化已选设备
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.fetchAllDeviceTypes();
     this.setData({
       filterParams: { ...this.data.filterParams, locationId:options.id }
     })
     this.fetchPlaceDevices();

    if (options.initChooseDevices){
      this.setData({
        initChooseDevices: JSON.parse(options.initChooseDevices)
      })
    }
  },

  /**
   * 获取场地的设备
   */

  fetchPlaceDevices: function() {
    if (this.data.listLoading ) {
      return;
    }

    if (this.data.listEnd){
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/devices',
      data: {
        ...this.data.listParams,
        ...this.data.filterParams
      }
    })
      .then(res => {
        if (res.data.length < this.data.listParams.size) {
          this.setData({
            listEnd: true
          })
        }
        res.data = res.data.map( item => {
          if (this.data.initChooseDevices.includes(item.id) ){
            /**
             * 标记为已选，然后从数组中删除
             */
            item.checked = true;
            let initChooseDevices = this.data.initChooseDevices.map( id => {
               if(item.id != id) {
                 return id
               }
            });
             this.setData({
               initChooseDevices: initChooseDevices
             })
            
          }
          return item
        })
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

  /**
   * 列表触底加更多列表数据
   */
    loadMoreListData: function () {

      if (!this.data.listLoading) {
        this.setData({
          listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
        })
        this.fetchPlaceDevices();
      }
    },


  /**
   * 获取所有的设备类型
   */
  fetchAllDeviceTypes: function() {
    fetch({
      url:'/devices/types',
    })
    .then( res=> {
      res.data.unshift({ id: "", name: '全部' });
      this.setData({
        typesData: res.data
      })
    })
  },

  /**
   * 设备类型更改
   */
  onFilterDeviceChange: function(e) {
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
      typesDataIndex: e.detail.value,
      filterParams: { ...this.filterParams, typeId: this.data.typesData[e.detail.value].id }
    })
    this.fetchPlaceDevices();
  },


  /**
   * 选择设备
   */
  checkboxChange: function(e) {
     
    var listData = this.data.listData, values = e.detail.value;
    for(var i = 0, lenI = listData.length; i < lenI; ++i) {
        listData[i].checked = false;
        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (listData[i].id == values[j]) {
            listData[i].checked = true;
            break;
          }
        }
      }

    this.setData({
      chooseDevices: values,
      listData: listData
    });
  },

  /**
   * 确定所选的设备
   */
  onConfirm: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let isExist = false;  /**上一页是否存在已选的设备场地 */
    prevPage.data.devices.forEach( (item,index) => {
      if(item.placeId == this.data.filterParams.locationId){
         isExist = true;
        prevPage.data.devices[index].devices = this.data.chooseDevices;
      }
    })

    if( !isExist ){
      prevPage.data.devices.push({ placeId: this.data.filterParams.locationId, devices: this.data.chooseDevices })
    }
    wx.navigateBack({
      detal:1
    })
  } 



})