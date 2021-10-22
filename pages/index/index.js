var app = getApp()

Page({
  data: {
    fostered_catlist: [],
    unknown_catlist: [],
    dead_catlist: [],
    present_catlist: [],
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    navbar: ['在校', '毕业', '休学', '喵星'],
    currentTab: 0,
    url: app.globalData.url,
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (this.data.currentTab == 1) {
      if (this.data.fostered_catlist.length == 0) {
        this.refreshPageData()
      }
    }
    if (this.data.currentTab == 2) {
      if (this.data.unknown_catlist.length == 0) {
        this.refreshPageData()
      }
    }
    if (this.data.currentTab == 3) {
      if (this.data.dead_catlist.length == 0) {
        this.refreshPageData()
      }
    }
  },

  iconType: [
    'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
  ],

  //转发跳转页面设置
  onLoad: function (options) {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        console.log("login")
        if (code) {
          wx.request({
            url: 'https://site.maple.today/SchoolCat/SchoolCat',
            method: "POST",
            data: {
              requestCode: "002",
              js_code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.openid != null) {
                app.globalData.open_id = res.data.openid
                that.refreshPageData()
              } else {
                wx.showToast({
                  title: '数据获取错误，请重新登录',
                })
              }
            },
            fail: function (err) {
              console.log("失败" + err)
              wx.showToast({
                title: '数据获取错误，请重新登录',
              })
            },
            complete: function (e) {}
          })
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
          wx.showToast({
            title: '数据获取错误，请重新登录',
          })
        }
      }
    })
    if (options.pageId) {
      wx.navigateTo({
        url: '/pages/cats/' + options.pageId + '/' + options.pageId,
      })
    }
  },
  choosecat: function (e) {
    var index = e.currentTarget.dataset.key
    
  },

  onPullDownRefresh: function () {
    this.refreshPageData()
  },

  onReachBottom: function () {
    this.getmore()
  },
  //刷新当前页面猫咪数据
  refreshPageData: function () {

    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if (app.globalData.open_id == null) {
      return;
    }

    var that = this
    var type = that.data.currentTab + 1
    wx.request({
      url: 'https://site.maple.today/SchoolCat/SchoolCat',
      method: "POST",
      data: {
        requestCode: "001",
        open_id: app.globalData.open_id,
        type: type,
        index: 0,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂无数据~',
          })
        } else {
          wx.showToast({
            title: '数据获取成功~',
          })
          if (that.data.currentTab == 0) {
            that.setData({
              present_catlist: res.data
            })
          }
          if (that.data.currentTab == 1) {
            that.setData({
              fostered_catlist: res.data
            })
          }
          if (that.data.currentTab == 2) {
            that.setData({
              unknown_catlist: res.data
            })
          }
          if (that.data.currentTab == 3) {
            that.setData({
              dead_catlist: res.data
            })
          }
        }
      },
      fail: function (err) {
        console.log("失败" + err)
        wx.showToast({
          title: '数据获取错误，请重新登录',
        })
      },
      complete: function (e) {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      }
    })
  },

  //当前页面获取更多
  getmore: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    if (app.globalData.open_id == null) {
      return;
    }
    var that = this
    var type = that.data.currentTab + 1
    var index = 0
    if (this.data.currentTab == 0) {
      index = this.data.present_catlist[this.data.present_catlist.length - 1].Id
    }
    if (this.data.currentTab == 1) {
      index = this.data.present_catlist[this.data.fostered_catlist.length - 1].Id
    }
    if (this.data.currentTab == 2) {
      index = this.data.present_catlist[this.data.unknown_catlist.length - 1].Id
    }
    if (this.data.currentTab == 3) {
      index = this.data.present_catlist[this.data.dead_catlist.length - 1].Id
    }
    wx.request({
      url: 'https://site.maple.today/SchoolCat/SchoolCat',
      method: "POST",
      data: {
        requestCode: "001",
        open_id: app.globalData.open_id,
        type: type,
        index: index,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有更多数据啦~',
          })
        } else {
          wx.showToast({
            title: '数据获取成功~',
          })
          if (that.data.currentTab == 0) {
            var catdata = that.data.present_catlist
            catdata = catdata.concat(res.data)
            that.setData({
              present_catlist: catdata
            })
          }
          if (that.data.currentTab == 1) {
            var catdata = that.data.fostered_catlist
            catdata = catdata.concat(res.data)
            that.setData({
              fostered_catlist: catdata
            })
          }
          if (that.data.currentTab == 2) {
            var catdata = that.data.unknown_catlist
            catdata = catdata.concat(res.data)
            that.setData({
              unknown_catlist: catdata
            })
          }
          if (that.data.currentTab == 3) {
            var catdata = that.data.dead_catlist
            catdata = catdata.concat(res.data)
            that.setData({
              dead_catlist: catdata
            })
          }
        }
      },
      fail: function (err) {
        console.log("失败" + err)
        wx.showToast({
          title: '数据获取错误，请重新登录',
        })
      },
      complete: function (e) {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      }
    })
  },
  //转发此页面的设置
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  // 转发到朋友圈
  onShareTimeline: function (res) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  // 搜索栏输入名字后页面跳转
  bindconfirmT: function (e) {
    console.log("e.detail.value");
    if (e.detail.value) {
      wx.navigateTo({
        url: '/pages/cats/' + e.detail.value + '/' + e.detail.value,
      })
    }
  },
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: '南航猫协', //需要复制的内容
      success: function (res) {
        // self.setData({copyTip:true}),
      }
    })
  },

})