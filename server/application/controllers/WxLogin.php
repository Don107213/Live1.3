<?php
$code = $_GET["code"];
$wxAppID = 'wx034ce54e828ca871';
$wxAppSecret = 'd259995b23bdb35728a91ab061675797';
$loginUrl1="https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
$loginUrl = sprintf($loginUrl1, $wxAppID, $wxAppSecret,$code);
	$ch = curl_init();
	$timeout = 10;
	try{
		curl_setopt ($ch, CURLOPT_URL, $loginUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

		 // 设置为false仅用于测试，生产环境请设置为true
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$res = curl_exec($ch);
		curl_close($ch);
		$resArray = json_decode($res,true);
		echo json_encode($resArray);
	}
	catch (Excetption $e){
		echo json_encode($e);
	}

class WxLogin extends CI_Controller {
    public function index() { } }