var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
Page({
  data: {
    navData: ["待找车辆", "已贴G", "在库车辆", "催收", "已处置"],//, "催记记录", "处置"
    currentTab: 0,//当前选择第几个页面
    token: '',
    id: '',
    page: 1,//当前页码
    navScrollLeft: 0,
    xiangmulist: ["全部项目", "民生", "人保", "正印", "伍捌", "泰隆", "通用", "中睿汇鑫存量资产","其他"],
    xiangmuindex: 0,
    chuzhilist: ["全部处置", "债转", "过户", "售卖", "一次性结清", "分期结清"],
    chuzhiindex: 0,
    showlist: [],//当前显示的list
    inputvalue: "",//输入框的值
    groupnow: "",//当前内容
    auditnum: 0,
    orderByPrice: 0,
    orderByPriceType: 0,
    orderByTime: 0,
    orderByTimeType: 0,
    inStage: 0,//是否分期 1分期
    shenheswitch: 0,//审核开关
    nofoundnum: 0,
    yitiegnum: 0,
    zaikunum: 0,
    chuzhinum: 0,
    checkarr: [],
    grouplistpop: false,
    grouplist: [],
    grouplistindex: 0,

  },
  onLoad() {
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    //进入首页看有无token
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
        let token = res.data
        wx.getStorage({
          key: 'id',
          success(res) {
            that.setData({ 'id': res.data })
            let id = res.data
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": that.data.currentTab + 1,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                that.setData({ "showlist": res.data.data, page: 1, })
                that.setData({ "nofoundnum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            //获取队伍数组
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
            //获取待审核数量
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/1',
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                that.setData({ "auditnum": res.data.data.num })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 1,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "nofoundnum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 2,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "yitiegnum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type":3,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "zaikunum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 4,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "chuzhinum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
          }
        })
      },
      fail: () => { },
    })
  },
  switchNav(event) {
    let that = this
    that.setData({ ManageWay: 0 })
    if (that.data.shenheswitch == 1) {
      let orderByPrice = 0
      let orderByTime = 0
      that.setData({
        shenheswitch: 0,
        orderByPrice: orderByPrice,
        orderByTime: orderByTime,
      })
    }
    that.onRefresh()
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    var cur = event.currentTarget.dataset.current;
    var singleNavWidth = this.data.windowWidth / 5;
    console.log(cur);
    let shenheswitch = that.data.shenheswitch
    let inStage = that.data.inStage
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }
    if (cur != 0) {
      that.setData({ 'shenheswitch': 0, })
      that.setData({ checkarr: [] })
      shenheswitch = 0
    }
    if (cur != 3) {
      that.setData({ 'inStage': 0 })
      inStage = 0
    }
    if (cur != 4) {
      that.setData({ 'chuzhiindex': 0 })
      ManageWay = '';
    }

    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({ currentTab: cur, page: 1, })
      let that = this
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
        data: {
          "size": 10, //分页参数
          "page": 1, //分页参数
          "type": cur + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
          "keyword": that.data.inputvalue,
          "group": groupnow,
          "orderByPrice": that.data.orderByPrice,
          "orderByPriceType": that.data.orderByPriceType,
          'inStage': inStage,
          'ManageWay': ManageWay,
          'orderByTime': that.data.orderByTime,
          'orderByTimeType': that.data.orderByTimeType,
        },
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({ "showlist": res.data.data, page: 1, })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
      //获取待审核数量
      let num = cur + 1
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/' + num,
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({ "auditnum": res.data.data.num })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }
  },
  showdetail(e) {
    console.log(e);
    let num = e.currentTarget.dataset.num
    let itemnow = JSON.stringify(e.currentTarget.dataset.classify)
    if (num == 0)//页面1
    {
      wx.navigateTo({
        url: '../shenhegps/shenhegps?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })
    }
    if (num == 1)//页面2
    {
      wx.navigateTo({
        url: '../tiegps/tiegps?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })
    }
    if (num == 2)//页面3
    {
      wx.navigateTo({
        url: '../cardetail/cardetail?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })
    }
    if (num == 3)//页面4
    {
      wx.navigateTo({
        url: '../cuishou/cuishou?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })
    }
    if (num == 4)//页面4
    {
      wx.navigateTo({
        url: '../yichuzhidetail/yichuzhidetail?itemnow=' + itemnow,
        complete: (res) => { },
        fail: (res) => { },
        success: (result) => { },
      })
    }
  },
  inputevent(e) { this.setData({ inputvalue: e.detail.value }) },
  pickerone(e)//首页筛选器
  {
    console.log(e.detail.value);
    this.setData({ xiangmuindex: e.detail.value })
    let that = this
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (e.detail.value != 0) {
      groupnow = xiangmulist[e.detail.value]
    }
    console.log(groupnow);
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }

    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'inStage': that.data.inStage,
        'ManageWay': ManageWay,
        'orderByTime': that.data.orderByTime,
        'orderByTimeType': that.data.orderByTimeType,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  pickertwo(e)//处置方式筛选器
  {
    console.log(e.detail.value);
    this.setData({ chuzhiindex: e.detail.value })
    let that = this
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    console.log(groupnow);
    let ManageWay = e.detail.value
    if (e.detail.value == 0) {
      ManageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'inStage': that.data.inStage,
        'ManageWay': ManageWay,
        'orderByTime': that.data.orderByTime,
        'orderByTimeType': that.data.orderByTimeType,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  search(e) {
    console.log('sousuo');
    let that = this
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }

    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 100, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'inStage': that.data.inStage,
        'ManageWay': ManageWay,
        'orderByTime': that.data.orderByTime,
        'orderByTimeType': that.data.orderByTimeType,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //查看更多
  onReachBottom: function () {
    console.log(this.data.shenheswitch, 222222);
    if (this.data.shenheswitch == 0) {
      let that = this
      let page = this.data.page
      let groupnow = null
      let xiangmulist = that.data.xiangmulist
      if (that.data.xiangmuindex != 0) {
        groupnow = xiangmulist[that.data.xiangmuindex]
      }
      console.log(page + 1, that.data.id, that.data.currentTab + 1, that.data.inputvalue, groupnow);
      let ManageWay = that.data.chuzhiindex
      if (ManageWay == 0) {
        ManageWay = ''
      }
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
        data: {
          "size": 10, //分页参数
          "page": page + 1, //分页参数
          "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
          "keyword": that.data.inputvalue,
          "group": groupnow,
          "orderByPrice": that.data.orderByPrice,
          "orderByPriceType": that.data.orderByPriceType,
          'inStage': that.data.inStage,
          'ManageWay': ManageWay,
          'orderByTime': that.data.orderByTime,
          'orderByTimeType': that.data.orderByTimeType,
        },
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          let showlistnow = res.data.data;
          if (showlistnow.length != 0) {
            let showlist = that.data.showlist;
            let list = [...showlist, ...showlistnow]
            that.setData({ "showlist": list, "page": page + 1 })
          }
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }

  },
  onRefresh: function () {
    console.log('fresh');
    let that = this
    //进入首页看有无token
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({
          'token': res.data, page: 1, shenheswitch: 0, orderByPrice: 0, orderByTime: 0,
        })
        let token = res.data
        wx.getStorage({
          key: 'id',
          success(res) {
            let groupnow = null
            let xiangmulist = that.data.xiangmulist
            if (that.data.xiangmuindex != 0) {
              groupnow = xiangmulist[that.data.xiangmuindex]
            }
            that.setData({ 'id': res.data })
            let id = res.data
            let ManageWay = that.data.chuzhiindex
            if (ManageWay == 0) {
              ManageWay = ''
            }

            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
                "keyword": that.data.inputvalue,
                "group": groupnow,
                "orderByPrice": that.data.orderByPrice,
                "orderByPriceType": that.data.orderByPriceType,
                'inStage': that.data.inStage,
                'ManageWay': ManageWay,
                'orderByTime': that.data.orderByTime,
                'orderByTimeType': that.data.orderByTimeType,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                console.log(that.data.currentTab + 1);
                that.setData({ "showlist": res.data.data, page: 1, checkarr: [] })
              },
              fail: (err) => { wx.stopPullDownRefresh(); },
              complete: () => { wx.stopPullDownRefresh(); }
            });
            //获取队伍数组
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
            //获取待审核数量
            let num = that.data.currentTab + 1
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/' + num,
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                that.setData({ "auditnum": res.data.data.num })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 1,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "nofoundnum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 2,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "yitiegnum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type":3,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "zaikunum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "type": 4,
                "keyword": "",
                "group": null,
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'inStage': 0,
                'ManageWay': '',
                'orderByTime': 0,
                'orderByTimeType': 0,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res.data.total);
                that.setData({ "chuzhinum": res.data.total })
              },
              fail: (err) => { console.log(err); },
              complete: () => { }
            });
          }
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
      },
    })
  },
  onPullDownRefresh: function () {
    this.onRefresh();
  },
  cancel(e) {
    this.setData({ inputvalue: "" })
    this.onRefresh();
  },
  changeaudit(e) {
    let that = this
    let shenheswitch = e.currentTarget.dataset.num
    if (shenheswitch == 0) {
      let orderByPrice = 0
      let orderByTime = 0
      that.setData({
        shenheswitch: shenheswitch,
        orderByPrice: orderByPrice,
        orderByTime: orderByTime,
      })
      that.onRefresh()
    }
    if (shenheswitch == 1) {
      let orderByPrice = 1
      let orderByTime = 1
      that.setData({
        shenheswitch: shenheswitch,
        orderByPrice: orderByPrice,
        orderByTime: orderByTime,
      })
      let num = that.data.currentTab + 1
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/' + num,
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({ "auditnum": res.data.data.num })
          that.setData({ "showlist": res.data.data.list, page: 1, checkarr: [] })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }
  },
  //车300估值
  classifychange(e) {
    let that = this
    console.log(e);
    let num = e.currentTarget.dataset.num
    let num2 = e.currentTarget.dataset.num2
    that.setData({
      orderByPrice: num,
      orderByPriceType: num2,
    })
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": num,
        "orderByPriceType": num2,
        'inStage': that.data.inStage,
        'ManageWay': ManageWay,
        'orderByTime': that.data.orderByTime,
        'orderByTimeType': that.data.orderByTimeType,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        let showlistnow = res.data.data;
        that.setData({ "showlist": showlistnow, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //委案时间
  weianshijianchange(e) {
    let that = this
    console.log(e);
    let num = e.currentTarget.dataset.num
    let num2 = e.currentTarget.dataset.num2
    that.setData({
      orderByTime: num,
      orderByTimeType: num2,
    })
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'inStage': that.data.inStage,
        'ManageWay': ManageWay,
        'orderByTime': num,
        'orderByTimeType': num2,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        let showlistnow = res.data.data;
        that.setData({ "showlist": showlistnow, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //分期中
  fenqichange(e) {
    let that = this
    console.log(e);
    let num = e.currentTarget.dataset.num
    that.setData({
      'inStage': num,
    })
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    let ManageWay = that.data.chuzhiindex
    if (ManageWay == 0) {
      ManageWay = ''
    }

    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'inStage': num,
        'ManageWay': ManageWay,
        'orderByTime': that.data.orderByTime,
        'orderByTimeType': that.data.orderByTimeType,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        let showlistnow = res.data.data;
        that.setData({ "showlist": showlistnow, page: 1, checkarr: [] })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //重新渲染
  shownewres(e) {
    console.log('渲染新数据');
    let that = this
    let shenheswitch = that.data.shenheswitch
    if (shenheswitch == 0) {
      let groupnow = null
      let xiangmulist = that.data.xiangmulist
      if (that.data.xiangmuindex != 0) {
        groupnow = xiangmulist[that.data.xiangmuindex]
      }
      let ManageWay = that.data.chuzhiindex
      if (ManageWay == 0) {
        ManageWay = ''
      }
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
        data: {
          "size": 10, //分页参数
          "page": 1, //分页参数
          "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
          "keyword": that.data.inputvalue,
          "group": groupnow,
          "orderByPrice": that.data.orderByPrice,
          "orderByPriceType": that.data.orderByPriceType,
          'inStage': that.data.inStage,
          'ManageWay': ManageWay,
          'orderByTime': that.data.orderByTime,
          'orderByTimeType': that.data.orderByTimeType,
        },
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          let showlistnow = res.data.data;
          that.setData({ "showlist": showlistnow, page: 1, checkarr: [] })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }
    if (shenheswitch == 1) {
      let num = that.data.currentTab + 1
      wx.request({
        url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/' + num,
        header: {
          'content-type': 'application/json',
          'token': that.data.token
        },
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({ "auditnum": res.data.data.num })
          that.setData({ "showlist": res.data.data.list, page: 1, checkarr: [] })
        },
        fail: (err) => { console.log(err); },
        complete: () => { }
      });
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "type": 1,
        "keyword": "",
        "group": null,
        "orderByPrice": 0,
        "orderByPriceType": 0,
        'inStage': 0,
        'ManageWay': '',
        'orderByTime': 0,
        'orderByTimeType': 0,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "nofoundnum": res.data.total })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  checkboxChange(e) {
    let idx = e.currentTarget.dataset.catch
    let that = this
    let list = that.data.showlist
    let checklist = that.data.checkarr
    //添加或者删除数据
    //没有就添加
    if (list[idx].checked == null || list[idx].checked == undefined) {
      console.log('没有');
      let str = 'showlist[' + idx + '].checked'
      checklist.push(idx)
      that.setData({ [str]: true, checkarr: checklist })
    }
    //有就删除
    else if (list[idx].checked != null) {
      console.log('有');
      let str = 'showlist[' + idx + '].checked'
      checklist.splice(checklist.indexOf(idx), 1)
      that.setData({ [str]: null, checkarr: checklist })
    }
  },
  cancelallcheck(e) {
    let that = this
    let list = that.data.showlist
    let checklist = that.data.checkarr
    for (let i = 0; i < checklist.length; i++) {
      //根据idx索引数组找到car
      let str = 'showlist[' + checklist[i] + '].checked'
      that.setData({ [str]: null })
      if (i == checklist.length - 1) {
        that.setData({ checkarr: [] })
      }
    }
  },
  addallcheck(e) {
    let that = this
    let list = that.data.showlist
    let checklist = []
    console.log(list.length);
    let j = 0
    for (let i = 0; i < list.length; i++) {
      let str = 'showlist[' + i + '].checked'
      //未审核
      if (list[i].isRemarkOne != 3) {
        that.setData({ [str]: true })
        checklist[j] = i
        j++
      }
      if (i == list.length - 1) {
        that.setData({ checkarr: checklist })
      }
    }
  },
  changegroup(e) {
    console.log(e);
    let that = this
    that.setData({ 'grouplistpop': !that.data.grouplistpop })
  },
  sgrouplistindex(e) { this.setData({ grouplistindex: e.detail.value }) },
  grouplistchangeconfirm(e) {
    let that = this
    //新得到carid数组
    let caridarr = []
    let list = that.data.showlist
    let checklist = that.data.checkarr
    for (let i = 0; i < checklist.length; i++) {
      caridarr[i] = list[checklist[i]].id
      console.log(caridarr);
      if (i == checklist.length - 1) {
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/change/group/2',
          data: {
            "ids": caridarr,
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
            if (res.data.code == 200) {
              wx.pageScrollTo({ scrollTop: 0 })
              wx.showModal({
                title: '分配成功',
                showCancel: false,
                content: '',
                success: function (res) {
                  that.shownewres()
                  that.setData({ 'grouplistpop': !that.data.grouplistpop })
                }
              })
            }
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
      }
    }
  },
  grouplistchangecancel(e) {
    let that = this
    that.setData({ 'grouplistpop': !that.data.grouplistpop })
  },
  deleteitem() {
    let that = this
    //新得到carid数组
    let caridarr = []
    let list = that.data.showlist
    let checklist = that.data.checkarr
    for (let i = 0; i < checklist.length; i++) {
      caridarr[i] = list[checklist[i]].id
      console.log(caridarr);
      if (i == checklist.length - 1) {
        wx.request({
          url: 'https://xcx.fjdayixin.cn:51608/api/1/remove/task/batch',
          data: {
            "ids": caridarr,
          },
          header: {
            'content-type': 'application/json',
            'token': that.data.token
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log(res);
            if (res.data.code == 200) {
              wx.pageScrollTo({ scrollTop: 0 })
              wx.showModal({
                title: '删除成功',
                showCancel: false,
                content: '',
                success: function (res) {
                  that.shownewres()
                }
              })
            }
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
      }
    }
  }
})
