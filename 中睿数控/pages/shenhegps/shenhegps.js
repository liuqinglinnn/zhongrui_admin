Page({
  data: {
    picture1: [],//tieg pic
    picture2: [],//biandong pic
    car: "",//当前车辆情况
    token: "",
    id: "",
    refusepop: false,//驳回弹窗开关
    refusereason: "",//驳回原因
    remarkpop: false,
    remarkvalue: "",
  },
  // zhaopiantanchuang(e) {
  //   wx.showModal({
  //     title: '照片要求',
  //     showCancel: false,
  //     content: '图片1包含车牌号信息（带水印）\n图片2包含车架号信息（带水印）\n图片3包含车辆照片（带水印）',
  //     success: function (res) {}
  //   })
  // },
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

    let itemnow = JSON.parse(options.itemnow)
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
            let id = res.data
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
              data: {
                "type": 1,
                "taskId": itemnow.id
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.data, 'url');
                that.setData({ picture1: res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
              data: {
                "type": 2,
                "taskId": itemnow.id
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.data, 'url2');
                that.setData({ 'picture2': res.data.data })
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
  copy: function (e) {
    let item = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data: item,
      success: function (res) {
      }
    });
  },
  //上传数据
  Submit(e) {
    console.log(111);
    let that = this
    if (that.data.picture2.length != 0) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/pass',
        data: {
          "taskId": that.data.car.id,
          "type": 2,
          "userId": that.data.id,
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
            title: '审核通过',
            showCancel: false,
            content: '',
            success: function (res) {
              let pages = getCurrentPages();   //获取小程序页面栈
              let beforePage = pages[pages.length - 2];  //获取上个页面的实例对象
              beforePage.shownewres();   //触发上个页面自定义的go_update方法
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
    else {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/pass',
        data: {
          "taskId": that.data.car.id,
          "type": 1,
          "userId": that.data.id,
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
            title: '审核通过',
            showCancel: false,
            content: '',
            success: function (res) {
              let pages = getCurrentPages();   //获取小程序页面栈
              let beforePage = pages[pages.length - 2];  //获取上个页面的实例对象
              beforePage.shownewres();   //触发上个页面自定义的go_update方法
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

  },
  bohui(e) {
    this.setData({ refusepop: !this.data.refusepop })
  },
  bohuiquxiao(e) {
    this.setData({ refusepop: !this.data.refusepop })
  },
  bohuitongguo(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/check/reject',
      data: {
        "taskId": that.data.car.id,
        "type": 2,
        'text': that.data.refusereason
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
          title: '驳回成功',
          showCancel: false,
          content: '',
          success: function (res) {
            that.setData({ refusepop: !that.data.refusepop })
            let pages = getCurrentPages();   //获取小程序页面栈
            let beforePage = pages[pages.length - 2];  //获取上个页面的实例对象
            beforePage.shownewres();   //触发上个页面自定义的go_update方法
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  bohuireasoninput(e) {
    this.setData({ 'refusereason': e.detail.value })
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

  remarkchange() {
    let that = this
    that.setData({
      'remarkpop': !that.data.remarkpop,
      'remarkvalue': that.data.car.remark
    })
  },
  remarkcancel() {
    let that = this
    that.setData({ 'remarkpop': !that.data.remarkpop })
  },
  remarkinput(e) {
    this.setData({ 'remarkvalue': e.detail.value })
  },
  remarkconfirm() {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/change/text',
      data: {
        "taskId": that.data.car.id,
        'name': that.data.remarkvalue
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
          title: '修改成功',
          showCancel: false,
          content: '',
          success: function (res) {
            that.setData({ remarkpop: !that.data.remarkpop, ['car.remark']: that.data.remarkvalue })
            let pages = getCurrentPages();
            let beforePage = pages[pages.length - 2];
            beforePage.shownewres();
          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  }
})