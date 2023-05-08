var WxParse = require('../../utils/wxParse/wxParse.js');
Page({
  data: {
    car: "",
    picture: [{}],
    material: [{}],
    xiugaipop: false,
    xiugaiinput: "",
    token: "",
    downloadpop: false,
    downloadurl: "",
    remarkpop: false,
    remarkvalue: "",
    statustotal: 0,
    statustotal2: 0,
    statustotal3: 0,
    textpop: false,
    textcontent: "",
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
    console.log(itemnow, 'itemnow');
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
        let token = res.data
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
          data: {
            "type": 1,
            "taskId": that.data.car.id
          },
          header: {
            'content-type': 'application/json',
            'token': res.data
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res.data.data, 'url');
            that.setData({ picture: res.data.data })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/get/car/' + itemnow.id,
          header: {
            'content-type': 'application/json',
            'token': res.data
          },
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            console.log(res.data.data);
            let content = res.data.data
            let a = ""
            if (content.hasLicense == 0) { a = "有" }
            if (content.hasLicense == 1) { a = "没有" }
            if (content.hasLicense == 2) { a = "不详" }
            let b = ""
            if (content.hasKey == 0) { b = "有" }
            if (content.hasKey == 1) { b = "没有" }
            if (content.hasKey == 2) { b = "不详" }
            let strc =
              "保全方:" + content.protectPerson + "\n" +
              "客户姓名:" + content.carOwnerName + "\n" +
              "车牌号:" + content.carPlate + "\n" +
              "车型:" + content.carName + "\n" +
              "订单编号:" + content.contractId + "\n" +
              "保全方式:" + content.protectWay + "\n" +
              "剩余本金:" + content.principal + "\n" +
              "保全时间:" + content.protectTime + "\n" +
              "实际用车人:" + content.actualUser + "\n" +
              "联系方式:\n" +
              "1系统号码:" + content.carOwnerPhone + "\n" +
              "2车上号码:" + content.carPhone + "\n" +
              "过户意愿:" + content.protectMind + "\n" +
              "行驶证:" + a + "\n" +
              "钥匙:" + b + "\n" +
              "车况描述:" + content.carConditionDes + "\n" +
              "车内物品:" + content.itemsInCarDes + "\n" +
              "保全经过:" + content.protectText + "\n" +
              "车辆定位:" + content.gpsSituationTwo + "\n" +
              "预计送达库点:" + content.sentGarage + "\n"
            that.setData({ textcontent: strc })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });

        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
          data: {
            "type": 5,
            "taskId": that.data.car.id
          },
          header: {
            'content-type': 'application/json',
            'token': res.data
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res.data.data, 'url2');
            that.setData({ 'material': res.data.data })
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
        if (itemnow.isRemarkThree == 4) {
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
  audioPlayed: function (e) {
    console.log(e);
  },
  paused: function (e) {
    console.log(e);
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
  chuzhi(e) {
    if (this.data.car.isRemarkThree == 3 || this.data.car.isRemarkFour == 3) {
      wx.showModal({
        title: '处置申请审核中',
        showCancel: false,
        content: '',
        success: function (res) { }
      })
    }
    else {
      let itemnow = JSON.stringify(this.data.car)
      wx.navigateTo({
        url: '../chuzhishenqin/chuzhishenqin?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })

    }

  },


  xiugai(e) {
    let itemnow = JSON.stringify(this.data.car)
    wx.navigateTo({
      url: '../xiugaicailiao/xiugaicailiao?itemnow=' + itemnow,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })

    // this.setData({ xiugaipop: !this.data.xiugaipop })
  },
  xiugaiquxiao(e) {
    this.setData({ xiugaipop: !this.data.xiugaipop })
  },
  xiugaitongguo(e) {
    let that = this
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/change',
      data: {
        "taskId": that.data.car.id,
        'sentGarage': that.data.xiugaiinput
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
          title: '挪库成功',
          showCancel: false,
          content: '',
          success: function (res) { that.setData({ xiugaipop: !that.data.xiugaipop, ['car.sentGarage']: that.data.xiugaiinput }) }
        })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  xiugaiinput(e) {
    this.setData({ 'xiugaiinput': e.detail.value })
  },
  chuzhiwancheng(e) {
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

  daochu() {
    let that = this
    const title = '下载链接'
    const content = "https://xcx.fjdayixin.cn:51609/io/batch/download/0/?id=" + that.data.car.id
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
  Submit(e) {
    let that = this
    wx.chooseMessageFile({
      count: 10,
      type: "all",
      success: function (res) {
        console.log(res);
        let musicarr = res.tempFiles
        console.log(musicarr);
        for (let j = 0; j < musicarr.length; j++) {
          let numnow = j + 1
          wx.uploadFile({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/upload',
            filePath: musicarr[j].path,
            name: 'file',
            formData: {
              type: 5,
              taskId: that.data.car.id,
              num: '（补交）' + numnow
            },
            header: {
              'token': that.data.token,
            },
            success(res) {
              console.log(res);
              if (j == musicarr.length-1) {
                wx.request({
                  url: 'https://xcx.fjdayixin.cn:51608/api/1/list/urls',
                  data: {
                    "type": 5,
                    "taskId": that.data.car.id
                  },
                  header: {
                    'content-type': 'application/json',
                    'token': that.data.token
                  },
                  method: 'POST',
                  dataType: 'json',
                  success: (res) => {
                    console.log(res.data.data, 'url2');
                    that.setData({ 'material': res.data.data })
                    wx.showModal({
                      title: '补交成功',
                      showCancel: false,
                      content: '',
                      success: function (res) {
                      }
                    })
                  },
                  fail: (err) => { console.log(err); },
                  complete: () => { }
                });
              }



            }
          })
        }


      }
    })
  },
  playaudio(e) {
    let that = this
    let src = e.currentTarget.dataset.src
    let id = e.currentTarget.dataset.id
    this.myaudio = wx.createInnerAudioContext();
    this.myaudio.src = src
    this.myaudio.play();
    this.myaudio.onPlay(() => {
      let str = "material[" + id + "].status"
      that.setData({
        [str]: 1,
        statustotal: 1
      })
    })
  },
  pauseaudio(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    this.myaudio.pause();
    this.myaudio.onPause(() => {
      console.log('播放中');
      let str = "material[" + id + "].status"
      that.setData({
        [str]: null,
        statustotal: 0
      })
    })
  },
  //显示地图
  showMap() {
    //使用在腾讯位置服务申请的key（必填）
    const key = "QVKBZ-OW46P-YBHD3-VK77D-KGDW2-PSBW2";
    //调用插件的app的名称（必填）
    const referer = "中睿资管数据控制管理";
    const location = JSON.stringify({
      latitude: this.data.car.latitude,
      longitude: this.data.car.longitude
    });
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
    });
  },
  deletefile(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    let material = that.data.material
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '确定要删除此文件吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          wx.request({
            url: 'https://xcx.fjdayixin.cn:51608/api/1/remove/material/' + material[index].id,
            header: {
              'content-type': 'application/json',
              'token': that.data.token
            },
            method: 'GET',
            dataType: 'json',
            success: (res) => {
              console.log(res);
              material.splice(index, 1);
              that.setData({ material: material });
            },
            fail: (err) => {
              console.log(err);

            },
            complete: () => { }
          });

        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }

      }
    })
  },
  textcancel() {
    let that = this
    that.setData({ 'textpop': !that.data.textpop })
  },



});

