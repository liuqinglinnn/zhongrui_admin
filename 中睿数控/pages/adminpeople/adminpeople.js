//Page Object
Page({
  data: {
    id: 0,
    level: 0,
    nickname: "",
    token: "",
    peoplelist: [],
    grouplist: [],
    addprouppop: false,
    addproupname: "",
    inputvalue: "",
  },
  //options(Object)
  onLoad: function (options) {
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

    wx.getStorage({
      key: 'id',
      success: (res) => {
        that.setData({ 'id': res.data })
        let id = res.data
        wx.getStorage({
          key: 'level',
          success: (res) => {
            that.setData({ 'level': res.data })
            let level = res.data
            wx.getStorage({
              key: 'token',
              success: (res) => {
                that.setData({ 'token': res.data })
                let token = res.data
                wx.getStorage({
                  key: 'nickname',
                  success: (res) => {
                    that.setData({ 'nickname': res.data })
                    let nickname = res.data
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/users',
                      data: {
                        "level": level + 1,
                        "group": ""
                      },
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'POST',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'peoplelist': res.data.data })
                      },
                      fail: (err) => { console.log(err); },
                      complete: () => { }
                    });
                    let num = level + 1
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/groups/' + num,
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'GET',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'grouplist': res.data.data })
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
  //账号回收
  huishou(e) {
    console.log(e);
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '是否收回账号',
      showCancel: true,
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/remove/user/' + id,
            header: {
              'content-type': 'application/json',
              'token': that.data.token
            },
            method: 'GET',
            dataType: 'json',
            success: (res) => {
              console.log(res);
              wx.showModal({
                title: '回收成功',
                showCancel: false,
                content: '',
                success: function (res) {
                  that.handrefresh()
                }
              })
            },
            fail: (err) => { console.log(err); },
            complete: () => { }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })
  },

  //队伍回收
  huishougroup(e) {
    console.log(e);
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '是否解散队伍',
      showCancel: true,
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/remove/group/' + id,
            header: {
              'content-type': 'application/json',
              'token': that.data.token
            },
            method: 'GET',
            dataType: 'json',
            success: (res) => {
              console.log(res);
              that.handrefresh()
              wx.showModal({
                title: '队伍已解散',
                showCancel: false,
                content: '',
                success: function (res) {
                }
              })
            },
            fail: (err) => { console.log(err); },
            complete: () => { }
          });
        }
      }
    })
  },
  //账号新增
  addpeople(e) {
    console.log(e);
    let that = this
    let id = that.data.id
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/create/code/' + id,
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        let invitecode = res.data.data
        wx.showModal({
          title: '邀请码',
          showCancel: false,
          confirmText: '复制',
          content: res.data.data,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击复制')
              wx.setClipboardData({
                data: invitecode,
                success: (res) => {
                  wx.showToast({
                    title: '复制成功',
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //队伍新增
  addproup(e) {
    this.setData({ addprouppop: !this.data.addprouppop })
  },
  addproupcancel(e) {
    this.setData({ addprouppop: !this.data.addprouppop })
  },
  addproupconfirm(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/create/group',
      data: {
        name: that.data.addproupname,
        userId: that.data.id,
        level: that.data.level + 1,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        wx.showModal({
          title: '创建成功',
          showCancel: false,
          content: '',
          success: function (res) {
            that.setData({ addprouppop: !that.data.addprouppop })
            that.handrefresh()
          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  addproupnameinput(e) {
    this.setData({ 'addproupname': e.detail.value })
  },
  onRefresh: function () {
    let that = this
    wx.getStorage({
      key: 'id',
      success: (res) => {
        that.setData({ 'id': res.data })
        let id = res.data
        wx.getStorage({
          key: 'level',
          success: (res) => {
            that.setData({ 'level': res.data })
            let level = res.data
            wx.getStorage({
              key: 'token',
              success: (res) => {
                that.setData({ 'token': res.data })
                let token = res.data
                wx.getStorage({
                  key: 'nickname',
                  success: (res) => {
                    that.setData({ 'nickname': res.data })
                    let nickname = res.data
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/users',
                      data: {
                        "level": level + 1,
                        "group": ""
                      },
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'POST',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'peoplelist': res.data.data })
                      },
                      fail: (err) => { },
                      complete: () => { wx.stopPullDownRefresh(); }
                    });
                    let num = level + 1
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/groups/' + num,
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'GET',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'grouplist': res.data.data })
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
  onPullDownRefresh: function () {
    this.onRefresh();
  },
  handrefresh() {
    let that = this
    wx.getStorage({
      key: 'id',
      success: (res) => {
        that.setData({ 'id': res.data })
        let id = res.data
        wx.getStorage({
          key: 'level',
          success: (res) => {
            that.setData({ 'level': res.data })
            let level = res.data
            wx.getStorage({
              key: 'token',
              success: (res) => {
                that.setData({ 'token': res.data })
                let token = res.data
                wx.getStorage({
                  key: 'nickname',
                  success: (res) => {
                    that.setData({ 'nickname': res.data })
                    let nickname = res.data
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/users',
                      data: {
                        "level": level + 1,
                        "group": "",
                        "keyWord": "",
                      },
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'POST',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'peoplelist': res.data.data })
                      },
                      fail: (err) => { },
                      complete: () => { }
                    });
                    let num = level + 1
                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/groups/' + num,
                      header: {
                        'content-type': 'application/json',
                        'token': token
                      },
                      method: 'GET',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        that.setData({ 'grouplist': res.data.data })
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
  inputevent(e) {
    this.setData({ inputvalue: e.detail.value })
  },
  search(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/users',
      data: {
        "level": that.data.level + 1,
        "keyWord": that.data.inputvalue,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ 'peoplelist': res.data.data })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  cancelsearch(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/users',
      data: {
        "level": that.data.level + 1,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res, 'lsit');
        that.setData({ 'peoplelist': res.data.data, 'inputvalue': "" })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  }
});