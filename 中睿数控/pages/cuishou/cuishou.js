//Page Object
Page({
  data: {
    car: "",//当前车辆情况
    cuishoulist: [],
    phonelist: [],
    newphone: "",
    addcuijipop: false,
    showdetailpop: false,
    cuijidetail: "",
    cuishoupopdetail: "",
    token: "",
    id: "",
    remarkpop: false,
    remarkvalue: "",
    grouplist: [],
    grouplistindex: 0,
    grouplistpop: false,
    picture: [],//活动图片
    chuzhiarr: [],//处置记录
    formdatapop: false,
    formdata: "",
    classify: 0
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
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/record/2/' + itemnow.id,
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res, '催收');
                that.setData({ 'cuishoulist': res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/more/phone/' + itemnow.id,
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res, '手机号');
                that.setData({ 'phonelist': res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/groups/3',
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
            if (itemnow.isRemarkFour == 4) {
              wx.request({
                url: 'https://xcx.fjdayixin.cn:51608/api/1/get/record',
                data: {
                  type: 1,
                  taskId: itemnow.id
                },
                header: {
                  'content-type': 'application/json',
                  'token': token
                },
                method: 'POST',
                dataType: 'json',
                success: (res) => {
                  console.log(res, '驳回理由');
                  let now = res.data.data.length
                  that.setData({ bohuireason: res.data.data[now - 1].text })
                },
                fail: (err) => { console.log(err); },
                complete: () => { }
              });
            }
            else if (itemnow.isRemarkThree == 4) {
              wx.request({
                url: 'https://xcx.fjdayixin.cn:51608/api/1/get/record',
                data: {
                  type: 1,
                  taskId: itemnow.id
                },
                header: {
                  'content-type': 'application/json',
                  'token': token
                },
                method: 'POST',
                dataType: 'json',
                success: (res) => {
                  console.log(res, '驳回理由');
                  let now = res.data.data.length
                  that.setData({ bohuireason: res.data.data[now - 1].text })
                },
                fail: (err) => { console.log(err); },
                complete: () => { }
              });
            }


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
  jieqing(e) {
    if (this.data.car.isRemarkThree == 3 || this.data.car.isRemarkFour == 3) {
      wx.showModal({
        title: '结清申请审核中',
        showCancel: false,
        content: '',
        success: function (res) { }
      })
    }
    else {
      let itemnow = JSON.stringify(this.data.car)
      wx.navigateTo({
        url: '../jieqing/jieqing?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })

    }
  },
  addcuiji(e) {
    let itemnow = JSON.stringify(this.data.car)
    wx.navigateTo({
      url: '../addcuiji/addcuiji?itemnow=' + itemnow,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })
    // this.setData({ addcuijipop: !this.data.addcuijipop })
  },
  cuijicancel(e) {
    this.setData({ addcuijipop: !this.data.addcuijipop })
  },
  cuijiconfirm(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/create/record/2',
      data: {
        "taskId": that.data.car.id,
        "userId": that.data.id,
        'text': that.data.cuijidetail
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
          title: '添加成功',
          showCancel: false,
          content: '',
          success: function (res) {
            that.setData({ addcuijipop: !that.data.addcuijipop })
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/record/2/' + that.data.car.id,
              header: {
                'content-type': 'application/json',
                'token': that.data.token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res, '催收');
                that.setData({ 'cuishoulist': res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });

          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  cuijiinput(e) {
    this.setData({ 'cuijidetail': e.detail.value })
  },
  cuishouwancheng(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/car/' + that.data.car.id,

      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ 'car': res.data.data })
      },
      fail: (err) => {
        console.log(err);

      },
      complete: () => { }
    });
  },
  cuijidetail(e) {
    this.setData({ showdetailpop: !this.data.showdetailpop })
  },
  cuijishowdetail(e) {
    console.log(e);
    let cid = e.currentTarget.dataset.id
    let text = e.currentTarget.dataset.text
    wx.navigateTo({
      url: '../cuijidetail/cuijidetail?cid=' + cid + '&text=' + text,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })
  },
  snewphone(e) {
    console.log(e);
    let phone = e.detail.value
    this.setData({ newphone: phone })
  },
  addphone(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/add/phone',
      data: {
        "taskId": that.data.car.id,
        "number": that.data.newphone,
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
          title: '添加电话成功',
          showCancel: false,
          content: '',
          success: function (res) {
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/more/phone/' + that.data.car.id,
              header: {
                'content-type': 'application/json',
                'token': that.data.token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                that.setData({ 'phonelist': res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  removephone(e) {
    let that = this
    console.log(e);
    let phoneid = e.currentTarget.dataset.id
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/remove/phone/' + phoneid,
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        wx.showModal({
          title: '删除电话成功',
          showCancel: false,
          content: '',
          success: function (res) {
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/get/more/phone/' + that.data.car.id,
              header: {
                'content-type': 'application/json',
                'token': that.data.token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res, '催收');
                that.setData({ 'phonelist': res.data.data })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });

          }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
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
  },
  changegezhi(e) {
    let that = this
    wx.showModal({
      title: '搁置变动',
      showCancel: true,
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/change/group',
            data: {
              "taskId": that.data.car.id,
              'name': ''
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
                title: '搁置成功',
                showCancel: false,
                content: '',
                success: function (res) {
                  that.setData({ ['car.taskGroup']: '' })
                  let pages = getCurrentPages();
                  let beforePage = pages[pages.length - 2];
                  beforePage.shownewres();
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
  fenpeiduiwu(e) {
    console.log(e);
    let that = this
    that.setData({ 'grouplistpop': !that.data.grouplistpop })
  },
  sgrouplistindex(e) { this.setData({ grouplistindex: e.detail.value }) },
  grouplistchangeconfirm(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/change/group',
      data: {
        "taskId": that.data.car.id,
        'name': that.data.grouplist[that.data.grouplistindex].name
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
          title: '分配成功',
          showCancel: false,
          content: '',
          success: function (res) {
            that.setData({ ['car.taskGroup']: that.data.grouplist[that.data.grouplistindex].name, 'grouplistpop': !that.data.grouplistpop })
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
  grouplistchangecancel(e) {
    let that = this
    that.setData({ 'grouplistpop': !that.data.grouplistpop })
  },
  shownewcuiji() {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/get/record/2/' + that.data.car.id,
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res, '催收');
        that.setData({ 'cuishoulist': res.data.data })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  changeformdata(e) {
    let that = this
    console.log(e.currentTarget.dataset.calssify);
    that.setData({
      'formdatapop': !that.data.formdatapop,
      "classify": e.currentTarget.dataset.calssify
    })
  },
  formdatacancel() {
    let that = this
    that.setData({ 'formdatapop': !that.data.formdatapop })
  },
  formdatainput(e) {
    this.setData({ 'formdata': e.detail.value })
  },
  formdataconfirm(e) {
    console.log(e.currentTarget.dataset.calssify);
    let that = this
    let carOwnerPhone = that.data.car.carOwnerPhone
    let carAttribute = that.data.car.Attribute
    let orderId = that.data.car.orderId
    let contractId = that.data.car.contractId
    let principal = that.data.car.principal
    let taskId = that.data.car.id
    let calssify = that.data.classify
    let formdata = that.data.formdata
    if (calssify == 1) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/change/msg',
        data: {
          "carOwnerPhone": formdata,
          "carAttribute": carAttribute,
          "orderId": orderId,
          "contractId": contractId,
          "principal": principal,
          "taskId": taskId
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
              that.setData({ formdatapop: !that.data.formdatapop, ['car.carOwnerPhone']: formdata })
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
    else if (calssify == 2) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/change/msg',
        data: {
          "carOwnerPhone": carOwnerPhone,
          "carAttribute": formdata,
          "orderId": orderId,
          "contractId": contractId,
          "principal": principal,
          "taskId": taskId
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
              that.setData({ formdatapop: !that.data.formdatapop, ['car.carAttribute']: formdata })
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
    else if (calssify == 3) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/change/msg',
        data: {
          "carOwnerPhone": carOwnerPhone,
          "carAttribute": carAttribute,
          "orderId": formdata,
          "contractId": contractId,
          "principal": principal,
          "taskId": taskId
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
              that.setData({ formdatapop: !that.data.formdatapop, ['car.orderId']: formdata })
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
    else if (calssify == 4) {
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/change/msg',
        data: {
          "carOwnerPhone": carOwnerPhone,
          "carAttribute": carAttribute,
          "orderId": orderId,
          "contractId": formdata,
          "principal": principal,
          "taskId": taskId
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
              that.setData({ formdatapop: !that.data.formdatapop, ['car.contractId']: formdata })
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
    else if (calssify == 5) {
      formdata = Number(formdata)
      console.log(formdata);
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/change/msg',
        data: {
          "carOwnerPhone": carOwnerPhone,
          "carAttribute": carAttribute,
          "orderId": orderId,
          "contractId": contractId,
          "principal": formdata,
          "taskId": taskId
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
              that.setData({ formdatapop: !that.data.formdatapop, ['car.principal']: formdata })
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
  },

});

