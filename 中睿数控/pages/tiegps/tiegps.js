Page({
  data: {
    car: "",
    picture: [],
    token: "",
    remarkpop: false,
    remarkvalue: "",
    timelist: [],
    timelistindex: 0,
    timelistpop: false,
    refusepop: false,
    refusereason: "",
    yanchiarr: [],
    yanchireason: "",
    isnewid: 0,
    id: "",
    yanchidetail:{}
  },
  zhaopiantanchuang(e) {
    wx.showModal({
      title: '照片要求',
      showCancel: false,
      content: '图片1包含车牌号信息（带水印）\n图片2包含车架号信息（带水印）\n图片3包含车辆照片（带水印）',
      success: function (res) { }
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
  onLoad: function (options) {
    let itemnow = JSON.parse(options.itemnow)
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
    this.setData({ car: itemnow, timelistindex: itemnow.countTime - 1 })
    wx.getStorage({
      key: 'id',
      success: (res) => {
        that.setData({ 'id': res.data })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        let token = res.data
        that.setData({ 'token': res.data })
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
          data: {
            "type": 1,
            "taskId": itemnow.id
          },
          header: {
            'content-type': 'application/json',
            'token': res.data
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            that.setData({ 'picture': res.data.data })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });

        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/list/add/record/' + itemnow.id,
          header: {
            'content-type': 'application/json',
            'token': token
          },
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            console.log(res, '获取所有字段');
            let resarr = res.data.data
            that.setData({ yanchiarr: resarr })
            if (itemnow.isRemarkFifth == 3) {
              for (let i = 0; i < resarr.length; i++) {
                if (resarr[i].isNew == 1) {
                  that.setData({ yanchireason: resarr[i].text, isnewid: resarr[i].id })
                }
              }
            }
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });

        let arrnum = []
        for (let i = 0; i < 181; i++) {
          arrnum[i] = i
          if (i == 180) { that.setData({ timelist: arrnum }) }
        }
      },
      fail: () => { },
    })

  },

  clickImg(e) {
    console.log(e);
    var imgUrl = e.currentTarget.dataset.presrc;
    wx.previewImage({
      urls: [imgUrl],
      current: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  remarkchange(e) {
    console.log(e);
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
  },
  stimelistindex(e) { this.setData({ timelistindex: e.detail.value }) },
  timelistchangeconfirm(e) {
    let that = this
    //有审核
    if (that.data.car.isRemarkFifth == 3) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/add/time',
        data: {
          taskId: that.data.car.id,
          day: that.data.timelist[that.data.timelistindex],
          subTimeId: that.data.isnewid,
          userId: that.data.id
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
              that.setData({ ['car.countTime']: that.data.timelist[that.data.timelistindex], 'timelistpop': !that.data.timelistpop })
              let pages = getCurrentPages();
              let beforePage = pages[pages.length - 2];
              beforePage.shownewres();
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
    //直接改
    else {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/add/time',
        data: {
          taskId: that.data.car.id,
          day: that.data.timelist[that.data.timelistindex],
          subTimeId: -1,
          userId: that.data.id
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
              that.setData({ ['car.countTime']: that.data.timelist[that.data.timelistindex], 'timelistpop': !that.data.timelistpop })
              let pages = getCurrentPages();
              let beforePage = pages[pages.length - 2];
              beforePage.shownewres();
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
  timelistchangecancel(e) {
    let that = this
    that.setData({ 'timelistpop': !that.data.timelistpop })
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
        "type": 4,
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









  yanqidetail(e) {
    this.setData({ showdetailpop: !this.data.showdetailpop })
  },
  yanqishowdetail(e) {
    console.log(e);
    let idx = e.currentTarget.dataset.idx
    let that = this
    this.setData({
      yanchidetail: that.data.yanchiarr[idx],
      showdetailpop: !this.data.showdetailpop
    })
  },
})