// pages/search/search.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    catdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.name
    this.getCatData(name)
  },

  choosecat: function (e) {
    var name = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '/pages/detail/detail?name='+name
    })
  },
  getCatData:function(e){
    if (app.globalData.open_id == null) {
      return;
    }

    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var that = this

    wx.request({
      url: 'https://site.maple.today/SchoolCat/SchoolCat',
      method: "POST",
      data: {
        requestCode: "005",
        open_id: app.globalData.open_id,
        name:e,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂无数据～',
          })
        } else {
          that.setData({
            catdata:res.data
          })
        }
      },
      fail: function (err) {
        console.log("失败" + err)
      },
      complete: function (e) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    thiswx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
  }
})