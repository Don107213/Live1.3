var util = require('../../utils/util.js');
var config = require('../../config');

var url ='https://315505067.cool-live.club';

var app = getApp();
// pages/live/live.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyboardInputValue: '',
    sendMoreMsgFlag: false,
    chooseFiles: [],
    deleteIndex: -1,
    userInfo:{},
    txt:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfoStorage = wx.getStorageSync('user');
    var userIdStorage = wx.getStorageSync('userId');
    var liveId = options.id;
    // 绑定评论数据
    this.setData({
      liveRoomId:liveId,
      userInfo:userInfoStorage,
      userId: userIdStorage
    });
    this.getLiveRoomInfo();
    this.getAllComments();
    this.getLiveList();
    this.checkUpStatus();
    this.updateUpNum();
    this.addViwNum();
  }, 

  // 将时间戳转换成可阅读格式
  getDataByTime(itemData) {
    itemData.sort(this.compareWithTime); //按时间降序
    var len = itemData.length,
      data1;
    for (var i = 0; i < len; i++) {

      data1 = itemData[i];
      data1.create_time = util.getDiffTime(data1.create_time, true);
    }
    return itemData;
  },
  //sort函数的compare
  compareWithTime(value1, value2) {
    var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time);
    if (flag < 0) {
      return 1;
    } else if (flag > 0) {
      return -1
    } else {
      return 0;
    }
  },

  //
  updateUpNum:function(){
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/LiveRoom',
      method: "GET",
      data: {
        mode: "updateUpNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.upNum';
        that.setData({
          [nowkey]: res.data[0].upNum
        })
      }
    })
  },

  //离开页面时  减少观众人数

  subtractViewNum:function(){
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/LiveRoom',
      method: "GET",
      data: {
        mode: "subtractViewNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log("subtract success")
      }
    })
  },

  //进入页面时 增加观众人数
  addViwNum: function () {
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/LiveRoom',
      method: "GET",
      data: {
        mode: "addViwNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.viewNum';
        that.setData({
          [nowkey]: res.data[0].viewNum
        })
      }
    })
  },
  //初始化页面时  检查是否点赞
  checkUpStatus:function(){
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/LiveRoom',
      method: "GET",
      data: {
        mode: "checkUpStatus",
        liveRoomId: that.data.liveRoomId,
        upUserId: that.data.userId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        that.setData({
          upStatus: res.data
        })
      }
    })    
  },
  //点赞
  onUpTap: function (event) {
    var nowkey ='liveRoomInfo.upNum';
    this.setData({
      [nowkey]:1
    })
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/LiveRoom',
      method: "GET",
      data: {
        mode: "onUpTap",
        liveRoomId: that.data.liveRoomId,
        upUserId: that.data.userId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        that.updateUpNum();
        that.setData({
          upStatus: res.data
        })
      }
    })    
  },

  //献花
  sendFlowers:function(){

  },

  /**
   * 输入框的函数
   */
  //预览图片
  previewImg: function (event) {
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
      //获取图片在图片数组中的序号
      imgIdx = event.currentTarget.dataset.imgIdx,
      //获取评论的全部图片
      imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },




  // 获取用户输入
  bindCommentInput: function (event) {
    var val = event.detail.value;
    this.data.keyboardInputValue = val;
  },

  
  // 提交用户评论
  submitComment: function (event) {
    var imgs = this.data.chooseFiles;
    this.setData({
      txt: this.data.keyboardInputValue,
    })
    if (this.data.txt=="" && imgs.length === 0) {
      return;
    }
    if(imgs.length!=0)
    {
      var that = this;
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: this.data.filePath,
        name: 'file',
        success: function (res) {
          console.log('上传图片成功')
          res = JSON.parse(res.data)
          that.setData({
            imgUrl: res.data.imgUrl
          })
          if (that.data.liveRoomId == that.data.userId) {
            that.addLiveList();
          }
          else if(imgs.length==0){
            that.addComment();
          }
          //恢复初始状态
          that.resetAllDefaultStatus();
        },
        fail: function (e) {
          console.log('上传图片失败')
        }
      })
    }
    else
    {
      if (this.data.liveRoomId == this.data.userId) {
        this.addLiveList();
      }
      else if(imgs.length==0){
        this.addComment();
      }
      //恢复初始状态
      this.resetAllDefaultStatus();
    }    
  },

  //评论成功
  showCommitSuccessToast: function () {
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
  },
  //将所有相关的按钮状态，输入状态都回到初始化状态
  resetAllDefaultStatus: function () {
    //清空评论框
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    });
  },

  //获取直播间的数据
  getLiveRoomInfo:function()
  {
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/Live',
      method: "GET",
      data: {
        mode: "getLiveRoomInfo",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          liveRoomInfo: res.data[0]
        })
      }
    })
  },

  //获取直播数据
  getLiveList:function(){
    var that = this;
    wx.request({
      url: 'https://315505067.cool-live.club/Live',
      method: "GET",
      data: {
        mode: "getLiveList",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          liveList: that.getDataByTime(res.data)
        })
      }
    })
  },


  //获取用户评论
  getAllComments:function(){
    var that=this;
    wx.request({
      url: 'https://315505067.cool-live.club/Live',
      method: "GET",
      data: {
        mode: "getAllComments",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res){
        console.log(res.data);
      that.setData({
         comments: that.getDataByTime(res.data)
      })
      }
    })
  },
  
  //添加直播
  addLiveList:function(){
    var that = this;
    console.log(this.data.imgUrl);
    if (this.data.chooseFiles.length==0){
      this.setData({
        imgUrl:""
      })
    }
    wx.request({
      url: 'https://315505067.cool-live.club/Live',
      method: "GET",
      data: {
        mode: "addLiveList",
        liveRoomId: that.data.liveRoomId,
        create_time: new Date().getTime() / 1000,
        txt: that.data.txt,
        nickName: that.data.userInfo.nickName,
        imgUrl: that.data.imgUrl
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          liveList: that.getDataByTime(res.data)
        })
      }
    })
  },

  //添加评论到数据库
  addComment:function(){
    var that=this;
    wx.request({
      url: 'https://315505067.cool-live.club/Live',
      method:"GET",
      data:{
        mode:"addComment",
        liveRoomId: that.data.liveRoomId,
        create_time: new Date().getTime() / 1000,
        txt: that.data.txt,
        nickName: that.data.userInfo.nickName,
        imgUrl: that.data.userInfo.avatarUrl
      },
      header:{
        "content-type": "application/json"
      },
      success(res){
        console.log(res.data);
        that.setData({
          comments:that.getDataByTime(res.data)
        })
      }      
    })
  },
  

  


  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    var leftCount = 1 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    console.log(leftCount)
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        // 可以分次选择图片，但总数不能超过1张
        that.setData({
          filePath : res.tempFilePaths[0]
        })
        
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      }
    })
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      });
    }, 500)
  },

  
  //减少观看人数
  subtractView:function(){
    console.log("观看人数减一");
    wx.request({
      url: '',
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
    console.log("页面卸载：" + this.data.liveRoomId);

    this.subtractViewNum();
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