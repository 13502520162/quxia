import fetch from "../../../../lib/fetch.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        groupId: null,
        listParams: {
            from: 0,
            size: 20
        },
        query: '',
        listLoading: false,
        listEnd: false,
        listData: [],
        filterParams: {},
        chooseDevices: [],
        inputShowed: false,
        inputVal: "",

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            filterParams: {typeId: options.id}
        });
        this.fetchDevices();

        /**
         * 初始化已选设备
         */

        let pages = getCurrentPages();
        let prepage = pages[pages.length - 2];
        this.setData({
            chooseDevices: prepage.data.adData.deviceIds
        })

    },

    /**
     * 获取设备
     */

    fetchDevices: function () {
        if (this.data.listLoading && this.data.listEnd) {
            return;
        }

        this.setData({
            listLoading: true
        })

        fetch({
            url: '/devices',
            data: {
                ...this.data.listParams,
                ...this.filterParams,
                query: this.data.inputVal
            }
        })
            .then(res => {
                if (res.data.length < this.data.listParams.size) {
                    this.setData({
                        listEnd: true
                    })
                }

                res.data.map(item => {
                    if (this.data.chooseDevices.includes(item.id)) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
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
     * 列表触底加更多列表数据
     */
    loadMoreListData: function () {

        if (!this.data.listLoading) {
            this.setData({
                listParams: {...this.data.listParams, from: this.data.listParams.from + this.data.listParams.size}
            })
            this.fetchDevices();
        }
    },


    /**
     * 选择设备
     */
    checkboxChange: function (e) {
        var add = e.detail.value.length > 0, id = e.target.dataset.id, chooseDevices = this.data.chooseDevices || [];

        var listData = this.data.listData;

        if (add) {
            chooseDevices.push(id);
        } else {
            var index = chooseDevices.indexOf(id);
            if (index !== -1) {
                chooseDevices.splice(index, 1);
            }
        }

        for (var i = 0, lenI = listData.length; i < lenI; ++i) {
            listData[i].checked = chooseDevices.indexOf(listData[i].id) !== -1;

        }


        this.setData({
            chooseDevices: chooseDevices,
            listData: listData
        });
    },

    /**
     * 确定所选的设备
     */
    onConfirm: function () {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];

        prePage.setData({
            adData: {...prePage.data.adData, deviceIds: this.data.chooseDevices}
        })

        wx.navigateBack({
            detal: 1
        })


    },

    /**
     * 搜索框搜索
     */
    searchInputConfirm: function () {
        this.setData({
            listParams: {
                from: 0,
                size: 20
            },
            listLoading: false,
            listEnd: false,
            listData: []
        }, () => {
            this.fetchDevices();
        })
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        this.searchInputConfirm();
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }


})