// pages/manage/manage.js
import getStorePermissions from '../../utils/getStorePremissioin.js';
let permissions = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 管理功能菜单
     */
    funcMenu: [{
        title: {
          name: "统计报表",
          permission: 1,
          hide: true
        },
        items: [{
            name: "运营统计",
            icon: "../../assets/images/analysis.png",
            pageUrl: '/pages/index/analysis',
            permission: 2,
            hide: true
          },
          {
            name: "收入统计",
            icon: "../../assets/images/income.png",
            pageUrl: '/pages/manage/analysis/income/index',
            permission: 3,
            hide: true
          },
          {
            name: "场地统计",
            icon: "../../assets/images/place.png",
            pageUrl: '/pages/manage/analysis/place/index',
            permission: 4,
            hide: true
          },
          {
            name: "设备统计",
            icon: "../../assets/images/devices.png",
            pageUrl: '/pages/manage/analysis/device/index',
            permission: 5,
            hide: true
          },
          {
            name: "免单统计",
            icon: "../../assets/images/freeSingleStatistics.png",
            pageUrl: '/pages/manage/analysis/freeSingleStatistics/index',
            permission: 6,
            hide: true
          },
          {
            name: "商品分析",
            icon: "../../assets/images/commodityAnalysis.png",
            pageUrl: '/pages/manage/analysis/commodityAnalysis/index',
            permission: 6,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "设备管理",
          permission: 7,
          hide: true
        },
        items: [{
            name: "设备列表",
            icon: "../../assets/images/deviceList.png",
            pageUrl: './device/list/list',
            permission: 8,
            hide: true
          },
          {
            name: "设备分组",
            icon: "../../assets/images/deviceGroup.png",
            pageUrl: './device/group/group',
            permission: 12,
            hide: true
          },
        ]
      },
      // {
      //   title: { name: "分组管理", permission: 11, hide: true },
      //   items: [
      //     {
      //       name: "设备分组",
      //       icon: "../../assets/images/deviceGroup.png",
      //       pageUrl: './device/group/group',
      //       permission: 12,
      //       hide: true
      //     },
      //   ]
      // },
      {
        title: {
          name: "套餐管理",
          permission: 19,
          hide: true
        },
        items: [{
          name: "收费套餐",
          icon: "../../assets/images/tollIcon.png",
          pageUrl: './toll/toll',
          permission: 20,
          hide: true
        }]
      },
      {
        title: {
          name: "商品资料管理",
          permission: 23,
          hide: true
        },
        items: [{
            name: "商品列表",
            icon: "../../assets/images/commodity.png",
            pageUrl: './commodity/list',
            permission: 24,
            hide: true
          },
          {
            name: "商品分类",
            icon: "../../assets/images/commodityClassification.png",
            pageUrl: './commodity/commodityClassification/commodityClassification',
            permission: 91,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "场地管理",
          permission: 15,
          hide: true
        },
        items: [{
          name: "场地列表",
          icon: "../../assets/images/placeList.png",
          pageUrl: './place/list/list',
          permission: 16,
          hide: true
        }]
      },
      {
        title: {
          name: "货道管理",
          permission: 27,
          hide: true
        },
        items: [{
            name: "货道配货",
            icon: "../../assets/images/shelfs.png",
            pageUrl: './shelfs/list',
            permission: 28,
            hide: true
          },
          {
            name: "货道状态",
            icon: "../../assets/images/cargoState.png",
            pageUrl: './shelfsStatus/list',
            permission: 54,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "库存管理",
          permission: 31,
          hide: true
        },
        items: [{
          name: "库存列表",
          icon: "../../assets/images/inventoryList.png",
          pageUrl: './inventory/list',
          permission: 32,
          hide: true
        }]
      },
      // {
      //   title: {
      //     name: "合伙人管理",
      //     permission: 60,
      //     hide: true
      //   },
      //   items: [{
      //     name: "合伙人列表",
      //     icon: "../../assets/images/partnerList.png",
      //     pageUrl: './partner/list/list',
      //     permission: 61,
      //     hide: false
      //   }, ]
      // }, 
      {
        title: {
          name: "用户管理",
          permission: 81,
          hide: true
        },
        items: [{
            name: "用户列表",
            icon: "../../assets/images/tollIcon.png",
            pageUrl: './userManagement/userManagement',
            permission: 82,
            hide: true
          },
          {
            name: "充值管理",
            icon: "../../assets/images/rechargeManagement.png",
            pageUrl: './rechargeManagement/rechargeManagement',
            permission: 83,
            hide: true
          },
          {
            name: "会员卡",
            icon: "../../assets/images/coupon.png",
            pageUrl: './membershipCard/membershipCard',
            permission: 84,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "分润管理",
          permission: 37,
          hide: true
        },
        items: [
          // {
          //   name: "分润列表",
          //   icon: "../../assets/images/royaltyList.png",
          //   pageUrl: './royalty/list',
          //   permission: 38,
          //   hide: true
          // }, 
          {
            name: "设备分润",
            icon: "../../assets/images/equipmentDistribution.png",
            pageUrl: './profitSharing/equipmentDistribution/equipmentDistribution',
            permission: 38,
            hide: true
          },
          {
            name: "场地分润",
            icon: "../../assets/images/steDistribution.png",
            pageUrl: './profitSharing/siteDistribution/siteDistribution',
            permission: 38,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "补货",
          permission: 41,
          hide: true
        },
        items: [{
            name: "扫码补货",
            icon: "../../assets/images/scan.png",
            pageUrl: './replenish/replenish',
            permission: 43,
            hide: true
          },
          {
            name: "补货记录",
            icon: "../../assets/images/replenishRecord.png",
            pageUrl: './replenishRecord/replenishRecord',
            permission: 42,
            hide: true
          }
          // ,
          // {
          //   name: "大售货机补货",
          //   icon: "../../assets/images/replenishRecord.png",
          //   pageUrl: './bigVendingMachineReplenish/index?sence=1',
          //   permission: "",
          //   hide: false
          // }
        ]
      },
      {
        title: {
          name: "子账号管理",
          permission: 44,
          hide: true
        },
        items: [{
            name: "角色",
            icon: "../../assets/images/roles.png",
            pageUrl: './account/roles/list',
            permission: 45,
            hide: true
          },
          {
            name: "账号",
            icon: "../../assets/images/account.png",
            pageUrl: './account/accounts/list',
            permission: 48,
            hide: true
          }
        ]
      },
      // {
      //   title: {
      //     name: "自动售货机货道管理",
      //     permission: "",
      //     hide: true
      //   },
      //   items: [{
      //     name: "货道配货",
      //     icon: "../../assets/images/shelfs.png",
      //     pageUrl: './bigVendingMachineShelfs/list',
      //     permission: '',
      //     hide: true
      //   }]
      // },
      // {
      //   title: {
      //     name: "共享广告机",
      //     permission: "",
      //     hide: true
      //   },
      //   items: [{
      //       name: "素材管理",
      //       icon: "../../assets/images/resources.png",
      //       pageUrl: './shareAd/resource/index',
      //       permission: "",
      //       hide: true
      //     },
      //     {
      //       name: "投放广告",
      //       icon: "../../assets/images/ads.png",
      //       pageUrl: './shareAd/putting/index',
      //       permission: "",
      //       hide: true
      //     },
      //     {
      //       name: "套餐管理",
      //       icon: "../../assets/images/tolls.png",
      //       pageUrl: './shareAd/toll/index',
      //       permission: "",
      //       hide: true
      //     }
      //   ]
      // },
      {
        title: {
          name: "广告管理",
          permission: 55,
          hide: true
        },
        items: [{
            name: "素材管理",
            icon: "../../assets/images/resources.png",
            pageUrl: './adManage/resource/index',
            permission: 56,
            hide: true
          },
          {
            name: "广告计划",
            icon: "../../assets/images/ads.png",
            pageUrl: './adManage/plans/index',
            permission: 57,
            hide: true
          }
        ]
      },
      {
        title: {
          name: "营销中心",
          permission: 71,
          hide: true
        },
        items: [{
            name: "优惠券",
            icon: "../../assets/images/coupon.png",
            pageUrl: './coupon/coupon',
            permission: 72,
            hide: true
          },
          {
            name: "新手有礼",
            icon: "../../assets/images/newManners.png",
            pageUrl: './noviceCourtesy/noviceCourtesy',
            permission: 73,
            hide: true
          },

          {
            name: "促销活动",
            icon: "../../assets/images/salesPromotion.png",
            pageUrl: './salesPromotion/salesPromotion',
            permission: 74,
            hide: true
          },
          {
            name: "支付有礼",
            icon: "../../assets/images/paymentOfCourtesy.png",
            pageUrl: './paymentOfCourtesy/paymentOfCourtesy',
            permission: 75,
            hide: true
          },
          {
            name: "幸运免单",
            icon: "../../assets/images/luckyFree.png",
            pageUrl: './luckyFree/luckyFree',
            permission: 76,
            hide: true
          },
          {
            name: "抽奖活动",
            icon: "../../assets/images/luckyDraw.png",
            pageUrl: './luckyDraw/luckyDraw',
            permission: 77,
            hide: true
          }
        ]
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //根据权限，进行功能过滤；
    permissions = getStorePermissions();
    if (permissions != '') {
      if (permissions.admin) {
        let funcMenu = this.data.funcMenu.map(item => {
          item.title.hide = false;
          item.items = item.items.map(subItem => {
            subItem.hide = false
            return subItem;
          })
          return item;
        });

        this.setData({
          funcMenu: funcMenu
        })
      } else {
        let funcMenu = this.data.funcMenu.map(item => {
          if (permissions.permissions.includes(item.title.permission)) {
            item.title.hide = false;
          }
          item.items = item.items.map(subItem => {
            if (permissions.permissions.includes(subItem.permission)) {
              subItem.hide = false
            }
            return subItem;
          })
          return item;
        });
        this.setData({
          funcMenu: funcMenu
        })
      }
    }
  },

  /**
   * 功能页跳转
   */
  gotoPage: function(e) {
    let url = e.currentTarget.dataset.url;
    if (url == './replenish/replenish') {
      wx.scanCode({
        success: (res) => {
          wx.navigateTo({
            url: `${url}?sence=${res.result}`,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }

  }


})