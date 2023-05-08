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
    xiangmulist: ["全部项目", "民生", "人保", "正印", "伍捌", "泰隆","中睿汇鑫存量资产"],
    xiangmuindex: 0,
    chuzhilist: ["全部处置", "债转", "过户", "售卖", "一次性结清", "分期结清"],
    chuzhiindex: 0,
    showlist: [],//当前显示的list
    inputvalue: "",//输入框的值
    groupnow: "",//当前内容
    auditnum: 0,
    orderByPrice: 0,
    orderByPriceType: 0,
    //orderByTime: 0,
    // orderByTimeType: 0,
  },
  onShow() {
    let that = this
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    wx.setVisualEffectOnCapture({
      visualEffect: 'hidden',
      success:(res) => {
        console.log(res)
      },
      fail:(err) => {
        console.log(err)
      },
      complete:(res) => {
        console.log(res)
      }
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
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "userId": id,
                "keyword": "",
                "group": "",
                "orderByPrice": 0,
                "orderByPriceType": 0,
                'manageWay': '',
              },

              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res, 222);
                that.setData({
                  "showlist": res.data.data,
                })
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
  showdetail(e) {
    console.log(e);
    let itemnow = JSON.stringify(e.currentTarget.dataset.classify)
    wx.navigateTo({
      url: '../chuzhishenhedetail/chuzhishenhedetail?itemnow='+ itemnow,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })
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
    let manageWay = that.data.chuzhiindex
    if (manageWay == 0) {
      manageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "userId": that.data.id,
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'manageWay': manageWay,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data })
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
    let manageWay = e.detail.value
    if (e.detail.value == 0) {
      manageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "userId": that.data.id,
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'manageWay': manageWay,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data })
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
    let manageWay = that.data.chuzhiindex
    if (manageWay == 0) {
      manageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "userId": that.data.id,
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'manageWay': manageWay,
      },
      header: {
        'content-type': 'application/json',
        'token': that.data.token
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        that.setData({ "showlist": res.data.data })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  //查看更多
  onReachBottom: function () {
    let that = this
    let page = this.data.page
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    console.log(page + 1, that.data.id, that.data.currentTab + 1, that.data.inputvalue, groupnow);
    let manageWay = that.data.chuzhiindex
    if (manageWay == 0) {
      manageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
      data: {
        "size": 10, //分页参数
        "page": page + 1, //分页参数
        "userId": that.data.id,
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": that.data.orderByPrice,
        "orderByPriceType": that.data.orderByPriceType,
        'manageWay': manageWay,
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
  },
  onRefresh: function () {
    let that = this
    //进入首页看有无token
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({ 'token': res.data })
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
            let manageWay = that.data.chuzhiindex
            if (manageWay == 0) {
              manageWay = ''
            }
            wx.request({
              url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
              data: {
                "size": 10, //分页参数
                "page": 1, //分页参数
                "userId": that.data.id,
                "keyword": that.data.inputvalue,
                "group": groupnow,
                "orderByPrice": that.data.orderByPrice,
                "orderByPriceType": that.data.orderByPriceType,
                'manageWay': manageWay,
              },
              header: {
                'content-type': 'application/json',
                'token': token
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                console.log(res);
                that.setData({ "showlist": res.data.data })

              },
              fail: (err) => { wx.stopPullDownRefresh(); },
              complete: () => { wx.stopPullDownRefresh(); }
            });
            //获取待审核数量
            //let num = that.data.currentTab + 1
            // wx.request({
            //   url: 'https://xcx.fjdayixin.cn:51608/api/1/check/num/' + num,
            //   header: {
            //     'content-type': 'application/json',
            //     'token': token
            //   },
            //   method: 'GET',
            //   dataType: 'json',
            //   success: (res) => {
            //     console.log(res);
            //     that.setData({ "auditnum": res.data.data.num })
            //   },
            //   fail: (err) => { console.log(err); },
            //   complete: () => { }
            // });
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
  //车300估值
  classifychange(e) {
    let that = this
    console.log(e);
    let num = e.currentTarget.dataset.num
    let num2 = e.currentTarget.dataset.num2
    that.setData({
      'orderByPrice': num,
      'orderByPriceType': num2,
    })
    let groupnow = null
    let xiangmulist = that.data.xiangmulist
    if (that.data.xiangmuindex != 0) {
      groupnow = xiangmulist[that.data.xiangmuindex]
    }
    let manageWay = that.data.chuzhiindex
    if (manageWay == 0) {
      manageWay = ''
    }
    wx.request({
      url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
      data: {
        "size": 10, //分页参数
        "page": 1, //分页参数
        "userId": that.data.id,
        "keyword": that.data.inputvalue,
        "group": groupnow,
        "orderByPrice": num,
        "orderByPriceType": num2,
        'manageWay': manageWay,
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
          that.setData({ "showlist": showlistnow })
      },
      fail: (err) => { console.log(err); },
      complete: () => { }
    });
  },
  // //委案时间
  // weianshijianchange(e) {
  //   let that = this
  //   console.log(e);
  //   let num = e.currentTarget.dataset.num
  //   let num2 = e.currentTarget.dataset.num2
  //   that.setData({
  //     orderByTime: num,
  //     orderByTimeType: num2,
  //   })
  //   let groupnow = null
  //   let xiangmulist = that.data.xiangmulist
  //   if (that.data.xiangmuindex != 0) {
  //     groupnow = xiangmulist[that.data.xiangmuindex]
  //   }
  //   let manageWay = that.data.chuzhiindex
  //   if (manageWay == 0) {
  //     manageWay = ''
  //   }
  //   wx.request({
  //     url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/2',
  //     data: {
  //       "size": 10, //分页参数
  //       "page": 1, //分页参数
  //       "type": that.data.currentTab + 1, //1就是第一个页面 2 就是第二个页面 3就是第三个页面
  //       "keyword": that.data.inputvalue,
  //       "group": groupnow,
  //       "orderByPrice": that.data.orderByPrice,
  //       "orderByPriceType": that.data.orderByPriceType,
  //       'inStage': that.data.inStage,
  //       'manageWay': manageWay,
  //       'orderByTime': num,
  //       'orderByTimeType': num2,
  //     },
  //     header: {
  //       'content-type': 'application/json',
  //       'token': that.data.token
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     success: (res) => {
  //       console.log(res);
  //       let showlistnow = res.data.data;
  //         that.setData({ "showlist": showlistnow })
  //     },
  //     fail: (err) => { console.log(err); },
  //     complete: () => { }
  //   });
  // },
    //重新渲染
    shownewres(e) {
      console.log('渲染新数据');
      let that = this
        let groupnow = ""
        let xiangmulist = that.data.xiangmulist
        if (that.data.xiangmuindex != 0) {
          groupnow = xiangmulist[that.data.xiangmuindex]
        }
        let ManageWay = that.data.chuzhiindex
        if (ManageWay == 0) {
          ManageWay = ''
        }
        wx.getSystemInfo({
          success: (res) => {
            this.setData({
              pixelRatio: res.pixelRatio,
              windowHeight: res.windowHeight,
              windowWidth: res.windowWidth
            })
          },
        })
        wx.setVisualEffectOnCapture({
          visualEffect: 'hidden',
          success:(res) => {
            console.log(res)
          },
          fail:(err) => {
            console.log(err)
          },
          complete:(res) => {
            console.log(res)
          }
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
                  url: 'https://xcx.fjdayixin.cn:51608/api/1/list/page/3',
                  data: {
                    "size": 10, //分页参数
                    "page": 1, //分页参数
                    "userId": id,
                    "keyword": "",
                    "group": groupnow,
                    "orderByPrice": that.data.orderByPrice,
                    "orderByPriceType": that.data.orderByPriceType,
                    'manageWay': ManageWay,
                  },
                  header: {
                    'content-type': 'application/json',
                    'token': token
                  },
                  method: 'POST',
                  dataType: 'json',
                  success: (res) => {
                    console.log(res);
                    let showlistnow = res.data.data;
                    that.setData({ "showlist": showlistnow })
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
})
