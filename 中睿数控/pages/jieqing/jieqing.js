Page({
  data: {
    solvemodel: ["一次性结清", "分期结清"],
    solvemodelindex: 0,
    price: 0,
    theOtherName: "",
    phone: "",
    huishoudate: "2020-01-01",
    huishoutime: "00:00",
    remark: "",
    picture: [],
    car: "",
    token: "",
    id: "",
  },
  onLoad: function (options) {
    let itemnow = JSON.parse(options.itemnow)
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

    this.setData({ car: itemnow })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
        let token = res.data
        wx.getStorage({
          key: 'id',
          success: (res) => {
            that.setData({ 'id': res.data })
          },
          fail: () => { },
        })
      },
      fail: () => { },
    })

  },
  ssolvemodel(e) { this.setData({ solvemodelindex: e.detail.value }) },
  sprice(e) { this.setData({ price: e.detail.value }) },
  stheOtherName(e) { this.setData({ theOtherName: e.detail.value }) },
  scompany(e) { this.setData({ company: e.detail.value }) },
  sphone(e) { this.setData({ phone: e.detail.value }) },
  shuishoudate(e) { this.setData({ huishoudate: e.detail.value }) },
  shuishoutime(e) { this.setData({ huishoutime: e.detail.value }) },
  sregisterName(e) { this.setData({ registerName: e.detail.value }) },
  scertificateLocation(e) { this.setData({ certificateLocation: e.detail.value }) },
  sremark(e) { this.setData({ remark: e.detail.value }) },
  splate(e) { this.setData({ plate: e.detail.value }) },
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
    if (that.data.theOtherName == "") {
      wx.showModal({
        title: '提交失败',
        showCancel: false,
        content: '请填写对方姓名',
        success: function (res) { }
      })
    }
    else if (that.data.phone == "") {
      wx.showModal({
        title: '提交失败',
        showCancel: false,
        content: '请填写联系方式',
        success: function (res) { }
      })
    }
    else if (that.data.picture.length == 0) {
      wx.showModal({
        title: '提交失败',
        showCancel: false,
        content: '请上传付款截图',
        success: function (res) { }
      })
    }
    else {
      if (that.data.solvemodelindex == 1) {
        console.log('fenqi');
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/manage',
          data: {
            "taskId": that.data.car.id,
            "userId": that.data.id,
            "type": 5,
            "price": that.data.price,
            "theOtherName": that.data.theOtherName,
            "phone": that.data.phone,
            "time": that.data.huishoudate + ' ' + that.data.huishoutime + ':00',
            "remark": that.data.remark
          },
          header: {
            'content-type': 'application/json',
            'token': that.data.token
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            let pic = that.data.picture
            for (let i = 0; i < pic.length; i++) {
              wx.uploadFile({
                url: 'https://xcx.fjdayixin.cn:51608/api/1/upload',
                filePath: pic[i].tempFilePath,
                name: 'file',
                formData: {
                  type: 4,
                  taskId: that.data.car.id,
                  num: that.data.huishoudate + '第' + i + '张' + Math.ceil(Math.random() * 100)
                },
                header: {
                  'token': that.data.token,
                },
                success(res) {
                  console.log(res);
                }
              })
            }
            wx.showModal({
              title: '分期结清成功',
              showCancel: false,
              content: '',
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });

      }
      if (that.data.solvemodelindex == 0) {
        console.log('yici');
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/manage',
          data: {
            "taskId": that.data.car.id,
            "userId": that.data.id,
            "type": 4,
            "price": that.data.price,
            "theOtherName": that.data.theOtherName,
            // "company": that.data.company,
            "phone": that.data.phone,
            "time": that.data.huishoudate + ' ' + that.data.huishoutime + ':00',
            //"registerName": that.data.registerName,
            //"certificateLocation": that.data.certificateLocation,
            //"plate": that.data.plate,
            "remark": that.data.remark
          },
          header: {
            'content-type': 'application/json',
            'token': that.data.token
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            let pic = that.data.picture

            for (let i = 0; i < pic.length; i++) {
              wx.uploadFile({
                url: 'https://xcx.fjdayixin.cn:51608/api/1/upload',
                filePath: pic[i].tempFilePath,
                name: 'file',
                formData: {
                  type: 3,
                  taskId: that.data.car.id,
                  num: that.data.huishoudate + '第' + i + '张' + Math.ceil(Math.random() * 100)
                },
                header: {
                  'token': that.data.token,
                },
                success(res) {
                  console.log(res);
                }
              })
            }


            wx.showModal({
              title: '一次结清成功',
              showCancel: false,
              content: '',
              success: function (res) {
                let pages = getCurrentPages();
                let beforePage2 = pages[pages.length - 3];
                beforePage2.shownewres();
                let beforePage = pages[pages.length - 2];
                beforePage.cuishouwancheng();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });

      }
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
  }
})