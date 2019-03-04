var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import fetch from '../../../../lib/fetch.js';
import qiniuUploader from '../../../../lib/qiniuUploader.js'
Page({
  data: {
    tabs: ["视频", "图片"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    videoUrl: '',
    isEdit: false,
    listParams: {
      from: 0,
      size: 20
    },
    listLoading: false,
    listEnd: false,
    listData: [],

    filterParams: {
      type: 'VIDEO'
    }
  },
  onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onLoad: function () {

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.fetchResourceList();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    switch (Number(e.currentTarget.id)) {
      case 0:
        this.setData({
          filterParams: { ...this.data.filterParams, type: 'VIDEO' }
        });
        break;
      case 1:
        this.setData({
          filterParams: { ...this.data.filterParams, type: 'IMAGE' }
        });
        break;
      default:
        break;
    }
    this.setData({
      listParams: {
        from: 0,
        size: 20
      },
      listLoading: false,
      listEnd: false,
      listData: [],
    });
    this.fetchResourceList();
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
   * 获取列表数据
   */
  fetchResourceList: function () {
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
        ...this.data.filterParams
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

  /**
   * 上传资源
   */
  onUploadResource: function () {

    this.initQiniu().then(options => {
      if (this.data.filterParams.type == 'IMAGE' ){
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
  uploadVideo: function() {
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
                  that.fetchResourceList();
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
          .then( () => {
              that.setData({
                listParams: {
                  from: 0,
                  size: 20
                },
                listLoading: false,
                listEnd: false,
                listData: []
              })
              that.fetchResourceList();
            })
          })
      }
    })
  },

  /**
   * 播放视频
   */
  playVideo: function(url) {
    this.setData({
      isShowVideo: true,
      videoUrl: url
    })
    this.videoContext.play();
  },
  

  /**
   * 关闭视频
   */
  closeVideo: function (){
    this.setData({
      isShowVideo: false,
    })
    this.videoContext.pause();
  },

  /**
   * 预览图片
   */
  showImage: function (imgUrl) {
    wx.previewImage({
      urls: [imgUrl],
    })
  },

  /**
   * 切换编辑
   */
  toggleEdit: function () {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  /**
   * 切换选择
   */
  toggleChecked: function (id) {
    let listData = this.data.listData;
    for (let i = 0; i < listData.length; i++){
      if( listData[i].id == id ){
        listData[i].checked = !listData[i].checked
        break;
      }
    }
    this.setData({
      listData: listData
    })
  },

  /**
   * 视频点击
   */
  onVideoItemHandle: function (e){
    if( this.data.isEdit ){
      this.toggleChecked(e.currentTarget.dataset.id)
    } else {
      this.playVideo( e.currentTarget.dataset.url );
    }
  },

  onImageItemHandle: function (e) {
    if (this.data.isEdit) {
      this.toggleChecked(e.currentTarget.dataset.id)
    } else {
      this.showImage(e.currentTarget.dataset.url);
    }
  },

  /**
   * 删除资源
   */
  delResource: function () {
      let checkedIds = [];
      this.data.listData.forEach( item => {
        if( item.checked ){
          checkedIds.push(item.id);
        }
      })
      fetch({
        url:'/adpub/resources',
        isShowLoading: true,
        method: 'delete',
        data: {
          ids: checkedIds
        }
      })
      .then( res => {
        this.setData({
          listParams: {
            from: 0,
            size: 20
          },
          listLoading: false,
          listEnd: false,
          listData: []
        })
        this.fetchResourceList();
      })
      .catch( err => {
        console.error(err);
      })
  },




  /**
   * 左下角按钮点击
   */
  onBottomLeftHandle: function () {
    if( this.data.isEdit ){
      this.delResource();
    } else {
      this.onUploadResource();
    }
  },

  /**
   * 右下角按钮点击
   */
  onBottomRightHandle: function () {
      this.toggleEdit();
  }


});