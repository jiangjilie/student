<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
$act=get('act','');

if($act=='upfj'){
	$start=get('start',0);
	$fsize=get('fsize',0);
	$tname=get('tname');
	$oldname=get('oldname');
	$extname=strtolower(strrchr($oldname,'.'));
	
	
	$tname=str_replace('/', '', str_replace('\\', '', $tname));
	if($start==0 && $tname=='')$tname='tmp_'.date('Ymd').'_'.mt_rand(10000, 99999);
	$fname=$tname;
	
	
	$fw=fopen($fname.'.tmp','a+');
	fseek($fw,intval($start));
	fwrite($fw,file_get_contents('php://input'));
	fclose($fw);
	chmod($fname.'.tmp',0777);
	if(filesize($fname.'.tmp')==$fsize){
		$newname='f'.date('YmdHis').$extname;
		rename($fname.'.tmp',$newname);
		$fid=1;
		echo '{"result":"ok","tname":"'.$tname.'","filestate":1,"msg":"上传结束！","data":{"id":'.$fid.',"url":"/test/'.$newname.'","filename":'.json_encode($newname).',"oldname":'.json_encode($oldname).',"size":"'.$fsize.'","invalid":"0","uptime":"'.date('Y-m-d H:i:s').'"}}';
	}else{
		echo '{"result":"ok","tname":"'.$tname.'","filestate":0,"msg":"继续上传！"}';
	}
	exit();
}

if($act=='upfile'){
	$start=get('start',0);
	$fsize=get('fsize',0);
	$tname=get('tname');
	$oldname=get('oldname');
	$extname=strtolower(strrchr($oldname,'.'));
	
	if($extname!='.jpeg' && $extname!='.jpg' && $extname!='.png' && $extname!='.gif' && $extname!='.bmp'){
		msgtxt('只能上传jpg/png/gif/bmp图片');
	}
	
	
	$tname=str_replace('/', '', str_replace('\\', '', $tname));
	if($start==0 && $tname=='')$tname='tmp_'.date('Ymd').'_'.mt_rand(10000, 99999);
	$fname=$tname;


	$fw=fopen($fname.'.tmp','a+');
	fseek($fw,intval($start));
	fwrite($fw,file_get_contents('php://input'));
	fclose($fw);
	chmod($fname.'.tmp',0777);
	if(filesize($fname.'.tmp')==$fsize){
		$newname='f'.date('YmdHis').$extname;
		rename($fname.'.tmp',$newname);
		$fid=1;
		echo '{"result":"ok","tname":"'.$tname.'","filestate":1,"msg":"上传结束！","data":{"id":'.$fid.',"url":"upfiles/'.$newname.'","filename":'.json_encode($newname).',"oldname":'.json_encode($oldname).',"size":"'.$fsize.'","invalid":"0","uptime":"'.date('Y-m-d H:i:s').'"}}';
	}else{
		echo '{"result":"ok","tname":"'.$tname.'","filestate":0,"msg":"继续上传！"}';
	}
	exit();
}

function get($key,$defaultvalue=''){
	if($defaultvalue==='')
		return empty($_GET[$key])?'':$_GET[$key];
	else
		return intval(empty($_GET[$key])?$defaultvalue:$_GET[$key]);
}
?>