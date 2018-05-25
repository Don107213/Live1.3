<?php
  
  $mode=$_GET["mode"];
  if($mode=="addUser"){
    addUser();  
    }  
  else if($mode=="addLiveList"){
    addLiveList();
  }
  else if($mode=="addComment"){
    addComment();  
    }
  else if($mode=="getAllComments"){
    $liveRoomId=$_GET["liveRoomId"];
    getAllComments($liveRoomId);
  }
  else if($mode=="getLiveList"){
    $liveRoomId=$_GET["liveRoomId"];
    getLiveList($liveRoomId);
  }
  else if($mode=="getAllLiveRoom"){
    getAllLiveRoom();
  }
  else if($mode=="getLiveRoomInfo"){
    getLiveRoomInfo();
  }

  function getLiveRoomInfo()
  {
    $liveRoomId=$_GET["liveRoomId"];
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql="select * from LiveRoom where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("avatar"=>$row["avatar"],"nickName"=>$row["nickName"],"upNum"=>$row["upNum"],"flowerNum"=>$row["flowerNum"],"viewNum"=>$row["viewNum"]);
    } 
    print_r(json_encode($output));
  }

  function getAllLiveRoom()
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql="select * from LiveRoom";
    $result=mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("avatar"=>$row["avatar"],"nickName"=>$row["nickName"],"liveRoomId"=>$row["liveRoomId"],"liveType"=>$row["liveType"],"liveRoomIntro"=>$row["liveRoomIntro"],"viewNum"=>$row["viewNum"],"imgUrl"=>$row["imgUrl"]);
    } 
    print_r(json_encode($output));
  }
  

  //获取直播数据
  function getLiveList($liveRoomId)
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql1="select * from LiveList where liveRoomId='$liveRoomId'";
    $result1 = mysqli_query($conn,$sql1);
    while ($row = mysqli_fetch_assoc($result1)) {
       $output[]=array("imgUrl"=>$row["imgUrl"],"create_time"=>$row["create_time"],"txt"=>$row["txt"]);
    } 
    print_r(json_encode($output));
  }
  //获取所有评论
  function getAllComments($liveRoomId)
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql1="select * from COMMENTS where liveRoomId='$liveRoomId'";
    $result1 = mysqli_query($conn,$sql1);
    while ($row = mysqli_fetch_assoc($result1)) {
       $output[]=array("nickName"=>$row["nickName"],"imgUrl"=>$row["imgUrl"],"create_time"=>$row["create_time"],"txt"=>$row["txt"]);
    } 
    print_r(json_encode($output));
  }

  //添加直播数据
  function addLiveList()
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $liveRoomId=$_GET["liveRoomId"];
    $create_time=$_GET["create_time"];
    $txt=$_GET["txt"];
    $imgUrl=$_GET["imgUrl"];
    $sql="insert into LiveList values(null,'$liveRoomId','$create_time','$txt','$imgUrl')";
    $result = mysqli_query($conn,$sql);
    if($result)
    {
      getLiveList($liveRoomId);
    }
  }

  //添加评论
  function addComment()
  {    
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $liveRoomId=$_GET["liveRoomId"];
    $create_time=$_GET["create_time"];
    $txt=$_GET["txt"];
    $nickName=$_GET["nickName"];
    $imgUrl=$_GET["imgUrl"];
    $sql="insert into COMMENTS values(null,'$liveRoomId','$create_time','$txt','$nickName','$imgUrl')";
    $result = mysqli_query($conn,$sql);
    if($result)
    {
      getAllComments($liveRoomId);
    }
  }

  //添加用户
  function addUser(){
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $openId=$_GET["openId"];    

    $sql="select * from liveUser where openId='$openId'";
    $result = mysqli_query($conn,$sql);
    if(!($row = mysqli_fetch_assoc($result)))//如果不存在
    {
      $sql1 = "insert into liveUser values(null,'$openId',0,100)";
      $result1 = mysqli_query($conn,$sql1);
    }
    $sql2="select * from liveUser where openId='$openId'";
    $result2=mysqli_query($conn,$sql2);
    if($row1 = mysqli_fetch_assoc($result2))
    {
      $userId=$row1["userId"];
      echo $userId;
    }    
  }  
class Live extends CI_Controller {
    public function index() { } 
    }
