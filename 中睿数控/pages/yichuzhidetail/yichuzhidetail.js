Page({
  data: {
    car: "",//当前车辆情况
    picture: [],//活动图片
    token: "",
    chuzhiarr: []//处置记录
  },
  onLoad: function (options) {
    wx.setVisualEffectOnCapture({
      visualEffect: 'hidden',
      success:(res) => {
        console.log(res)
      },
      fail:(err) => {
        console.log(err)
      },
      complete:(res) => {
        console.log(res)
      }
    })
    
    let itemnow = JSON.parse(options.itemnow)
    let that = this
    this.setData({ car: itemnow })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
        let token = res.data
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/get/manage/detail/' + itemnow.id,
          header: {
            'content-type': 'application/json',
            'token': token
          },
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            that.setData({ 'chuzhiarr': res.data.data })
            let chuzhiarr = res.data.data
            for (let i = 0; i < chuzhiarr.length; i++) {
              if (chuzhiarr[i].type != 5) {
                wx.request({
                  url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
                  data: {
                    "type": 3,
                    "taskId": itemnow.id
                  },
                  header: {
                    'content-type': 'application/json',
                    'token': token
                  },
                  method: 'POST',
                  dataType: 'json',
                  success: (res) => {
                    console.log(res);
                    that.setData({ ['chuzhiarr[' + i + '].pic']: res.data.data })
                  },
                  fail: (err) => { console.log(err); },
                  complete: () => { }
                });
              }
              if (chuzhiarr[i].type == 5) {
                wx.request({
                  url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls/1',
                  data: {
                    "type": 4,
                    "taskId": itemnow.id,
                    "num": i
                  },
                  header: {
                    'content-type': 'application/json',
                    'token': token
                  },
                  method: 'POST',
                  dataType: 'json',
                  success: (res) => {
                    console.log(res);
                    that.setData({ ['chuzhiarr[' + i + '].pic']: res.data.data })
                  },
                  fail: (err) => { console.log(err); },
                  complete: () => { }
                });
              }

            }
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
      },
      fail: () => { },
    })
  },
  copy: function (e) {
    let item = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data: item,
      success: function (res) {
      }
    });
  },
  clickImg(e) {
    console.log(e);
    var imgUrl = e.currentTarget.dataset.presrc;
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片https链接列表，注意是数组
      current: '', // 当前显示图片的https链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  daochu() {
    let that = this
    const title = '下载链接'
    const content = "https://xcx.fjdayixin.cn:51608/io/batch/download/0/?id=" + that.data.car.id
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
})