// pages/manage/shareAd/putting/selectResources.js
import fetch from '../../../../lib/fetch.js'
import qiniuUploader from '../../../../lib/qiniuUploader.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dataType:'',
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataType: options.dataType
    })
    this.fetchResourcesList();
  },

  /**
   * 获取资源列表数据
   */
  fetchResourcesList: function(){
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
      url: '/adpub/resources',
      data: {
        ...this.data.listParams,
        type: this.data.dataType
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

  /**初始化七牛云数据 */
  initQiniu: function () {
    return new Promise((resolve, reject) => {
      fetch({ url: '/api/qiniu/upToken', method: 'post' })
        .then(res => {
          if (res.data) {
            let options = {
              region: 'SCN',
              uptoken: res.data,
              domain: 'https://cdn.renqilai.com/'
            };
            qiniuUploader.init(options);
            resolve(options);
          } else {
            reject('获取七牛云token失败');
          }
        })
        .catch(err => {
          console.error(err);
        })
    })
  },


  /**
   * 切换选择
   */
  toggleChecked: function (e) {
    let id = e.currentTarget.dataset.id;
    let listData = this.data.listData;
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].id == id) {
        listData[i].checked = !listData[i].checked
        break;
      }
    }
    this.setData({
      listData: listData
    })
  },



  /**
   * 上传资源
   */
  onUploadResource: function () {

    this.initQiniu().then(options => {
      if (this.data.dataType == 'IMAGE') {
        this.uploadImage();
      } else {
        this.uploadVideo();
      }
    })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 上传视频
   */
  uploadVideo: function () {
    let that = this;
    wx.chooseVideo({
      count: 1,
      success: res => {
        let filePath = res.tempFilePath;
        // 交给七牛上传
        let that = this;
        qiniuUploader.upload(filePath, (videoRes) => {
          qiniuUploader.upload(res.thumbTempFilePath, (posterRes) => {
            fetch({
              url: '/adpub/resources',
              method: 'post',
              data: {
                url: videoRes.imageURL,
                type: 'VIDEO',
                size: videoRes.fsize,
                key: videoRes.key,
                thumb: posterRes.imageURL
              }
            })
              .then(res => {
                wx.showToast({
                  title: '上传成功'
                })

                that.setData({
                  listParams: {
                    from: 0,
                    size: 20
                  },
                  listLoading: false,
                  listEnd: false,
                  listData: []
                })
                that.fetchResourcesList();
              })
              .catch(err => {
                console.error(err);
              })
          })
        });
      }
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        let filePath = res.tempFilePaths[0];
        // 交给七牛上传
        let that = this;
        qiniuUploader.upload(filePath, (res) => {
          fetch({
            url: '/adpub/resources',
            method: 'post',
            data: {
              url: res.imageURL,
              type: 'IMAGE',
              size: res.fsize,
              key: res.key,
            }
          })
            .then(() => {
              that.setData({
                listParams: {
                  from: 0,
                  size: 20
                },
                listLoading: false,
                listEnd: false,
                listData: []
              })
              that.fetchResourcesList();
            })
        })
      }
    })
  },

  /**
   * 确定
   */
  onComfirm: function () {
    let pages = getCurrentPages();
    let prePage = pages[pages.length -2 ];
    let selectedUrls = [];
    this.data.listData.forEach( item => {
      if( item.checked ){
        selectedUrls.push( item.url )
      }
    })

    prePage.setData({
      adData: { ...prePage.data.adData, resources: selectedUrls }
    })

    wx.navigateBack({
      detal:1
    })
  
  }

})