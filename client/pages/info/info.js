var app = getApp();

// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getUserInfo();
  },
  _getUserInfo: function () {
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage) {
      var that = this;
      wx.login({
        success: function (res1) {
          wx.request({
            url: 'https://315505067.cool-live.club/Upload',
            data:{
              code:res1.code
            },
            success:function(res){
              console.log(res.data);
            }
          })
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
                logged: true
              })
              wx.setStorageSync('user', res.userInfo)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
    else {
      this.setData({
        userInfo: userInfoStorage,
        logged: true
      })
    }
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