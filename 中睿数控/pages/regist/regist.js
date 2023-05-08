Page({
  data: {
    phone: "",//手机号
    password: "",//密码
    nickname: "",//名字
    sscode: "",//邀请码
    belongGroup: "",//队伍
    idCard: "",//身份证
    "open": false,//默认不显示密码
  },
  onLoad(options) {

  },
  submit(e) {
    //第一步调用微信获取手机号
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
    if (that.data.nickname != '' && that.data.password != '' && that.data.phone != '') {
      wx.login({
        success: res => {
          console.log(res);
          let code = res.code
          console.log(code);
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/user/register',
            data: {
              username: that.data.phone,//手机号
              password: that.data.password,//密码
              nickname: that.data.nickname,//名字
              code: that.data.sscode,//邀请码
              belongGroup: that.data.belongGroup,//队伍
              idCard: that.data.idCard,//身份证
            },
            header: {
              'content-type': 'application/json',
            },
            method: 'POST',
            dataType: 'json',
            success: (res) => {
              console.log(res);
              let mes = res.data.errorMessage
              let id
              if(mes == "操作成功")
              {
                id=res.data.data.id
              }
              wx.showModal({
                title: mes,
                showCancel: false,
                content: '',
                success: (res) => {
                  if (mes == "操作成功") {

                    wx.request({
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/save/open/id',
                      data: {
                        "userId": id,
                        'code': code
                      },
                      header: {
                        'content-type': 'application/json',
                      },
                      method: 'POST',
                      dataType: 'json',
                      success: (res) => {
                        console.log(res);
                        wx.navigateBack({
                          delta: 1
                        })
                      },
                      fail: (err) => { console.log(err); },
                      complete: () => { }
                    });

                  }
                }
              })
            },
            fail: (err) => { console.log(err); },
            complete: () => { }
          });
        }
      })
    }
    else {
      wx.showModal({
        title: '请填写信息',
        showCancel: false,
        content: '',
        success: function (res) {
        }
      })
    }

  },
  snickname(e) { this.setData({ nickname: e.detail.value }) },
  spassword(e) { this.setData({ password: e.detail.value }) },
  ssscode(e) { this.setData({ sscode: e.detail.value }) },
  sbelongGroup(e) { this.setData({ belongGroup: e.detail.value }) },
  sphone(e) { this.setData({ phone: e.detail.value }) },
  switch() {
    this.setData({
      open: !this.data.open
    })
  },
})