Page({
  data: {
    solvemodel: ["债转", "过户", "售卖"],
    solvemodelindex: 0,
    price: 0,
    theOtherName: "",
    company: "",
    phone: "",
    huishoudate: "2020-01-01",
    huishoutime: "00:00",
    registerName: "",
    certificateLocation: "",
    plate: "",
    remark: "",
    picture: [],
    car: "",
    token: "",
    id: "",
  },
  onLoad: function (options) {
    let itemnow = JSON.parse(options.itemnow)
    this.setData({ car: itemnow })
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
        that.setData({ 'token': res.data })
        let token = res.data
        wx.getStorage({
          key: 'id',
          success: (res) => {
            that.setData({ 'id': res.data })
            let id = res.data
          },
          fail: () => { },
        })
      },
      fail: () => { },
    })
  },
  sremark(e) { this.setData({ remark: e.detail.value }) },
  //上传图片音频视频
  choosepicture(e) {
    let that = this
    wx.chooseMedia({
      count: 10,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: res => {
        console.log(res.tempFiles, '图片链接');
        that.setData({ picture: res.tempFiles })
      }
    })
  },

  //上传数据
  Submit(e) {
    let that = this
    if (that.data.remark == "" && that.data.picture.length == 0) {
      wx.showModal({
        title: '提交失败',
        showCancel: false,
        content: '请填写信息',
        success: function (res) { }
      })
    }
    else {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/create/record/2',
        data: {
          "taskId": that.data.car.id,
          "userId": that.data.id,
          'text': that.data.remark
        },
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          let idss = res.data.data.id
          let pic = that.data.picture
          for (let i = 0; i < pic.length; i++) {
            wx.uploadFile({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/upload/collect/img?id=' + idss,
              filePath: pic[i].tempFilePath,
              name: 'file',
              header: {
                'token': that.data.token,
              },
              success(res) {
                console.log(res);
              }
            })
          }
          wx.showModal({
            title: '添加成功',
            showCancel: false,
            content: '',
            success: function (res) {
              let pages = getCurrentPages();
              let beforePage = pages[pages.length - 2];
              beforePage.shownewcuiji();
              wx.navigateBack({
                delta: 1,
                success: (res) => { },
                fail: (res) => { },
                complete: (res) => { },
              })
            }
          })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }
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
  copy: function (e) {
    let item = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data: item,
      success: function (res) {
      }
    });
  },
})