<?php

$liveRoomId=$_GET["liveRoomId"];

$mode=$_GET["mode"];
switch($mode)
{
  case "onUpTap":onUpTap();break;//改变点赞数
  case "checkUpStatus":checkUpStatus();break;
  case "updateUpNum":updateUpNum();break;
  case "addViwNum":addViwNum();break;
  case "subtractViewNum":subtractViewNum();break;
}

function subtractViewNum(){
 $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $liveRoomId=$_GET["liveRoomId"];
  $sql="update LiveRoom set viewNum=viewNum-1 where liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
}

function addViwNum(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $liveRoomId=$_GET["liveRoomId"];
  $sql="update LiveRoom set viewNum=viewNum+1 where liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
  $sql1="select *from LiveRoom where liveRoomId='$liveRoomId'";
  $result1 = mysqli_query($conn,$sql1);
  while ($row = mysqli_fetch_assoc($result1)) {
       $output[]=array("viewNum"=>$row["viewNum"]);
  }
  print_r(json_encode($output));
}

function updateUpNum(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $liveRoomId=$_GET["liveRoomId"];
  $sql="select count(*) as upNum from UpStatus where liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
  while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("upNum"=>$row["upNum"]);
  }
  print_r(json_encode($output));
}

function checkUpStatus(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $upUserId=$_GET["upUserId"];
  $liveRoomId=$_GET["liveRoomId"];
  $sql="select * from UpStatus where upUserId='$upUserId'and liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
  if(!($row = mysqli_fetch_assoc($result)))//如果不存在
  {
    $upStatus=0;
  }
  else
  {
    $upStatus=1;
  }
  echo $upStatus;
}

function onUpTap(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $upUserId=$_GET["upUserId"];
  $liveRoomId=$_GET["liveRoomId"];
  $sql="select * from UpStatus where upUserId='$upUserId'and liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
  if(!($row = mysqli_fetch_assoc($result)))//如果不存在
  {
    $sql1 = "insert into UpStatus values('$liveRoomId','$upUserId')";
    $result1 = mysqli_query($conn,$sql1);
    $sql2 ="update LiveRoom set upNum=upNum+1 where liveRoomId='$liveRoomId'";
    $result2 = mysqli_query($conn,$sql2);
    $upStatus=1;
  }
  else
  {
    $sql1 = "delete from UpStatus where upUserId='$upUserId'and liveRoomId='$liveRoomId'";
    $result1 = mysqli_query($conn,$sql1);
    $sql2 ="update LiveRoom set upNum=upNum-1 where liveRoomId='$liveRoomId'";
    $result2 = mysqli_query($conn,$sql2);
    $upStatus=0;
  }
  echo $upStatus;
}


class LiveRoom extends CI_Controller {
    public function index() { } }