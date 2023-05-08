Page({
    data: {
        "username": null,
        "password": null,
        "id": "",
        "userid": "",
        "nickname": "登录",
        "userpicture": "/icon/admin.png",
        "level": 0,
        "chuzhinum": 0,
        "projectlist": ["民生", "人保", "正印", "伍捌", "泰隆", "通用","中睿汇鑫存量资产", "其他"],
        "projectlistindex": 0,
        "projectlistpop": false,
    },
    onShow(options) {
        let that = this
        wx.setVisualEffectOnCapture({
            visualEffect: 'hidden',
            success: (res) => {
                console.log(res)
            },
            fail: (err) => {
                console.log(err)
            },
            complete: (res) => {
                console.log(res)
            }
        })

        //进入首页看有无token
        wx.getStorage({
            key: 'token',
            success: (res) => {
                that.setData({ 'token': res.data })
                let token = res.data
                wx.getStorage({
                    key: 'id',
                    success: (res) => {
                        that.setData({ 'id': res.data })
                        let id = res.data
                        wx.getStorage({
                            key: 'nickname',
                            success: (res) => {
                                that.setData({ 'nickname': res.data })
                                wx.getStorage({
                                    key: 'level',
                                    success: (res) => {
                                        that.setData({ 'level': res.data })
                                        wx.request({
                                            url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
                                            data: {
                                                "size": 1000, //分页参数
                                                "page": 1, //分页参数
                                                "userId": id,
                                                "keyword": "",
                                                "group": "",
                                                "orderByPrice": 0,
                                                "orderByPriceType": 0,
                                                'manageWay': '',
                                            },
                                            header: {
                                                'content-type': 'application/json',
                                                'token': token
                                            },
                                            method: 'POST',
                                            dataType: 'json',
                                            success: (res) => {
                                                console.log(res);
                                                if (res.data.data != null) {
                                                    let chuzhinum = res.data.data.length
                                                    that.setData({ chuzhinum: chuzhinum })
                                                }
                                                else {
                                                    that.setData({ chuzhinum: 0 })
                                                }

                                            },
                                            fail: (err) => { console.log(err); },
                                            complete: () => { }
                                        });
                                    },
                                    fail: () => { },
                                })
                            },
                            fail: () => { },
                        })
                    },
                    fail: () => { },
                })
            },
            fail: () => { },
        })

    },

    onLoad(options) {
    },

    tuichudenglu(e) {
        wx.clearStorage()
        this.setData({
            "id": "",
            "userid": "",
            "nickname": "登录",
            "level": 0
        })
        wx.navigateTo({
            url: '../head/head',
        })
    },
    chuzhishenhe(e) {
        let that = this
        if (that.data.level == 1) {
            wx.navigateTo({
                url: '../chuzhishenhe/chuzhishenhe',
            })

        }
        else {
            wx.showModal({
                title: '权限不足',
                showCancel: false,
                content: '你没有权限访问',
                success: function (res) { }
            })
        }
    },
    adminpeople(e) {
        wx.navigateTo({
            url: '../adminpeople/adminpeople',
        })
    },
    noopearte(e) {
        wx.showModal({
            title: '权限不足',
            showCancel: false,
            content: '你没有权限访问',
            success: function (res) { }
        })
    },
    download() {
        const title = 'excel下载链接'
        const content = "https://xcx.fjdayixin.cn:51608/excel/download/all"
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            confirmText: '复制',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击复制')
                    wx.setClipboardData({
                        data: content,
                        success: (res) => {
                            wx.showToast({
                                title: '复制成功',
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })
    },
    choosefile() {
        let that = this
        wx.chooseMessageFile({
            count: 5,
            type: 'file',
            success(res) {
                let tempFilePaths = res.tempFiles
                console.log(tempFilePaths);
                for (let i = 0; i < tempFilePaths.length; i++) {
                    wx.uploadFile({
                        url: 'https://xcx.fjdayixin.cn:51608/excel/upload',
                        filePath: tempFilePaths[i].path,
                        name: 'file',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charse=UTF-8',
                            
                        },
                        formData: {
                            token: that.data.token
                        },
                        success(res) {
                          let result=JSON.parse(res.data)
                            if (i == tempFilePaths.length - 1) {
                                if (res.statusCode == 500) {
                                    wx.showToast({
                                        title: '上传失败',
                                        icon: 'error',
                                    })
                                }
                                else if (result.code == 301) {
                                    let datas=result.data
                                    let str=""
                                    for (let i = 0; i < datas.length; i++) {
                                        str += datas[i] + ",";
                                      }
                                     datas= str.substring(0, str.length - 1);
                                    wx.showModal({
                                        title: "上传数据重复",
                                        content:datas,
                                        showCancel:false,
                                        success: (res) => {
                                      
                                        },
                                        fail: (err) => {
                                
                                        }
                                      })
                                      
                                }
                                else {
                                    wx.showToast({
                                        title: '上传成功',
                                    })
                                }
                            }

                        },
                    })
                }

            }
        })
    },
    choosefilechange() {
        let that = this
        wx.chooseMessageFile({
            count: 5,
            type: 'file',
            success(res) {
                let tempFilePaths = res.tempFiles
                console.log(tempFilePaths);
                for (let i = 0; i < tempFilePaths.length; i++) {
                    wx.uploadFile({
                        url: 'https://xcx.fjdayixin.cn:51608/excel/upload/new',
                        filePath: tempFilePaths[i].path,
                        name: 'file',
                        header: {
                            'content-type': 'multipart/form-data',
                            'token': that.data.token
                        },
                        success(res) {
                            console.log(tempFilePaths[i].path);
                            console.log(res, 'daoru');
                            if (i == tempFilePaths.length - 1) {
                                if (res.statusCode == 500) {
                                    wx.showToast({
                                        title: '上传失败',
                                        icon: 'error',
                                    })
                                }
                                else {
                                    wx.showToast({
                                        title: '更新成功',
                                    })
                                }
                            }
                        },
                    })
                }
            }
        })
    },

    deletefile(e) {
        console.log(e);
        let that = this
        if (that.data.level == 1) {
            that.setData({ 'projectlistpop': !that.data.projectlistpop })
        }
        else {
            wx.showModal({
                title: '权限不足',
                showCancel: false,
                content: '你没有权限访问',
                success: function (res) { }
            })
        }

    },
    sprojectlistindex(e) { this.setData({ projectlistindex: e.detail.value }) },
    projectlistchangeconfirm(e) {
        let that = this
        console.log(that.data.projectlist[that.data.projectlistindex]);
        wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/delete/projects?name='+that.data.projectlist[that.data.projectlistindex],
            header: {
                'content-type': 'application/json',
                'token': that.data.token
            },
            method: 'POST',
            dataType: 'json',
            success: (res) => {
                console.log(res);
                wx.showModal({
                    title: '删除成功',
                    showCancel: false,
                    content: '',
                    success: function (res) {
                        that.setData({ 'projectlistpop': !that.data.projectlistpop })
                     }
                })
            },
            fail: (err) => { console.log(err); },
            complete: () => { }
        });
    },
    projectlistchangecancel(e) {
        let that = this
        that.setData({ projectlistpop: !that.data.projectlistpop })
    },
})