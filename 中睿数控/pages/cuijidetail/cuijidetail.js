Page({
  data: {
    car: "",//当前车辆情况
    picture: [],//活动图片
    token: "",
    remarkpop: false,
    remarkvalue: "",
  },
  onLoad: function (options) {
    let cid = options.cid
    let text = options.text
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
    let that = this
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data, remark: text })
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/get/collection/' + cid,
          header: {
            'content-type': 'application/json',
            'token': res.data
          },
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            that.setData({ 'picture': res.data.data })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
      },
      fail: () => { },
    })

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
})