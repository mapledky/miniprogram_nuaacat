// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catinfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.name
    //获取猫咪信息
    this.getCatInfo(name);
  },

  lookimage:function(e){
    var that = this
    wx.previewImage({
      current: e.currentTarget.dataset.state,     //当前图片地址
      urls: that.data.catinfo.image,                 //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  getCatInfo: function (e) {
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
        requestCode: "003",
        open_id: app.globalData.open_id,
        name:e,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.result == 0) {
          wx.showToast({
            title: '查无此猫猫～',
          })
        } else {
          that.setData({
            catinfo:res.data
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
    wx.stopPullDownRefresh({
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

  }
})