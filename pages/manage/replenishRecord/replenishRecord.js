import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showFilterMenue: false,
    filterParams: {
      locationId: '',
    },


    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    recordCount: 0,

    placesData: [],
    placesDataIndex: 0,

  },

  /**
   * 
   */
  toggleFilterMenue: function () {
    this.setData({
      showFilterMenue: !this.data.showFilterMenue
    })
  },

  /**
 * 设备ID改变
 * query 对应设备id 
 */
  onDeviceIdChange: function (e) {
    this.setData({
      filterParams: { ...this.data.filterParams, query: e.detail.value }
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.id){
        this.onDeviceIdChange({detail:{value:options.id}});
      }
      this.fetchInventoryRecordCount();
      this.fetchListData();
      this.fetchPlaces();
  },



  /**
   * 记录总数
   */

  fetchInventoryRecordCount: function () {
    fetch({
      url: '/restocks/count',
      data: {
        ...this.data.filterParams
      }
    })
      .then(res => {
        this.setData({
          recordCount: res.data
        })
      })
  },

  /**
   * 获取列表
   */

  fetchListData: function () {

    if (this.data.listLoading) {
      return;
    }


    if (this.data.listEnd) {
      return;
    }

    this.setData({
      listLoading: true
    })

    fetch({
      url: '/restocks/audits',
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
        res.data = res.data.map(item => {
          item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm')
          return item;
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
   * 获取所有的场地
   */
  fetchPlaces: function () {
    fetch({
      url: '/locations/select'
    })
      .then(res => {
        res.data.unshift({ id: "", name: '全部' });
        this.setData({
          placesData: res.data
        })
      })
  },




  /**
   * 场地更改
   */
  onFilterPlaceChange: function (e) {
    this.setData({
      placesDataIndex: e.detail.value,
      filterParams: { ...this.data.filterParams, locationId: this.data.placesData[e.detail.value].id }
    })
  },



  onSubmit: function () {
    this.setData({
      listEnd: false,
      showFilterMenue: false,
      listData: []
    }, () => {
      this.fetchListData();
      this.fetchInventoryRecordCount();
    })
  },

  /**
   * 重置弹框的数据
   */
  resetPopData: function () {
    this.setData({
      filterParams: {
        locationId:'',
        query: ''
      },
      types: this.data.types.map(item => {
        item.selected = false;
        return item
      })
    })

    this.onFilterPlaceChange({ detail: { value: 0 } })
  },
  /**
   * 列表触底加更多列表数据
   */
  loadMoreListData: function () {

    if (!this.data.listLoading) {
      this.setData({
        listParams: { ...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size }
      })
      this.fetchListData();
    }
  },

  /**
   * 列表每一项操作
   */
  showActionSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './recordDetails?id=' + id,
    })
  }
})