//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData:{
    g_userInfo:null
  },
    onLaunch: function () {
      //this._getUserInfo();
    // wx.login();
    },
    _getUserInfo: function () {
      var userInfoStorage = wx.getStorageSync('user');
      if (!userInfoStorage) {
        var that = this;
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                that.globalData.g_userInfo = res.userInfo
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
        this.globalData.g_userInfo = userInfoStorage;
      }
    }
})