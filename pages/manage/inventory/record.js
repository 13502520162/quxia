// pages/manage/device/list/list.js
import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/moment.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showFilterMenue: false,
    filterParams: {
      start: '',
      end: '',
      types: '',
      locationId: '',
      productId: '',
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


    types: [
      { name: '入库', value: 'STOCKIN', selected: false },
      { name: '补货', value: 'RESTOCK', selected: false },
      { name: '退货', value: 'RETURN', selected: false },
      { name: '发货', value: 'TRANSFER', selected: false }
    ]
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
   * 类型选择更改
   */
  onTypesChange: function (e) {
    let types = this.data.types.map(item => {
      if (item.value === e.target.dataset.value) {
        item.selected = !item.selected ;
      }
      return item;
    })

    let filterTypes = [];

    types.forEach( item => {
      if (item.selected) { 
        filterTypes.push( item.value )
       }
    })
     

    this.setData({
      types: types,
      filterParams: {
        ...this.data.filterParams,
        types: filterTypes.join(',')
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.locationId && options.productId) {
      this.setData({
        filterParams: { ...this.data.filterParams, locationId: options.locationId, productId: options.productId  }
      })
      this.fetchInventorySummary();
      this.fetchInventoryRecordCount();
      this.fetchListData();
      this.fetchPlaces();
    }
  },

  /**
   * 获取汇总信息
   */
  fetchInventorySummary: function () {
    fetch({
      url: '/inventory/totalStock',
      data: {
        productId: this.data.filterParams.productId,
        locationId: this.data.filterParams.locationId 
      }
    })
      .then(res => {
        this.setData({
          summaryData: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  },


  /**
   * 记录总数
   */

  fetchInventoryRecordCount: function () {
    fetch({
      url: '/inventory/audits/count',
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
      url: '/inventory/audits',
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
        res.data = res.data.map(item=> {
          switch(item.type){
            case 'STOCKIN':
              item.type = "入库";
              break;
            case 'RETURN':
              item.type = '退货';
              break;
            case 'TRANSFER':
              item.type = '发货';
              break;
            case 'RESTOCK':
              item.type = '补货';
              break;
            default:
              break;
          }
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
 * 日期选择
 */

  onDateChange: function (e) {
    let type = e.currentTarget.dataset.type;
    let date = e.detail.value;
    if (type == "start") {
      this.setData({
        filterParams: { ...this.data.filterParams, start: date }
      })
    } else if (type == "end") {
      this.setData({
        filterParams: { ...this.data.filterParams, end: date }
      })
    }
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
      listParams: {
        from: 0,
        size: 20
      },
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
        start: '',
        end: '',
        types: "", 
        query: ''
      },
      types: this.data.types.map( item => {
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
      url: './recordDetails?id='+id,
    })
  }
})