Page({
  data: {
    car: "",//当前车辆情况
    picture: [],//活动图片
    token: "",
    chuzhiarr: [],//处置记录
    refusepop: false,//驳回弹窗开关
    refusereason: ""//驳回原因
  },
  onLoad: function (options) {
    let itemnow = JSON.parse(options.itemnow)
    let that = this
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

    console.log(itemnow);
    wx.getStorage({
      key: 'id',
      success: (res) => {
        that.setData({ 'id': res.data })
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
                  console.log(chuzhiarr[i].type, '当前处置的type');
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
                      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
                      data: {
                        "type": 4,
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
    let index = 0;
    let arr = that.data.chuzhiarr
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].isClear == 2) {
        index = i
      }
    }
    console.log(that.data.chuzhiarr[index].type, '通过type');
    if (that.data.chuzhiarr[index].type != 5) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/pass',
        data: {
          "taskId": that.data.car.id,
          "type": 3,
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
    if (that.data.chuzhiarr[index].type == 5) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/pass',
        data: {
          "taskId": that.data.car.id,
          "type": 4,
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
          //队伍分配变成空
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/change/group',
            data: {
              "taskId": that.data.car.id,
              "name": ""
            },
            header: {
              'content-type': 'application/json',
              'token': that.data.token
            },
            method: 'POST',
            dataType: 'json',
            success: (res) => {
            },
            fail: (err) => { console.log(err); },
            complete: () => { }
          });
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
        "type": 3,
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
  }
})