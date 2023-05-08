Page({
  data: {
    "username": "",
    "password": "",
    "id": "",
    "open": false,//默认不显示密码
  },
  onLoad(options) {
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
        let id = res.data
        wx.getStorage({
          key: 'token',
          success: (res) => {
            let token = res.data
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/user/' + id,
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                let user = res.data
                if (user.isDelete == 0) {
                  if (user.level <= 2) {
                    wx.requestSubscribeMessage({
                      tmplIds: ['CeOn6aZx5kKt0o1YADNQBYCLTHmoujFriEbpeDqzVPw'],
                      success(res) { console.log(res, 123456); }
                    })
                    wx.switchTab({
                      url: '../home/index',
                    })
                  }
                  else {
                    wx.showModal({
                      title: '你没有权限',
                      showCancel: false,
                      content: '',
                      success: function (res) { }
                    })
                  }

                }
                else {
                  wx.clearStorageSync();//清除缓存
                  wx.showModal({
                    title: '账号已回收，请重新注册',
                    showCancel: false,
                    content: '',
                    success: function (res) { }
                  })
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
  slogin(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/user/login',
      data: {
        "username": that.data.username,
        "password": that.data.password
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        if (res.data.errorMessage == "操作成功") {
          let id = res.data.data.id
          let level = res.data.data.level

          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
            success: (res) => {
              console.log("token添加");
            },
          });
          wx.setStorage({
            key: 'id',
            data: res.data.data.id,
            success: (res) => {
              console.log("id添加");

              that.setData({ 'id': id })
            },
          });
          wx.setStorage({
            key: 'level',
            data: res.data.data.level,
            success: (res) => {
              console.log("level添加");
              if (level <= 2) {
                wx.requestSubscribeMessage({
                  tmplIds: ['CeOn6aZx5kKt0o1YADNQBYCLTHmoujFriEbpeDqzVPw'],
                  success(res) {
                    wx.switchTab({
                      url: '../home/index',
                    })
                  }
                })

              }
              else {
                wx.showModal({
                  title: '你没有权限',
                  showCancel: false,
                  content: '',
                  success: function (res) { }
                })
              }
            },
          });
          wx.setStorage({
            key: 'nickname',
            data: res.data.data.nickName,
            success: (res) => {
              console.log("nickname添加");
              that.setData({ 'id': id })
            },
          });
        }
        else {
          wx.showModal({
            title: res.data.errorMessage,
            showCancel: false,
            content: '',
            success: function (res) { }
          })
        }
      },
      fail: (faill) => { console.log(faill); },
      complete: () => { }
    });
  },
  susername(e) { this.setData({ username: e.detail.value }) },
  spassword(e) { this.setData({ password: e.detail.value }) },
  regist(e) {
    wx.navigateTo({
      url: '../regist/regist',
    })
  },
  switch() {
    this.setData({
      open: !this.data.open
    })
  },
})