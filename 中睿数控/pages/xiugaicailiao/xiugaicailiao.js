Page({
  data: {
    usepeople: ["车主本人", "二押", "其他"],
    usepeopleindex: 0,
    picture: [],
    music: [],
    videoarr: [],
    huishoudate: "2022-06-01",
    huishoutime: "00:00",
    rukucangku: null,
    cheshangdianhua: "",
    cheyaoshi: ["有", "没有","不详"],
    cheyaoshiindex: 0,
    xingshizheng: ["有", "没有","不详"],
    xingshizhengindex: 0,
    chekuangmiaoshu: "",
    cheneiwupingmiaoshu: "",
    songdacheku: "",
    token: "",
    userid: "",
    enterhousenum: 0,
    latitude: 0,
    longitude: 0,
    protectPerson: "",
    protectTime: "2022-06-01",
    protectText: "",
    protectMind: "不详",
    protectWay: "",
  },
  onLoad(options) {
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
    
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
    let datanow=  Y + '-'  + M+ '-' + D

    this.setData({ car: itemnow,protectTime:datanow,huishoudate:datanow })
  
    if (itemnow.actualUser == "车主本人") {
      this.setData({ usepeopleindex: 0 })
    }
    else if (itemnow.actualUser == "二押") {
      this.setData({ usepeopleindex: 1 })
    }
    else if (itemnow.actualUser == "其他") {
      this.setData({ usepeopleindex: 2 })
    }
    this.setData({ huishoudate:itemnow.recoveryTime })
    this.setData({ rukucangku: itemnow.inboxWare })
    this.setData({ cheshangdianhua: itemnow.carPhone })
    this.setData({ cheyaoshiindex: itemnow.hasKey })
    this.setData({ xingshizhengindex: itemnow.hasLicense })
    this.setData({ cheneiwupingmiaoshu: itemnow.itemsInCarDes })
    this.setData({ chekuangmiaoshu: itemnow.carConditionDes })
    this.setData({ songdacheku: itemnow.sentGarage })
    this.setData({ longitude: itemnow.longitude })
    this.setData({ latitude: itemnow.latitude })
    this.setData({ protectPerson: itemnow.protectPerson })
    this.setData({ protectTime: itemnow.protectTime })
    this.setData({ protectText: itemnow.protectText })
    this.setData({ protectMind: itemnow.protectMind })
    this.setData({ protectWay: itemnow.protectWay })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
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
  susepeople(e) { this.setData({ usepeopleindex: e.detail.value }) },
  shuishoudate(e) { this.setData({ huishoudate: e.detail.value }) },
  shuishoutime(e) { this.setData({ huishoutime: e.detail.value }) },
  scheshangdianhua(e) { this.setData({ cheshangdianhua: e.detail.value }) },
  scheyaoshi(e) { this.setData({ cheyaoshiindex: e.detail.value }) },
  sxingshizheng(e) { this.setData({ xingshizhengindex: e.detail.value }) },
  schekuangmiaoshu(e) { this.setData({ chekuangmiaoshu: e.detail.value }) },
  scheneiwupingmiaoshu(e) { this.setData({ cheneiwupingmiaoshu: e.detail.value }) },
  ssongdacheku(e) { this.setData({ songdacheku: e.detail.value }) },
  sprotectPerson(e) { this.setData({ protectPerson: e.detail.value }) },
  sprotectWay(e) { this.setData({ protectWay: e.detail.value }) },
  baoquandate(e) { this.setData({ protectTime: e.detail.value }) },
  sprotectText(e) { this.setData({ protectText: e.detail.value }) },
  sprotectMind(e) { this.setData({ protectMind: e.detail.value }) },
  shuishoutime(e) { this.setData({ huishoutime: e.detail.value }) },
  Chooseaddress(e) {
    let that = this
    console.log(e);
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        let address = res.name
        let la = res.latitude
        let lo = res.longitude
        console.log(address, la, lo);
        that.setData({
          rukucangku: address,
          latitude: la,
          longitude: lo
        })
      },
    })
  },
  //上传数据
  Submit(e) {
    let that = this
    console.log(that.data.car, '|', that.data.huishoudate + that.data.huishoutime);
    console.log(that.data.huishoudate + ' ' + that.data.huishoutime + ':00');
    if (that.data.songdacheku == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写送达仓库',
        success: function (res) { }
      })
    }
    else if (that.data.chekuangmiaoshu == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写车况描述',
        success: function (res) { }
      })
    }
    else if (that.data.rukucangku == null) {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请获取入库仓库定位',
        success: function (res) { }
      })
    }
    else if (that.data.cheneiwupingmiaoshu == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写车内物品描述',
        success: function (res) { }
      })
    }
    else if (that.data.protectTime == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写保全时间',
        success: function (res) { }
      })
    }
    else if (that.data.protectText == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写保全经过',
        success: function (res) { }
      })
    }    
    else if (that.data.protectMind == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写过户意愿',
        success: function (res) { }
      })
    }
    else if (that.data.protectWay == "") {
      wx.showModal({
        title: '入库失败',
        showCancel: false,
        content: '请填写过户方式',
        success: function (res) { }
      })
    }
    else {
      if (that.data.enterhousenum == 0) {
        that.setData({ enterhousenum: 1 })
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/inbox',
          data: {
            actualUser: that.data.usepeople[that.data.usepeopleindex],
            carConditionDes: that.data.chekuangmiaoshu,
            carPhone: that.data.cheshangdianhua,
            hasKey: that.data.cheyaoshiindex,
            hasLicense: that.data.xingshizhengindex,
            inboxWare: that.data.rukucangku,
            itemsInCarDes: that.data.cheneiwupingmiaoshu,
            recoveryTime: that.data.huishoudate + ' ' + that.data.huishoutime + ':00',
            sentGarage: that.data.songdacheku,
            taskId: that.data.car.id,
            userId: that.data.id,
            longitude: that.data.longitude,
            latitude: that.data.latitude,
            protectPerson: that.data.protectPerson,
            protectTime: that.data.protectTime,
            protectText: that.data.protectText,
            protectMind: that.data.protectMind,
            protectWay: that.data.protectWay,
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
              title: '入库成功',
              showCancel: false,
              content: '',
              success: function (res) {
                let pages = getCurrentPages();   //获取小程序页面栈
                let beforePage = pages[pages.length -2];  //获取上个页面的实例对象
                beforePage.chuzhiwancheng();   //触发上个页面自定义的go_update方法
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

})